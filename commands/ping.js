const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const erreurEnvoiMp = new MessageEmbed()
	.setColor('#FF0000')
	.setTitle('Erreur')
	.setDescription('le destinataire ne peut pas recevoir de mp')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("to Pong someone's dm!")
		.addUserOption(option =>
			option.setName('user')
				.setDescription('the user to ping')
				.setRequired(true)),
	async execute(interaction, client) {
		// client.users.get(interaction.options.getUser("user")["id"]).send({ files: ["..\\images\\pong.gif"] })
		// .catch(() => (client.channels.get(interaction.channel.id).send({ embeds: [erreurEnvoiMp] })));
		// return .author.send("message").catch(() => {
		// 	message.channel.send("User has DMs closed or has no mutual servers with the bot:(");
		// await interaction.reply(`<@${interaction.options.getUser("user")["id"]}> Pong!`);
		return interaction.reply("Rénovation en cours cette commande ne fonctionne pas")
	},
};