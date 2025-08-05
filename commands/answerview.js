const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("answerview")
    .setDescription("View the answer of the person you're judging"),
    async execute(interaction){
        if (!global.game.ongoing){
            interaction.reply({ content: 'No game active, host one', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (!global.game.started){
            interaction.reply({ content: 'Game hasn\'t started, wait for the host', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (global.game.prompt == ""){
            interaction.reply({ content: 'Wait for a prompt', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (global.game.players.indexOf(interaction.member.id) == -1){
            interaction.reply({ content: 'You\'re not in this game', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        for (const [key,value] of Object.entries(global.game.judges)){
            if (interaction.member.id == value){
                if (global.game.answers[key]){
                    interaction.reply({ content: global.game.answers[key], flags: discordjs.MessageFlags.Ephemeral });
                    return;
                }
            }
        }
        interaction.reply({ content: "No answer found", flags: discordjs.MessageFlags.Ephemeral });
    }
}