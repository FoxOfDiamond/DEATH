const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("joingame")
    .setDescription("Join the foxing game"),
    async execute(interaction){
        if (!global.game.ongoing){
            interaction.reply({ content: 'No game active, host one', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (global.game.players.indexOf(interaction.member.id) != -1){
            interaction.reply({ content: 'You\'re already in mf/fm/ff/mm', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (global.game.started && !global.game.intermission){
            interaction.reply({ content: 'Game already started, wait for the current round to end', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        interaction.reply("<@"+interaction.member.id + "> joined the current game");
        global.game.players.push(interaction.member.id)
    }
}