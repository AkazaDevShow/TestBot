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

// 1. Railway & UptimeRobot Fix
app.get('/', (req, res) => res.send('Bot is Online! 🚀'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content !== '-ping') return;

    const apiPing = Math.round(client.ws.ping);
    const botPing = Math.round(Date.now() - message.createdTimestamp);

    // 2. Build the Components V2 Layout
    const pingContainer = new ContainerBuilder()
        .setAccentColor(0x00FF00) // Green Sidebar
        .addComponents(
            // Header Section
            new SectionBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent('## 🏓 Pong!')
            ),
            // Divider
            new SeparatorBuilder(),
            // Stats Section
            new SectionBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**Bot Latency:** \`${botPing}ms\``),
                new TextDisplayBuilder().setContent(`**API Latency:** \`${apiPing}ms\``)
            )
        );

    // 3. Send using the IS_COMPONENTS_V2 Flag
    await message.reply({
        components: [pingContainer],
        flags: [MessageFlags.IsComponentsV2] // CRITICAL: This enables the new UI
    });
});

client.login(process.env.DISCORD_TOKEN);
