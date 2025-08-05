const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("answer")
    .setDescription("Answers the prompt")
    .addStringOption(option=>
        option.setName("answer")
        .setDescription("...your answer?")
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
        if (global.game.prompt == ""){
            interaction.reply({ content: 'Wait for a prompt', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
                if (global.game.players.indexOf(interaction.member.id) == -1){
                    interaction.reply({ content: 'You\'re not in this game', flags: discordjs.MessageFlags.Ephemeral });
                    return;
                }
        global.game.funcs.log("<@"+interaction.member.id + "> answers: "+interaction.options.getString('answer'),false)
        interaction.reply("<@"+interaction.member.id + "> submitted their answer. <@"+global.game.judges[interaction.member.id]+"> view their answer with /answerview, then send your judgement with /judge");
        global.game.answers[interaction.member.id] = interaction.options.getString('answer')
    }
}