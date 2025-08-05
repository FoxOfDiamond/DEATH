const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("baton_pass")
    .setDescription("Make someone the next prompt writer")
    .addUserOption(option=>
        option.setName("target")
        .setDescription("Your target")
        .setRequired(true)
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
        
        let id = interaction.options.getUser("target").id
        global.game.nextWriter = id;
        interaction.reply("The next prompt writer will be <@"+id+">.");
    }
}