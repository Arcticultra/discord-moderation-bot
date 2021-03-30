import Discord from 'discord.js';
import fetch from 'node-fetch';

export default async (config, client, message, args) => {
  try {
    if (!(config.mcserver && config.mcserver.ip)) {
      const response = await message.channel.send('Not Minecraft server data provided in config');
      await response.delete({ timeout: 30000 });
      return;
    }

    const {
      // icon,
      motd: {
        clean,
      },
      ip,
      port,
      software,
      version,
      online,
      players: {
        online: onlinePlayers,
        max: maxPlayers,
      } = {},
    } = await fetch(`https://api.mcsrvstat.us/2/${config.mcserver.ip}`)
      .then(res => res.json());

    const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle(`Minecraft server ${config.mcserver.ip}`)
      .setDescription(`Server is running ${software} version ${version}`)
      .addField('MOTD', clean)
      .addField('IP', ip)
      .addField('Is Online', online)
      // .setImage(icon)
      .setFooter('Created by Derthon#9538');

    if (online) {
      embed.addField('Players', `${onlinePlayers}/${maxPlayers}`);
    }

    await message.channel.send(embed);
  } catch (e) {
    console.log(e.message);
    const response = await message.channel.send('An error occurred!');
    await response.delete({ timeout: 30000 });
  }
}