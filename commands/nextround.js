const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
        .setName("nextround")
        .setDescription("Start the next round"),
    async execute(interaction) {
        if (!global.game.ongoing) {
            interaction.reply({
                content: 'No game found-',
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
                content: 'The first round hasn\'t even started yet chill',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (global.game.reveal == -1) {
            interaction.reply({
                content: 'Have some patience. /endround if you truly want to',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (global.game.revealDone){
            global.game.funcs.nextRound()
            interaction.reply('Next round started');
            return
        }
        interaction.reply({ content: 'Still revealin', flags: discordjs.MessageFlags.Ephemeral });
    }
}