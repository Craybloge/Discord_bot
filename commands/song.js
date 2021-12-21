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
			const url = interaction.options.getString("thème")
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
			const songInfo = await ytdl.getInfo(url);
			const song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
			};

			if (!serverQueue) {
				// Creating the contract for our queue
				const queueContruct = {
					textChannel: message.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 5,
					playing: true,
				};
				// Setting the queue using our contract
				queue.set(message.guild.id, queueContruct);
				// Pushing the song to our songs array
				queueContruct.songs.push(song);

				try {
					// Here we try to join the voicechat and save our connection into our object.
					var connection = await voiceChannel.join();
					queueContruct.connection = connection;
					// Calling the play function to start a song
					play(message.guild, queueContruct.songs[0]);
				} catch (err) {
					// Printing the error message if the bot fails to join the voicechat
					console.log(err);
					queue.delete(message.guild.id);
					return message.channel.send(err);
				}
			} else {
				serverQueue.songs.push(song);
				console.log(serverQueue.songs);
				return message.channel.send(`${song.title} has been added to the queue!`);
			}

		} else if (interaction.options.getSubcommand() === 'stop') {

		} else if (interaction.options.getSubcommand() === 'skip') {

		}


		function play(guild, song) {
			const serverQueue = queue.get(guild.id);
			if (!song) {
				serverQueue.voiceChannel.leave();
				queue.delete(guild.id);
				return;
			}
		}
	},

};

