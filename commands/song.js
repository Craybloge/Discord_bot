const { SlashCommandBuilder } = require('@discordjs/builders');

const queue = new Map();
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
        if (interaction.options.getSubcommand() === 'play') {

        } else if (interaction.options.getSubcommand() === 'stop') {
        
        } else if (interaction.options.getSubcommand() === 'skip') {

        }

        
        async function execute(message, serverQueue) {
            const args = message.content.split(" ");
          
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel)
              return message.channel.send(
                "You need to be in a voice channel to play music!"
              );
            const permissions = voiceChannel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
              return message.channel.send(
                "I need the permissions to join and speak in your voice channel!"
              );
            }
          }
    },
    
};

