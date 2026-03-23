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

// 1. RAILWAY & UPTIME ROBOT FIX
// This server makes your 'up.railway.app' link work.
app.get('/', (req, res) => {
    res.send('Bot Status: 24/7 Online 🚀');
});

// Railway provides the PORT variable automatically.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web server active on port ${PORT}`);
});

// 2. BOT SETUP
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Success! Logged in as ${client.user.tag}`);
});

// 3. -PING COMMAND (COMPONENTS V2 STYLE)
client.on('messageCreate', async (message) => {
    if (message.author.bot || message.content !== '-ping') return;

    const apiPing = Math.round(client.ws.ping);
    const botPing = Math.round(Date.now() - message.createdTimestamp);

    // Building the new UI Container
    const pingContainer = new ContainerBuilder()
        .setAccentColor(0x00FF00) // Green bar on the side
        .addComponents(
            // Header Section
            new SectionBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent('### 🏓 Pong!')
            ),
            // Divider Line
            new SeparatorBuilder(),
            // Stats Section
            new SectionBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**Bot Speed:** \`${botPing}ms\``),
                new TextDisplayBuilder().setContent(`**Discord API:** \`${apiPing}ms\``)
            )
        );

    // Sending with the mandatory IS_COMPONENTS_V2 flag
    await message.reply({
        components: [pingContainer],
        flags: [MessageFlags.IsComponentsV2] 
    });
});

client.login(process.env.DISCORD_TOKEN);
