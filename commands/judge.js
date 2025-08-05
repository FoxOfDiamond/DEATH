const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
        .setName("judge")
        .setDescription("Judge your victim")
        .addStringOption(option =>
            option.setName("judgement")
            .setDescription("...your judgement.")
            .setRequired(true)
        ),
    async execute(interaction) {
        if (!global.game.ongoing) {
            interaction.reply({
                content: 'No game active, host one',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (!global.game.started) {
            interaction.reply({
                content: 'Game hasn\'t started, wait for the host',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (global.game.prompt == "") {
            interaction.reply({
                content: 'Not judgement time',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (global.game.players.indexOf(interaction.member.id) == -1) {
            interaction.reply({
                content: 'You\'re not in this game',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        let judged = false;
        for (const [key, value] of Object.entries(global.game.judges)) {
            if (interaction.member.id == value) {
                if (global.game.answers[key]) {
                    global.game.funcs.log("<@"+interaction.member.id + "> judges <@" + key + ">: "+interaction.options.getString('judgement'),false)
                    interaction.reply("<@" + interaction.member.id + "> judged <@" + key + ">'s answer.");
                    global.game.judgements[key] = interaction.options.getString('judgement')
                    judged = true
                    break;
                }
            }
        }
        if (judged) {
            let count = 0
            for (const [key, value] of Object.entries(global.game.judgements)) {
                count++
            }
            if (count == global.game.players.length) {
                global.game.funcs.fate()
            }
        } else {

            interaction.reply({
                content: "Your victim hasn't given an answer yet",
                flags: discordjs.MessageFlags.Ephemeral
            });
        }
    }
}