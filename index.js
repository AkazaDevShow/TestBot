const { 
    Client, 
    GatewayIntentBits, 
    MessageFlags, 
    ContainerBuilder, 
    SectionBuilder, 
    TextDisplayBuilder, 
    SeparatorBuilder 
} = require('discord.js');

const express = require('express');
const app = express();

// 1. KEEP RAILWAY & UPTIMEROBOT HAPPY
app.get('/', (req, res) => res.send('System Status: Online 24/7 🚀'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Web] Listening on Port ${PORT}`));

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

    // Use type-specific add methods — there is no generic addComponents()
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

// 5. LOGIN
client.login(process.env.DISCORD_TOKEN);