const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('song')
        .setDescription("listen to music")
        .addSubcommand(subcommand =>
            subcommand
                .setName('play')
                .setDescription('play the song you linked')
                .addStringOption(option =>
                    option.setName('link')
                        .setDescription('a link to the song')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('stop the music'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('skip')
                .setDescription('skip the current song')),

    async execute(interaction) {
    
    },
};