const { strikethrough } = require('@discordjs/builders');
const fs = require('fs');
const { Client, Collection, Intents, CommandInteraction } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Recupération des fichiers js des commandes
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}



// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

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

