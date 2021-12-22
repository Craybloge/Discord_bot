const bodyParser = require("body-parser");
const request = require("request");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { weatherKey } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const erreur = new MessageEmbed()
    .setColor('#FF0000')
    .setTitle('Erreur')
    .setDescription("la ville n'existe pas, veuillez réessayer")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription("get weather forecast")
        .addStringOption(option =>
            option.setName('city')
                .setDescription('the location of the weather forecast')
                .setRequired(true)),
    async execute(interaction) {
        let city = interaction.options.getString("city")
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`

        // Request for data using the URL
        request(url, function (err, response, body) {

            // On return, check the json data fetched
            if (err) {
                interaction.reply({ embeds: [erreur] })
            } else {
                let weather = JSON.parse(body);
                // you shall output it in the console just to make sure that the data being displayed is what you want
                console.log(weather);

                if (weather.main == undefined) {
                    interaction.reply({ embeds: [erreur] })
                } else {
                    // we shall use the data got to set up your output
                    let place = `${weather.name}, ${weather.sys.country}`,
                        /* you shall calculate the current timezone using the data fetched*/
                        weatherTimezone = `${new Date(
                            weather.dt * 1000 - weather.timezone * 1000
                        )}`;
                    let weatherTemp = `${weather.main.temp}`,
                        weatherPressure = `${weather.main.pressure}`,
                        /* you will fetch the weather icon and its size using the icon data*/
                        weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
                        weatherDescription = `${weather.weather[0].description}`,
                        humidity = `${weather.main.humidity}`,
                        clouds = `${weather.clouds.all}`,
                        visibility = `${weather.visibility}`,
                        main = `${weather.weather[0].main}`
                        const forecast = {
                            color : '#87CEEB',
                            name: 'Prévision météorologique',
                            title: `La mété prévue pour la ville de ${place}`,
                            fields: [
                                { 
                                    name: 'température',
                                    value: `${weatherTemp}°C`
                                },
                                { 
                                    name: 'nuages',
                                    value: clouds
                                },
                            ],
                            image: {
                                url: weatherIcon
                            },
                            description: weatherDescription
                        }

                        interaction.reply({ embeds: [forecast] })

                }

            }
        });
    },
};