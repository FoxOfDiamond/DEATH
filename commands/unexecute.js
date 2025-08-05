const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("unexecute")
    .setDescription("Unexecutes someone...what?")
    .addUserOption(option=>
        option.setName("victim")
        .setDescription("Your...unvictim?")
        .setRequired(true)
    ),
    async execute(interaction){
        interaction.reply("Unexecuted <@"+interaction.options.getUser("victim").id+">.");
    }
}