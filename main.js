const discordjs = require('discord.js');
const fs = require('fs');
const path = require('path');
const token = "MTQwMDMyOTk4MzIzMDA4NzIyOA.G3vILi.Ww6n0iTDgiZSOwrrAuvsltDDySZRI6JGPDPePw"
const clientId = "1400329983230087228";
const client = new discordjs.Client({
	intents: [discordjs.GatewayIntentBits.GuildMessageReactions, discordjs.GatewayIntentBits.GuildMessages, discordjs.GatewayIntentBits.Guilds, discordjs.GatewayIntentBits.MessageContent],
	partials: [discordjs.Partials.Message, discordjs.Partials.Channel, discordjs.Partials.Reaction]
});
const rest = new discordjs.REST().setToken(token);

global.client = client
global.game = {
	arrived: false,

	host: "",
	ongoing: false,
	started: false,
	players: [],
	round: 0,
	prompt: "",
	promptWriter: "",
	answers: {},
	judgements: {},
	judges: {},
	log: [],
	channel: "",
	reveal: -1,
	kickQueue: [],
	intermission : false,
	revealDone : false,
	funcs: {}
}
global.game.funcs.log = async function (msg, send = true) {
	channel = global.client.channels.cache.get(global.game.channel);
	if (channel != null && send) {
		await channel.send(msg)
	}
	global.game.log.push(msg)
}
global.game.funcs.logreply = async function (msg, interaction) {
	interaction.reply(msg)
	global.game.log.push(msg)
}
global.game.funcs.nextRound = async function () {
	global.game.log = []
	global.game.answers = {}
	global.game.judgements = {}
	global.game.kickQueue = []
	global.game.reveal = -1
	global.game.round += 1
	global.game.intermission = false
	global.game.revealDone = false
	await global.game.funcs.log("Round " + global.game.round+". Host: <@"+global.game.host+">")

	let offset = global.game.round % global.game.players.length
	if (global.game.nextWriter){
		global.game.promptWriter = global.game.nextWriter
		global.game.nextWriter = null
	}else{
		global.game.promptWriter = global.game.players[offset-1]
	}
	
	await global.game.funcs.log("<@" + global.game.promptWriter + "> writes the prompt. /prompt to submit")
	global.game.prompt = ""
}
global.game.funcs.submitPrompt = async function () {
	await global.game.funcs.log("# Prompt: " + global.game.prompt)
	await global.game.funcs.log("Submit your answers with /answer")

	let offset = global.game.round % (global.game.players.length-1)+1
	for (let i = 0; i < global.game.players.length; i++) {
		let ind = (offset + i) % global.game.players.length
		global.game.judges[global.game.players[i]] = global.game.players[ind]
		await global.game.funcs.log("<@" + global.game.players[ind] + "> judges <@" + global.game.players[i] + ">")
	}
	await global.game.funcs.log("## Now go!")
}
global.game.funcs.fate = async function () {
	await global.game.funcs.log("The judges have finished.")
	await global.game.funcs.log("Your fates have been sealed.")
	await global.game.funcs.log("<@"+global.game.host+"> use /reveal to show the judgements")
	global.game.reveal = 0
	await global.game.funcs.log("The prompt was: " + global.game.prompt)
}
global.game.funcs.end = async function () {
	channel = global.client.channels.cache.get(global.game.channel);
	let strLog = global.game.log.join("\n")
	const file = new discordjs.AttachmentBuilder(Buffer.from(strLog), {
		name: "Round" + global.game.round + "Log.txt",
	});
	await global.game.funcs.log("Round ended. Wait for the host to continue. Other people may join during the intermission.")
	await channel.send({
		files: [file]
	});

	global.game.intermission = true
	global.game.kickQueue.forEach(id=>{
		if(global.game.players.indexOf(id)!=-1){
			global.game.players.splice(global.game.players.indexOf(id),1)
		}
	})
}
while (!client) {}
client.once('ready', () => {
	console.log(`Online`)
});

client.on(discordjs.Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = commands.find((val) => {
		if (val.builder.name == (interaction.commandName)) {
			return true
		}
	});

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		const rep = await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: discordjs.MessageFlags.Ephemeral
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: discordjs.MessageFlags.Ephemeral
			});
		}
	}
})

client.on(discordjs.Events.ClientReady, (async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const send = [];
		commands.forEach(element => {
			send.push(element.builder.toJSON())
		});

		const data = await rest.put(
			discordjs.Routes.applicationCommands(clientId), {
				body: send
			}
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}))

client.login(token)

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('builder' in command && 'execute' in command) {
		commands.push(command)
		console.log('Built ' + command.builder.name)
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "builder" or "execute" property.`);
	}
}