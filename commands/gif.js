const { SlashCommandBuilder } = require('@discordjs/builders');
const { tenorjs } = require('../config.json');
const Tenor = require("tenorjs").client(tenorjs);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription("Replies with a random Gif")
        .addStringOption(option =>
            option.setName('thème')
                .setDescription('le thème du gif')),

    async execute(interaction) {
        Tenor.Search.Random((interaction.options.getString("thème") != undefined ? interaction.options.getString("thème") : ""), "1").then(Results => {
            Results.forEach(Post => {
                interaction.reply(Post.url);
            });
        }).catch(console.error);
    },
};