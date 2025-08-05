const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("endgame")
    .setDescription("End the game(no perms set up, please don't use this unless you're fox or cat)"),
    async execute(interaction){
        if (!global.game.ongoing){
            interaction.reply({ content: 'Stop what??', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (global.game.host != interaction.member.id){
		    interaction.reply({ content: 'You ain\'t the host bitch', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        interaction.reply("Game stopped by "+interaction.member.displayName);
        global.game.host = "";
        global.game.ongoing = false;
        global.game.started = false;
    }
}