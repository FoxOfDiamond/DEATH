const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks someone from the game")
    .addUserOption(option=>
        option.setName("victim")
        .setDescription("Your target")
        .setRequired(true)
    ).addUserOption(option=>
        option.setName("successor")
        .setDescription("If you kick yourself, you may pick another host")
        .setRequired(false)
    ),
    async execute(interaction){
        if (global.game.host != interaction.member.id) {
            interaction.reply({
                content: 'You ain\'t the host bitch',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (!global.game.ongoing) {
            interaction.reply({
                content: 'No game found-',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }

        let id = interaction.options.getUser("victim").id
		if(global.game.players.indexOf(id)!=-1){
            if (global.game.host == id){   
                let successor = interaction.options.getUser("successor")
                if (successor){
                    global.game.host = successor.id
                }else{
                    interaction.reply("Pick someone else to sit at the throne.");
                    return
                }
            }
            if (global.game.intermission || !global.game.started){
			    global.game.players.splice(global.game.players.indexOf(id),1)
            }else{ 
			    global.game.kickQueue.push(id)
            }
            interaction.reply("Kicked <@"+id+">. They may rejoin next round");
		}else{  
            interaction.reply("Kick who??");
        }
    }
}