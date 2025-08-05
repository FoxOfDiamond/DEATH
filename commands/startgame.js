const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
        .setName("startgame")
        .setDescription("Start the game"),
    async execute(interaction) {
        if (!global.game.ongoing) {
            interaction.reply({
                content: 'No game active, host one',
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
        if (global.game.started) {
            interaction.reply({
                content: 'Game already started',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        global.game.started = true
        global.game.round = 0
        interaction.reply("Game starting");

        global.game.funcs.nextRound();
    }
}