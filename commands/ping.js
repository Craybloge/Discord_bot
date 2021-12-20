const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const erreurEnvoiMp = new MessageEmbed()
	.setColor('#FF0000')
	.setTitle('Erreur')
	.setDescription('le destinataire ne peut pas recevoir de mp')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("to Pong someone's dm!"),
	async execute(interaction) {
		client.users.fetch(interaction.options.getUser("user")["id"]).then(dm => {
			dm.send({ files: ["images\\pong.gif"] }).catch(() => (client.channels.fetch(interaction.channel.id).then(dm => {
				dm.send({ embeds: [erreurEnvoiMp] })
			})
			));
		})
		await interaction.reply(`<@${interaction.options.getUser("user")["id"]}> Pong!`);
	},
};