const { strikethrough } = require('@discordjs/builders');
const nodemon = require('nodemon');


const { Client, Intents, CommandInteraction } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');


const Tenor = require("tenorjs").client({
    "Key": "URP4460GCFU0", // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
});
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const exampleEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/AfFp7pu.png')
    .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true },
    )
    .addField('Inline field title', 'Some value here', true)
    .setImage('https://i.imgur.com/AfFp7pu.png')
    .setTimestamp()
    .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');


// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const erreurEnvoiMp = new MessageEmbed()
    .setColor('#FF0000')
    .setTitle('Erreur')
    .setDescription('le destinataire ne peut pas recevoir de mp')


    if (commandName === 'ping') {
        client.users.fetch(interaction.options.getUser("user")["id"]).then(dm => {
            dm.send({files: ["images\\pong.gif"]}).catch(() => (client.channels.fetch(interaction.channel.id).then(dm => {
                dm.send({ embeds: [erreurEnvoiMp] })
            })
        ));
        })
        await interaction.reply(`<@${interaction.options.getUser("user")["id"]}> Pong!`);
    } else if (commandName === 'server') {
        await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    } else if (commandName === 'user') {
        await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
    } else if (commandName === 'salut') {
        await interaction.reply('Salut à tous les amis');
    } else if (commandName === 'exemple') {
        await interaction.reply({ embeds: [exampleEmbed] });
    }else if (commandName === 'gif') {
        Tenor.Search.Random((interaction.options.getString("thème") != undefined? interaction.options.getString("thème"):""), "1").then(Results => {
            Results.forEach(Post => {
                interaction.reply(Post.url);
            });         
        }).catch(console.error);
    }
});
// Login to Discord with your client's token
//TODO: faire une option de sondage

client.login(token);

