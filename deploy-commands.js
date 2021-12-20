const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');


const commands = [
	// new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder().setName('salut').setDescription('pour dire bonjour!'),
	new SlashCommandBuilder().setName('exemple').setDescription('avoir un exemple des embed!!!'),
	new SlashCommandBuilder().setName('ping').setDescription('ping quelqu\'un')	.addUserOption(option =>
		option.setName('user')
			.setDescription('the user to ping')
			.setRequired(true)),
	new SlashCommandBuilder().setName('gif').setDescription('envoyer un gif random sur un theme')	.addStringOption(option =>
		option.setName('thème')
			.setDescription('le thème du gif'))
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);


	// TODO : add poll command