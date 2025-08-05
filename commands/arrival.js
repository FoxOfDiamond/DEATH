const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("arrival")
    .setDescription("Announce it's presence"),
    async execute(interaction){
        if (global.game.arrived){
            interaction.reply({
                content: 'They know.',
                flags: discordjs.MessageFlags.Ephemeral
            });
        }else{
            interaction.reply("# ***THE BITCH IS HERE***");
            global.game.arrived = true;
        }
    }
}