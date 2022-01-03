const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('salut')
		.setDescription("pour dire bonjour!"),
	async execute(interaction) {
		console.log("/salut effectué")
        return interaction.reply('Joyeuses Fêtes à tous les amis');
    },
};