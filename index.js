const { 
    Client, 
    GatewayIntentBits, 
    MessageFlags, 
    ContainerBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder 
} = require('discord.js');

const express = require('express');
const app = express();

// 1. KEEP RAILWAY & UPTIMEROBOT HAPPY
app.get('/', (req, res) => res.status(200).send('Online'));

const PORT = process.env.PORT || 3000;

// '0.0.0.0' is required for Railway to route traffic to your app
app.listen(PORT, '0.0.0.0', () => console.log(`[Web] Listening on Port ${PORT}`));

// 2. INITIALIZE CLIENT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 3. READY EVENT
client.once('clientReady', (c) => {
    console.log(`✅ Success! ${c.user.tag} is now active.`);
});

// 4. MESSAGE HANDLER
client.on('messageCreate', async (message) => {
    if (!message.author.bot) console.log(`[Message] ${message.author.tag}: ${message.content}`);
    if (message.author.bot || message.content.toLowerCase().trim() !== '-ping') return;

    const apiPing = Math.round(client.ws.ping);
    const botPing = Math.round(Date.now() - message.createdTimestamp);

    const pingContainer = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('### 🏓 Pong!')
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setDivider(true)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Latency:** \`${botPing}ms\``),
            new TextDisplayBuilder().setContent(`**API Delay:** \`${apiPing}ms\``)
        );

    try {
        await message.reply({
            components: [pingContainer],
            flags: [MessageFlags.IsComponentsV2]
        });
    } catch (err) {
        console.error('[Error] Could not send reply:', err);
    }
});

// 5. PREVENT CRASHES FROM KILLING THE SERVER
process.on('unhandledRejection', (error) => {
    console.error('[Unhandled Rejection]', error);
});

process.on('uncaughtException', (error) => {
    console.error('[Uncaught Exception]', error);
});

// 6. LOGIN — make sure DISCORD_TOKEN is set in Railway environment variables
if (!process.env.DISCORD_TOKEN) {
    console.error('[Fatal] DISCORD_TOKEN is not set! Bot will not login.');
} else {
    client.login(process.env.DISCORD_TOKEN);
}
