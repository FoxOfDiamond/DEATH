const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("meow")
    .setDescription("Meows :3"),
    async execute(interaction){
        interaction.reply("MROWWWWWWWWWWW :3");
    }
}