const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("prompt")
    .setDescription("Submit your prompt")
    .addStringOption(option=>
        option.setName("prompt")
        .setDescription("...your prompt")
        .setRequired(true)
    ),
    async execute(interaction){
        if (!global.game.ongoing){
            interaction.reply({ content: 'No game active, host one', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (!global.game.started){
            interaction.reply({ content: 'Game hasn\'t started, wait for the host', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (global.game.prompt != ""){
            interaction.reply({ content: 'Not yet', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (global.game.promptWriter != interaction.member.id){
            interaction.reply({ content: 'You\'re not the writer', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        //interaction.reply("Prompt submitted!");
        global.game.prompt = interaction.options.getString('prompt')
        interaction.reply({ content: 'Submitted', flags: discordjs.MessageFlags.Ephemeral });

        global.game.funcs.submitPrompt();
    }
}