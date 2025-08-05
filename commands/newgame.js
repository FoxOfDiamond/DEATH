const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("newgame")
    .setDescription("Death by humans(and cats)(and sometimes foxes)"),
    async execute(interaction){
        if (global.game.ongoing){
		    interaction.reply({ content: 'Game already ongoing', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        global.game.host = interaction.member.id
        global.game.players = [interaction.member.id]
        global.game.channel = interaction.channelId
        global.game.ongoing = true
        global.game.started = false
        interaction.reply("Game hosted by "+interaction.member.displayName+", /joingame to join");
    }
}