const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const express = require('express');
const app = express();

// 1. Web Server for UptimeRobot
app.get('/', (req, res) => res.send('Bot is Online! 🚀'));
app.listen(process.env.PORT || 3000);

// 2. Bot Setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('messageCreate', async (message) => {
    // Ignore bots and check for -ping
    if (message.author.bot || !message.content.startsWith('-ping')) return;

    // Calculate Latency
    const botPing = Math.round(client.ws.ping);
    
    // Create the New Embed
    const pingEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('🏓 Pong!')
        .addFields(
            { name: 'Bot Latency', value: `${botPing}ms`, inline: true },
            { name: 'API Latency', value: `${Math.round(Date.now() - message.createdTimestamp)}ms`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Railway Hosting 24/7' });

    // Send the message
    await message.reply({ embeds: [pingEmbed] });
});

client.login(process.env.DISCORD_TOKEN);
