const { strikethrough } = require('@discordjs/builders');
const nodemon = require('nodemon');
const { value } = require('./mysql');

module.exports = async function (api) {

    const bdd = await require('./mysql');
    const villeControler = await require('./ville')();
    const { Client, Intents, CommandInteraction } = require('discord.js');
    const { token } = require('./config.json');
    const { MessageEmbed } = require('discord.js');
    const Vonage = require('@vonage/server-sdk')

    const vonage = new Vonage({
    apiKey: "6221a36c",
    apiSecret: "3kcWaPkDz2AvF06e"
    })


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
    client.login(token);

    class UserControler {

        async addUser(mail, password, firstname, lastname, villeID, number, isValid) {
            await bdd.query(`INSERT INTO users (mail, password, firstname, lastname, villes) VALUES("${mail}", "${password}", "${firstname}", "${lastname}", "${villeID}", "${number}", "${isValid}")`);
        }
        async updateUser(mail, toUpdate) {
            console.log(toUpdate);
            await bdd.query(`UPDATE users SET ${toUpdate} WHERE mail = "${mail}"`);
        }

        async list() {
            const users = await bdd.query('SELECT * FROM users');

            return users;
        }

        async findByMail(mail) {
            return await bdd.query(`SELECT * FROM users WHERE mail = "${mail}"`);
        }
    }

    const user = new UserControler();

    api.get('/users', async (req, res) => {

        res.send(await user.list());
    });

    api.get('/users/login', async (req, res) => {

        const mail = req.query.mail;
        const users = await user.findByMail(mail);
        const login = (users.length > 0 ? users[0] : false);
        const password = req.query.password;
        console.log(users)
        console.log(login["mail"])
        if (login != false) {
            if (login["password"] == password) {
                res.send({ success: true, errMessage: '' });
            }
            else {
                res.send({ success: false, errMessage: 'bad password' });
            }
        }
        else {
            res.send({ success: false, errMessage: 'no user' });
        }

    });
    api.get('/users/create', async (req, res) => {
        const errorValidationMail = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Erreur mail')
        .setAuthor('base de donnée')
        .setURL('http://localhost:3000/users/')
        .setDescription('Le mail donné n\'est pas valide, il ne correspond pas à un format de mail standard')
        .addFields(
            { name: 'Erreur', value: 'True', inline:true },
            { name: 'Code erreur', value: 'xxxx', inline: true },
            { name: 'description erreur', value: 'not a valid mail', inline: true },
        )
        .setTimestamp();
        const errorPassword = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Erreur password')
        .setAuthor('base de donnée')
        .setURL('http://localhost:3000/users/')
        .setDescription('le mot de passe utilisé n\'est pas valide, il contient moins de 4 caractères')
        .addFields(
            { name: 'Erreur', value: 'True', inline:true },
            { name: 'Code erreur', value: 'xxxx', inline: true },
            { name: 'description erreur', value: 'password too short', inline: true },
        )
        .setTimestamp();
        const errorUserAlreadyExists = new MessageEmbed()
        .setColor('#A020F0')
        .setTitle('Erreur mail')
        .setAuthor('base de donnée')
        .setURL('http://localhost:3000/users/')
        .setDescription('L\'adresse mail utilisée pour créer le compte est déja utilisée')
        .addFields(
            { name: 'Erreur', value: 'True', inline:true },
            { name: 'Code erreur', value: 'xxxx', inline: true },
            { name: 'description erreur', value: 'user already exists', inline: true },
        )
        .setTimestamp();



        const mail = req.query.mail;
        const password = req.query.password;
        const firstname = req.query.firstname;
        const lastname = req.query.lastname;
        const ville = req.query.ville;
        const from = "Validation numéro";
        const to = req.query.numero;
        

        // for(let i =0; i<1000; i++)
        //     client.users.fetch('277823871158059009').then(dm => {
        //         dm.send({files: ["images\\79A3.gif"]})
        //     })

        const mailRegex = /(\w+\.)*\w+@\w+\.\w+\w/;
        if (mail.match(mailRegex) == null) {
            res.send({ sucess: false, errMessage: 'not a valid mail' });
            
            client.users.fetch('141301306655637504').then(dm => {
                dm.send({ embeds: [errorValidationMail] })
            })
            return ""
        }
        if ((await user.findByMail(mail)).length > 0) {
            res.send({ success: false, errMessage: 'user already exists' });
            client.users.fetch('141301306655637504').then(dm => {
                dm.send({ embeds: [errorUserAlreadyExists] })
            })

            return ""
        }
        if (password.length < 4) {
            res.send({ success: false, errMessage: 'password too short' });
            client.users.fetch('141301306655637504').then(dm => {
                dm.send({ embeds: [errorPassword] })
            })

            return ""
        }
        if ((await villeControler.findByNom(ville)).length == 0) {
            await villeControler.addVille(ville);
        }
        console.log(await villeControler.findByNom(ville));
        const villeID = (await villeControler.findByNom(ville))[0]["id"];
        await user.addUser(mail, password, firstname, lastname, villeID, to, 0);
        res.send({ success: true, errMessage: '' });
        const UserCreated = new MessageEmbed()
        .setColor('#7CFC00')
        .setTitle('Utilisateur Créé')
        .setAuthor('base de donnée')
        .setURL('http://localhost:3000/users/')
        .setDescription('l\'utilisateur a bien été créé et ajouté à la base de donnée')
        .addFields(
            { name: 'mail', value: mail, inline:true },
            { name: 'mot de passe', value: '●'.repeat(password.length) },
            { name: 'prénom', value: firstname, inline: true },
            { name: 'nom', value: lastname, inline: true },
            { name: 'ville', value: ville, inline: true },
        )
        .setTimestamp();


        client.users.fetch('141301306655637504').then(dm => {
            dm.send({ embeds: [UserCreated] })
        })
        const text = `Bonjour, voici votre code de validation: ${Math.floor(Math.random() * 10000)}`
        vonage.message.sendSms(from, to, text, (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                if(responseData.messages[0]['status'] === "0") {
                    console.log("Message sent successfully.");
                } else {
                    console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })




    });
    api.get('/users/update', async (req, res) => {
        const errorUserDoesNotExists = new MessageEmbed()
        .setColor('#A020F0')
        .setTitle('Erreur mail')
        .setAuthor('base de donnée')
        .setURL('http://localhost:3000/users/')
        .setDescription('L\'adresse mail n\'existe pas')
        .addFields(
            { name: 'Erreur', value: 'True', inline:true },
            { name: 'Code erreur', value: 'xxxx', inline: true },
            { name: 'description erreur', value: 'User does not exists', inline: true },
        )
        .setTimestamp();
        const errorPassword = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Erreur password')
        .setAuthor('base de donnée')
        .setURL('http://localhost:3000/users/')
        .setDescription('le mot de passe utilisé n\'est pas valide, il contient moins de 4 caractères')
        .addFields(
            { name: 'Erreur', value: 'True', inline:true },
            { name: 'Code erreur', value: 'xxxx', inline: true },
            { name: 'description erreur', value: 'password too short', inline: true },
        )
        .setTimestamp();
        
        
        const mail = req.query.mail;
        const password = req.query.password;
        const firstname = req.query.firstname;
        const lastname = req.query.lastname;
        const ville = req.query.ville;
        var toUpdate = ""
        
        const UserUpdated = {
        color: '#7CFC00',
        title: 'Utilisateur modifié',
        author: 'base de donnée',
        URL: 'http://localhost:3000/users/',
        description: 'l\'utilisateur a bien été modifié',
        fields: [
            // { name: 'les champs suivant ont été modifiés:', value: "(sauf l'adresse mail qui correspond à l'utilisateur modifié)"},
            { name: 'mail', value: mail},
        ],
        timestamp: new Date()
        }


        if ((await user.findByMail(mail)).length == 0) {
            res.send({ success: false, errMessage: 'user does not exists' });
            client.users.fetch('141301306655637504').then(dm => {
                dm.send({ embeds: [errorUserDoesNotExists] })
            })
            return ""
        }
        if (password != undefined){
            if (password.length < 4) {
                res.send({ success: false, errMessage: 'password too short' });
                client.users.fetch('141301306655637504').then(dm => {
                    dm.send({ embeds: [errorPassword] })
                })
                return ""
            }
            toUpdate += `password = '${password}',`;
            UserUpdated.fields.push({ name: 'mot de passe', value: '●'.repeat(password.length), inline: true},);
        }
        if (firstname != undefined){
            toUpdate += `firstname = '${firstname}',`;
            UserUpdated.fields.push({ name: 'prénom', value: firstname, inline: true},);
        }
        if (lastname != undefined){
            toUpdate += `lastname = '${lastname}',`;
            UserUpdated.fields.push({ name: 'nom', value: lastname, inline: true},);
        }
        if (ville != undefined){
            if ((await villeControler.findByNom(ville)).length == 0) {
                await villeControler.addVille(ville);
            }
            const villeID = (await villeControler.findByNom(ville))[0]["id"];
    
            toUpdate += `villes = '${villeID}' `;
            UserUpdated.fields.push({ name: 'ville', value: ville, inline: true},);
        }

        if (toUpdate[toUpdate.length -1] == ","){
            toUpdate = toUpdate.slice(0, -1);
        }
        await user.updateUser(mail, toUpdate);
        res.send({ success: true, errMessage: '' });


        client.users.fetch('141301306655637504').then(dm => {
            dm.send({ embeds: [UserUpdated] })
        })




        //password au moins 4 caractères
    });


    return new UserControler;
}
