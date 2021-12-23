const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');


const ytdl = require("ytdl-core");

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
				.setName('skip')
				.setDescription('skip the current song'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('stop')
				.setDescription('stop the music and clear the queue')),

	async execute(interaction, serverQueue) {
		if (interaction.options.getSubcommand() === 'play') {
			const url = interaction.options.getString("link")
			const voiceChannel = interaction.member.voice.channel;
			console.log(voiceChannel.id)
			if (!voiceChannel)
				return interaction.reply(
					"You need to be in a voice channel to play music!"
				);
			const permissions = voiceChannel.permissionsFor(interaction.client.user);
			if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
				return interaction.reply(
					"I need the permissions to join and speak in your voice channel!"
				);
			}

			const songInfo = await ytdl.getInfo(url);
			const song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
			};
			console.log(songInfo.videoDetails.title)
			if (!serverQueue) {
				// Creating the contract for our queue
				const queueContruct = {
					textChannel: interaction.channel,
					voiceChannel: voiceChannel,
					connection: null,
					songs: [],
					volume: 5,
					playing: true,
				};

				// Setting the queue using our contract
				queue.set(interaction.guild.id, queueContruct);
				// Pushing the song to our songs array
				queueContruct.songs.push(song);

				try {
					// Here we try to join the voicechat and save our connection into our object.
					const connection = joinVoiceChannel({
						channelId: voiceChannel.id,
						guildId: voiceChannel.guild.id,
						adapterCreator: interaction.channel.guild.voiceAdapterCreator,
					});
					// var connection = await voiceChannel.join();
					queueContruct.connection = connection;
					// Calling the play function to start a song
					play(interaction.guild, queueContruct.songs[0]);
					
					const subscription = connection.subscribe(audioPlayer);

					// subscription could be undefined if the connection is destroyed!
					if (subscription) {
						// Unsubscribe after 5 seconds (stop playing audio on the voice connection)
						setTimeout(() => subscription.unsubscribe(), 5_000);
					}
					return interaction.reply(`${song.title} est jouée maintenant`);
				} catch (err) {
					// Printing the error interaction if the bot fails to join the voicechat
					console.log(err);
					queue.delete(interaction.guild.id);
					return interaction.reply(err);
				}
			} else {
				serverQueue.songs.push(song);
				console.log(serverQueue.songs);
				return interaction.reply(`${song.title} has been added to the queue!`);
			}

		} else if (interaction.options.getSubcommand() === 'skip') {
			if (!interaction.member.voice.channel)
				return interaction.reply(
					"You have to be in a voice channel to stop the music!"
				);
			if (!serverQueue)
				return interaction.reply("There is no song that I could skip!");
			serverQueue.connection.dispatcher.end();
		} else if (interaction.options.getSubcommand() === 'stop') {
			if (!interaction.member.voice.channel)
				return interaction.reply(
					"You have to be in a voice channel to stop the music!"
				);

			if (!serverQueue)
				return interaction.reply("There is no song that I could stop!");

			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end();
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

