const discordjs = require('discord.js');

module.exports = {
    builder: new discordjs.SlashCommandBuilder()
    .setName("kidnap")
    .setDescription("Kidnap someone into a game")
    .addUserOption(option=>
        option.setName("victim")
        .setDescription("Your target")
        .setRequired(true)
    ),
    async execute(interaction){
        let id = interaction.options.getUser("victim").id
                if (global.game.host != interaction.member.id) {
                    interaction.reply({
                        content: 'You ain\'t the host bitch',
                        flags: discordjs.MessageFlags.Ephemeral
                    });
                    return;
                }
        if (global.game.players.indexOf(id) != -1){
            interaction.reply({ content: 'They\'re right here...', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (!global.game.ongoing){
            interaction.reply({ content: 'No game active, host one', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        if (global.game.started && !global.game.intermission){
            interaction.reply({ content: 'Game already started, wait for the current round to end', flags: discordjs.MessageFlags.Ephemeral });
            return;
        }
        interaction.reply("<@"+interaction.member.id + "> kidnapped <@"+id+"> into the game");
        global.game.players.push(id)
    }
}