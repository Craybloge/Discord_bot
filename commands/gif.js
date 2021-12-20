const { SlashCommandBuilder } = require('@discordjs/builders');
const Tenor = require("tenorjs").client({
    "Key": "URP4460GCFU0", // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription("Replies with server info!"),
	async execute(interaction) {
        Tenor.Search.Random((interaction.options.getString("thème") != undefined? interaction.options.getString("thème"):""), "1").then(Results => {
            Results.forEach(Post => {
                interaction.reply(Post.url);
            });         
        }).catch(console.error);
    },
};