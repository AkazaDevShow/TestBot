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

// --- RAILWAY & UPTIME ROBOT ---
app.get('/', (req, res) => res.send('Bot is Online! 🚀'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Active on Port: ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // This will show in your Railway logs. If you don't see this when you type, 
    // it means the "Intent" or "Permissions" are still wrong.
    console.log(`[Log] Message from ${message.author.tag}: ${message.content}`);

    if (message.author.bot) return;

    // Use .toLowerCase() and .trim() to prevent small typos from breaking the command
    if (message.content.toLowerCase().trim() === '-ping') {
        const apiPing = Math.round(client.ws.ping);
        const botPing = Math.round(Date.now() - message.createdTimestamp);

        // Build the V2 UI
        const pingContainer = new ContainerBuilder()
            .setAccentColor(0x00FF00)
            .addComponents(
                new SectionBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('### 🏓 Pong!')
                ),
                new SeparatorBuilder(),
                new SectionBuilder().addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`**Bot Speed:** \`${botPing}ms\``),
                    new TextDisplayBuilder().setContent(`**API Delay:** \`${apiPing}ms\``)
                )
            );

        try {
            await message.reply({
                components: [pingContainer],
                flags: [MessageFlags.IsComponentsV2] 
            });
        } catch (err) {
            console.error("Reply error:", err);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
