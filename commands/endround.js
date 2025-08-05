const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
        .setName("endround")
        .setDescription("End the current round and start the reveal, or conclude the round if those are done"),
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
                content: 'The round hasn\'t even started yet',
                flags: discordjs.MessageFlags.Ephemeral
            });
            return;
        }
        if (global.game.reveal == -1) {
            global.game.funcs.fate()
            global.game.funcs.logreply('Round prematurely ended',interaction);
        }else{
	        interaction.reply({ content: '/nextround to begin next round', flags: discordjs.MessageFlags.Ephemeral });
            global.game.funcs.end()
        }
    }
}