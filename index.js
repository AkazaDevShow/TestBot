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

// 1. Keep Railway & UptimeRobot Happy
app.get('/', (req, res) => res.send('Bot is Live! 🚀'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Railway Port: ${PORT}`));

// 2. BOT SETUP (With critical Intents)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // <--- MUST BE ENABLED IN PORTAL TOO
    ]
});

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} is online and reading messages!`);
});

// 3. THE COMMAND
client.on('messageCreate', async (message) => {
    // CRITICAL: This log will show in Railway if the bot sees your message
    console.log(`Message seen: ${message.content}`);

    if (message.author.bot || message.content !== '-ping') return;

    const apiPing = Math.round(client.ws.ping);
    const botPing = Math.round(Date.now() - message.createdTimestamp);

    // Build the V2 Container
    const pingContainer = new ContainerBuilder()
        .setAccentColor(0x5865F2) // Discord Blurple
        .addComponents(
            new SectionBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent('### 🏓 Pong!')
            ),
            new SeparatorBuilder(),
            new SectionBuilder().addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**Latency:** \`${botPing}ms\``),
                new TextDisplayBuilder().setContent(`**API:** \`${apiPing}ms\``)
            )
        );

    try {
        await message.reply({
            components: [pingContainer],
            flags: [MessageFlags.IsComponentsV2] 
        });
    } catch (err) {
        console.error("Failed to send reply:", err);
    }
});

client.login(process.env.DISCORD_TOKEN);
