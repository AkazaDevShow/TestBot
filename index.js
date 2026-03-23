const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', msg => {
    if (msg.content === '!ping') {
        msg.reply('Pong! 🏓');
    }
});

// Railway uses environment variables for security
client.login(process.env.DISCORD_TOKEN);
