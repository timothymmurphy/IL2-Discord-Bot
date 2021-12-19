// Import libraries
const {Client, Intents, MessageEmbed} = require("discord.js");
const axios = require('axios');

// Import config
const config = require("./config.json");

// Endpoint to query data from
const url = "http://stats.virtualpilots.fi:8000/static/currentInfo.json";

async function main(client) {
  // Get current mission statistics
  axios.get(url)
    .then(function (response) {
      // Store web response
      const content = response.data;

      // Convert milliseconds to dd:hh:mm:ss format
      function convertTime(milliseconds) {

        // Get days from milliseconds
        let days = milliseconds / (1000 * 60 * 60 * 24)
        let absoluteDays = Math.floor(days);
        let d = absoluteDays > 9 ? absoluteDays : '0' + absoluteDays;

        // Get remainder from days and convert to hours
        let hours = (days - absoluteDays) * 24;
        let absoluteHours = Math.floor(hours);
        let h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

        // Get remainder from hours and convert to minutes
        let minutes = (hours - absoluteHours) * 60;
        let absoluteMinutes = Math.floor(minutes);
        let m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;

        // Get remainder from minutes and convert to seconds
        let seconds = (minutes - absoluteMinutes) * 60;
        let absoluteSeconds = Math.floor(seconds);
        let s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;

        // Only return in hh:mm:ss format if days < 1
        if (d == 0) {
          return h + ':' + m + ':' + s;
        } 
        else { // Return in dd:hh:mm:ss format if days > 1
          return d + ':' + h + ':' + m + ':' + s;
        }
      };

      // Uppercase first letter of word
      function titleCase(string){
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
      };

      // Set content variables
      const missionTimeLeft = convertTime(content.timeleftMilliseconds);
      const mapTimeLeft = convertTime(content.rpsRotationMilliseconds);
      const numPlanes = content.rpsSet;
      const season = titleCase(content.seasonName);
      const cloudType = content.cloudName
        .match(/[A-Za-z]+/g);
      const cloudLevel = content.cloudLevelMeters;
      const cloudHeight = content.cloudHeightMeters;
      const temperature = content.temperatureCelsius;
      const arrWindSpeed = content.windSpeeds;
      const arrWindDirTo = content.windToDirections;
      const sector1 = content.sectors[0];
      const sector2 = content.sectors[1];
      const sector1Advance = (sector1.advanceMeters / 1000).toFixed(2);
      const sector2Advance = (sector2.advanceMeters / 1000).toFixed(2);

      // Create Message Embed
      const embed = new MessageEmbed()
      .setColor('B3F564')
      .setTitle('Virtual Pilots')
      .setDescription('Current Mission Information')
      .setURL('http://stats.virtualpilots.fi:8000/en/faq/')
      .setAuthor('MissionBot', '', 'https://github.com/timothymmurphy')
      .addFields(
        {name:'🕔 Mission Time Left', value: `${missionTimeLeft}`, inline: true},
        {name:'✈️ Current Plane Set', value: `${numPlanes}`, inline: true},
        {name:'🕔 Plane Set Rotation', value: `${mapTimeLeft}`, inline: true},
        {name:'🍃 Season', value: `${season}`, inline: true},
        {name:'☁️ Clouds',
          value: `Type: ${cloudType}\nLevel: ${cloudLevel}m\nHeight: ${cloudHeight}m`,
          inline: true
        },
        {name:'🌡 Temperature', value: `${temperature}\u00B0 C`, inline: true},
        {name:'💨 Wind',
          value: `0m: Direction to: ${arrWindDirTo[0]} speed: ${arrWindSpeed[0]}m/s\n500m: Direction to: ${arrWindDirTo[1]} speed: ${arrWindSpeed[1]}m/s\n1000m: Direction to: ${arrWindDirTo[2]} speed: ${arrWindSpeed[2]}m/s\n2000m: Direction to: ${arrWindDirTo[3]} speed: ${arrWindSpeed[3]}m/s\n5000m: Direction to: ${arrWindDirTo[4]} speed: ${arrWindSpeed[4]}m/s\n`,
          inline: true
        },
        {name: 'Axis Sector 1',
          value: `Front/Combat Ships: ${sector1.axisFrontPercentage}%\nConvoy Ships: ${sector1.axisConvoyShipsPercentage}%\nBridges: ${sector1.axisIntactBridges}/${sector1.axisBridges}\nFront Depot: ${sector1.axisFrontDepotPercentage}%\nRear Depot: ${sector1.axisRearDepotPercentage}%\nRailway Station: ${sector1.axisStationPercentage}%\nParatrooper Drops: ${sector1.axisParadropCount}`,
          inline: true
        },
        {name: 'Axis Sector 2',
          value: `Front/Combat Ships: ${sector2.axisFrontPercentage}%\nConvoy Ships: ${sector2.axisConvoyShipsPercentage}%\nBridges: ${sector2.axisIntactBridges}/${sector2.axisBridges}\nFront Depot: ${sector2.axisFrontDepotPercentage}%\nRear Depot: ${sector2.axisRearDepotPercentage}%\nRailway Station: ${sector2.axisStationPercentage}%\nParatrooper Drops: ${sector2.axisParadropCount}`,
          inline: true
        },
        {name: 'Sector Info',
          value: `Sector 1 Type: ${sector1.type}. ${sector1.advancingSide} projected advance: ${sector1Advance}km.\n\nSector 2 Type: ${sector2.type}. ${sector2.advancingSide} projected advance: ${sector2Advance}km.`,
          inline: true
        },
        {name: 'Allied Sector 1',
          value: `Front/Combat Ships: ${sector1.alliedFrontPercentage}%\nConvoy Ships: ${sector1.alliedConvoyShipsPercentage}%\nBridges: ${sector1.alliedIntactBridges}/${sector1.alliedBridges}\nFront Depot: ${sector1.alliedFrontDepotPercentage}%\nRear Depot: ${sector1.alliedRearDepotPercentage}%\nRailway Station: ${sector1.alliedStationPercentage}%\nParatrooper Drops: ${sector1.alliedParadropCount}`,
          inline: true
        },
        {name: 'Allied Sector 2',
          value: `Front/Combat Ships: ${sector2.alliedFrontPercentage}%\nConvoy Ships: ${sector2.alliedConvoyShipsPercentage}%\nBridges: ${sector2.alliedIntactBridges}/${sector2.alliedBridges}\nFront Depot: ${sector2.alliedFrontDepotPercentage}%\nRear Depot: ${sector2.alliedRearDepotPercentage}%\nRailway Station: ${sector2.alliedStationPercentage}%\nParatrooper Drops: ${sector2.alliedParadropCount}`,
          inline: true
        },
        {name: '\u200B',
        value: '\u200B',
        inline: true
        }
        )
      .setTimestamp()
      
      client.channels.cache.get(config.channel).send({embeds: [embed]});
    })
    .catch(function (error) {
      console.log(error);
    });

  
};

// Discord client setup
function discordSetup() {
  const client = new Client({intents: [Intents.FLAGS.GUILDS]});
  client.config = config;
  client.login(config.token);
  client.on('ready', () => {
    console.log('Bot is running!');
    // Run main function every minute
    setInterval(function() {
      main(client);
    }, 60000);
  });
};

discordSetup();