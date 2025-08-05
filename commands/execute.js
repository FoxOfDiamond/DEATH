const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("execute")
    .setDescription("Executes someone")
    .addUserOption(option=>
        option.setName("victim")
        .setDescription("Your target")
        .setRequired(true)
    ),
    async execute(interaction){
        interaction.reply("Executed <@"+interaction.options.getUser("victim").id+">.");
    }
}