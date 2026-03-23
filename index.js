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
app.listen(PORT, '0.0.0.0', () => console.log(`[Web] Listening on Port ${PORT}`)); 
 
// 2. ENV VARS
const TARGET_GUILD_ID  = process.env.TARGET_GUILD_ID  || '1485278223800471672';
const AUTO_ROLE_ID     = process.env.AUTO_ROLE_ID     || '1485756302423756991';
const ROLE_LOG_CHANNEL = process.env.ROLE_LOG_CHANNEL || '1485766448893661284';

// 3. INITIALIZE CLIENT 
const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
}); 
 
// 4. READY EVENT 
client.once('clientReady', (c) => { 
    console.log(`✅ Success! ${c.user.tag} is now active.`); 
}); 

// 5. AUTO-ROLE ON JOIN
client.on('guildMemberAdd', async (member) => {
    if (member.guild.id !== TARGET_GUILD_ID) return;

    try {
        const role = member.guild.roles.cache.get(AUTO_ROLE_ID);
        if (!role) {
            console.error(`[AutoRole] Role ${AUTO_ROLE_ID} not found in guild.`);
            return;
        }

        await member.roles.add(role);
        console.log(`[AutoRole] Gave "${role.name}" to ${member.user.tag}`);

        // Log to role-log channel
        await sendRoleLog({
            guild: member.guild,
            targetUser: member.user,
            roleName: role.name,
            action: 'add',
            executor: client.user,       // bot gave the role
            timestamp: new Date()
        });

    } catch (err) {
        console.error('[AutoRole] Failed to assign role:', err);
    }
});

// 6. LOG WHEN ANY ROLE IS ADDED / REMOVED FROM A MEMBER
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const addedRoles   = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

    // Fetch audit log to find who made the change
    let executor = null;
    try {
        const { AuditLogEvent } = require('discord.js');
        const logs = await newMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate });
        const entry = logs.entries.first();
        if (entry && Date.now() - entry.createdTimestamp < 5000) {
            executor = entry.executor;
        }
    } catch (_) { /* audit log not available */ }

    const now = new Date();

    for (const role of addedRoles.values()) {
        await sendRoleLog({ guild: newMember.guild, targetUser: newMember.user, roleName: role.name, action: 'add',    executor, timestamp: now });
    }
    for (const role of removedRoles.values()) {
        await sendRoleLog({ guild: newMember.guild, targetUser: newMember.user, roleName: role.name, action: 'remove', executor, timestamp: now });
    }
});

// 7. ROLE LOG HELPER
async function sendRoleLog({ guild, targetUser, roleName, action, executor, timestamp }) {
    try {
        const logChannel = guild.channels.cache.get(ROLE_LOG_CHANNEL);
        if (!logChannel) return;

        const actionText = action === 'add' ? 'was added' : 'was removed';
        const preposition = action === 'add' ? 'to' : 'from';
        const executorText = executor
            ? `${executor.tag} | ${executor.id}`
            : 'Unknown';

        const timeStr = timestamp.toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });

        const logContainer = new ContainerBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('# Remove or add role')
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setDivider(true)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(
                    `<@${targetUser.id}> **${roleName}** role ${actionText} ${preposition} them`
                ),
                new TextDisplayBuilder().setContent(
                    `**By :** ${executorText}`
                ),
                new TextDisplayBuilder().setContent(
                    `**Time :** ${timeStr}`
                )
            );

        await logChannel.send({
            components: [logContainer],
            flags: [MessageFlags.IsComponentsV2]
        });

    } catch (err) {
        console.error('[RoleLog] Failed to send log:', err);
    }
}

// 8. MESSAGE HANDLER 
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
 
// 9. PREVENT CRASHES 
process.on('unhandledRejection', (error) => { 
    console.error('[Unhandled Rejection]', error); 
}); 
 
process.on('uncaughtException', (error) => { 
    console.error('[Uncaught Exception]', error); 
}); 
 
// 10. LOGIN
if (!process.env.DISCORD_TOKEN) { 
    console.error('[Fatal] DISCORD_TOKEN is not set! Bot will not login.'); 
} else { 
    client.login(process.env.DISCORD_TOKEN); 
    }
