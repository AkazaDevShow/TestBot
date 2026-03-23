const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express'); // Add this line
const app = express(); // Add this line

// 1. Setup the Web Server
app.get('/', (req, res) => {
  res.send('Bot is Online! 🚀');
});

app.listen(3000, () => {
  console.log('Web server is running on port 3000');
});

// 2. Your Bot Logic
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
  if (msg.content === '!ping') msg.reply('Pong!');
});

client.login(process.env.DISCORD_TOKEN);
