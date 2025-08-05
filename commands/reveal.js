const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
        .setName("reveal")
        .setDescription("Reveal your fates"),
    async execute(interaction) {
        if (!global.game.ongoing) {
            interaction.reply({
                content: 'Reveal what',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (global.game.host != interaction.member.id) {
            interaction.reply({
                content: 'You ain\'t the host bitch',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (!global.game.started) {
            interaction.reply({
                content: 'So hasty?',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (global.game.reveal == -1) {
            interaction.reply({
                content: 'Now is not the time',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;

        }
        if (global.game.revealDone){
            interaction.reply({ content: '/nothing left to reveal. /endround to end the round', flags: discordjs.MessageFlags.Ephemeral });
            return
        }
        let player = global.game.players[global.game.reveal]

        let answer = global.game.answers[global.game.players[global.game.reveal]]
        let judgement = global.game.judgements[global.game.players[global.game.reveal]]
        answer = answer?answer:"unsubmitted"
        judgement = judgement?judgement:"unsubmitted"

        await global.game.funcs.log("<@" + global.game.players[global.game.reveal] + ">'s answer: " + answer)
        await global.game.funcs.log("<@" + global.game.judges[global.game.players[global.game.reveal]] + ">'s judgement: " + judgement+"\n _ _",interaction)
        global.game.reveal += 1
        if (global.game.reveal == global.game.players.length){
            global.game.revealDone = true
            interaction.reply({ content: '/endround to end the round', flags: discordjs.MessageFlags.Ephemeral });
        }else{
            interaction.reply({ content: '/reveal again to continue', flags: discordjs.MessageFlags.Ephemeral });
        }
    }
}