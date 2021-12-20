const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription("Replies with user info!")
        .addUserOption(option =>
            option.setName('user')
			.setDescription('the user to ping')
			.setRequired(true)),
	async execute(interaction) {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    },
};