const {  
    Client,  
    GatewayIntentBits,  
    MessageFlags,  
    ContainerBuilder,  
    TextDisplayBuilder,  
    SeparatorBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    SectionBuilder,
    ThumbnailBuilder
} = require('discord.js'); 
 
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── ENV VARS ────────────────────────────────────────────────────────────────
const TARGET_GUILD_ID    = process.env.TARGET_GUILD_ID    || '1485278223800471672';
const AUTO_ROLE_ID       = process.env.AUTO_ROLE_ID       || '1485756302423756991';
const ROLE_LOG_CHANNEL   = process.env.ROLE_LOG_CHANNEL   || '1485766448893661284';
const VOICE_CHANNEL_ID   = process.env.VOICE_CHANNEL_ID   || '1485754693987598468';
const VOICE_CHANNEL_NAME = process.env.VOICE_CHANNEL_NAME || '👥┃Much';

// ─── WEB DASHBOARD ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Discord Bot Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@300;400;600;800&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f14;
    --surface: #13161d;
    --surface2: #1a1e28;
    --border: #2a2f3e;
    --accent: #5865f2;
    --accent2: #7289da;
    --green: #57f287;
    --red: #ed4245;
    --yellow: #fee75c;
    --text: #e3e5e8;
    --muted: #72767d;
    --mono: 'Share Tech Mono', monospace;
    --sans: 'Exo 2', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Grid bg */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(88,101,242,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(88,101,242,.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .wrap { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 32px 20px; }

  /* Header */
  header { display: flex; align-items: center; gap: 14px; margin-bottom: 40px; }
  .logo {
    width: 48px; height: 48px; border-radius: 12px;
    background: linear-gradient(135deg, var(--accent), #3b4cb8);
    display: grid; place-items: center; font-size: 22px;
    box-shadow: 0 0 24px rgba(88,101,242,.4);
  }
  header h1 { font-size: 22px; font-weight: 800; letter-spacing: .5px; }
  header span { font-size: 13px; color: var(--muted); font-family: var(--mono); }
  .status-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    margin-left: auto;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

  /* Cards */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }
  .card-title {
    font-size: 11px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: var(--accent2);
    margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
    font-family: var(--mono);
  }
  .card-title svg { width: 14px; height: 14px; }

  /* Component builder */
  .builder-area {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    min-height: 80px;
    margin-bottom: 14px;
  }
  .component-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 8px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    position: relative;
  }
  .component-item:last-child { margin-bottom: 0; }
  .comp-icon {
    width: 28px; height: 28px; border-radius: 6px;
    background: var(--surface2);
    display: grid; place-items: center;
    font-size: 13px; flex-shrink: 0;
    border: 1px solid var(--border);
  }
  .comp-body { flex: 1; }
  .comp-type { font-size: 10px; color: var(--muted); font-family: var(--mono); margin-bottom: 4px; }
  .comp-edit {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 6px;
    padding: 8px 10px; color: var(--text); font-family: var(--sans);
    font-size: 14px; resize: vertical; min-height: 36px;
    transition: border-color .2s;
  }
  .comp-edit:focus { outline: none; border-color: var(--accent); }
  .comp-remove {
    background: none; border: none; color: var(--muted);
    cursor: pointer; font-size: 16px; line-height: 1; padding: 2px;
    transition: color .2s; flex-shrink: 0;
  }
  .comp-remove:hover { color: var(--red); }

  /* Add component buttons */
  .add-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .add-btn {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); border-radius: 8px; padding: 7px 13px;
    font-size: 12px; font-family: var(--mono); cursor: pointer;
    transition: all .2s; display: flex; align-items: center; gap: 6px;
  }
  .add-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(88,101,242,.08); }

  /* Inputs */
  .field { margin-bottom: 14px; }
  .field label { display: block; font-size: 11px; font-family: var(--mono); color: var(--muted); margin-bottom: 6px; letter-spacing: 1px; }
  .field input, .field select {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 8px;
    padding: 10px 14px; color: var(--text);
    font-family: var(--sans); font-size: 14px;
    transition: border-color .2s;
  }
  .field input:focus, .field select:focus { outline: none; border-color: var(--accent); }

  /* Flag toggles */
  .flags-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .flag-toggle {
    display: flex; align-items: center; gap: 6px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 7px 13px;
    cursor: pointer; transition: all .2s;
    font-size: 12px; font-family: var(--mono);
    user-select: none;
  }
  .flag-toggle.active { border-color: var(--accent); background: rgba(88,101,242,.12); color: var(--accent); }
  .flag-toggle input { display: none; }

  /* Send button */
  .send-btn {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, var(--accent), #3b4cb8);
    border: none; border-radius: 10px; color: #fff;
    font-family: var(--sans); font-weight: 700; font-size: 15px;
    cursor: pointer; letter-spacing: .5px;
    box-shadow: 0 4px 20px rgba(88,101,242,.35);
    transition: all .2s;
  }
  .send-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(88,101,242,.5); }
  .send-btn:active { transform: translateY(0); }
  .send-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

  /* Preview panel */
  .preview {
    background: #313338;
    border-radius: 10px;
    padding: 16px;
    font-family: 'gg sans', sans-serif;
    font-size: 15px;
    min-height: 60px;
  }
  .preview-container {
    background: #2b2d31;
    border-radius: 8px; padding: 14px 16px;
    border-left: 3px solid var(--accent);
  }
  .preview-text { color: #dbdee1; line-height: 1.5; margin-bottom: 6px; }
  .preview-text:last-child { margin-bottom: 0; }
  .preview-sep { height: 1px; background: #3f4147; margin: 10px 0; }
  .preview-h1 { font-size: 20px; font-weight: 700; color: #fff; }
  .preview-h3 { font-size: 16px; font-weight: 600; color: #fff; }

  /* Toast */
  .toast {
    position: fixed; bottom: 28px; right: 28px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 20px;
    font-size: 14px; z-index: 100;
    transform: translateY(80px); opacity: 0;
    transition: all .3s;
    display: flex; align-items: center; gap: 10px;
  }
  .toast.show { transform: translateY(0); opacity: 1; }
  .toast.ok { border-color: var(--green); }
  .toast.err { border-color: var(--red); }

  /* Two-col */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media(max-width:640px){ .two-col { grid-template-columns: 1fr; } }

  /* Stats */
  .stat-row { display: flex; gap: 14px; }
  .stat {
    flex: 1; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 10px;
    padding: 14px; text-align: center;
  }
  .stat-val { font-size: 22px; font-weight: 800; font-family: var(--mono); }
  .stat-label { font-size: 11px; color: var(--muted); letter-spacing: 1px; }
  .green { color: var(--green); }
  .yellow { color: var(--yellow); }
  .accent { color: var(--accent2); }

  /* Voice timer */
  .vc-timer { font-family: var(--mono); font-size: 13px; color: var(--muted); margin-top: 6px; }
  .progress-bar {
    height: 4px; background: var(--surface2);
    border-radius: 2px; margin-top: 10px; overflow: hidden;
  }
  .progress-fill {
    height: 100%; background: linear-gradient(90deg, var(--accent), var(--green));
    border-radius: 2px; transition: width .5s;
  }
</style>
</head>
<body>
<div class="wrap">

  <!-- Header -->
  <header>
    <div class="logo">🤖</div>
    <div>
      <h1>Discord Bot</h1>
      <span id="bot-tag">Loading...</span>
    </div>
    <div class="status-dot" id="status-dot"></div>
  </header>

  <!-- Stats -->
  <div class="card" style="margin-bottom:20px">
    <div class="card-title">📊 STATUS</div>
    <div class="stat-row">
      <div class="stat"><div class="stat-val green" id="stat-ping">--</div><div class="stat-label">WS PING</div></div>
      <div class="stat"><div class="stat-val yellow" id="stat-guilds">--</div><div class="stat-label">GUILDS</div></div>
      <div class="stat"><div class="stat-val accent" id="stat-vc">5:00</div><div class="stat-label">VC RENAME</div></div>
    </div>
    <div class="progress-bar"><div class="progress-fill" id="vc-progress" style="width:100%"></div></div>
    <div class="vc-timer" id="vc-text">Voice channel renames every 5 minutes → 👥┃Much</div>
  </div>

  <!-- Message Builder -->
  <div class="two-col">
    <div>
      <div class="card">
        <div class="card-title">🔨 BUILD MESSAGE (IsComponentsV2)</div>

        <!-- Components area -->
        <div class="builder-area" id="components-area">
          <div style="color:var(--muted);font-size:13px;text-align:center;padding:16px;font-family:var(--mono)">
            Add components below ↓
          </div>
        </div>

        <!-- Add component buttons -->
        <div class="add-row">
          <button class="add-btn" onclick="addComp('header')">＋ Header</button>
          <button class="add-btn" onclick="addComp('text')">＋ Text</button>
          <button class="add-btn" onclick="addComp('separator')">＋ Separator</button>
          <button class="add-btn" onclick="addComp('button')">＋ Button</button>
          <button class="add-btn" onclick="addComp('image')">＋ Image URL</button>
        </div>

        <!-- Channel ID + Flags -->
        <div class="field">
          <label>CHANNEL ID</label>
          <input type="text" id="channel-id" placeholder="e.g. 1485766448893661284"/>
        </div>

        <div class="field">
          <label>FLAGS</label>
          <div class="flags-row">
            <label class="flag-toggle active" id="flag-cv2-label">
              <input type="checkbox" id="flag-cv2" checked onchange="toggleFlag('flag-cv2-label',this)">
              IsComponentsV2
            </label>
            <label class="flag-toggle" id="flag-ephemeral-label">
              <input type="checkbox" id="flag-ephemeral" onchange="toggleFlag('flag-ephemeral-label',this)">
              Ephemeral
            </label>
          </div>
        </div>

        <button class="send-btn" id="send-btn" onclick="sendMessage()">🚀 SEND TO CHANNEL</button>
      </div>
    </div>

    <!-- Preview -->
    <div>
      <div class="card">
        <div class="card-title">👁 PREVIEW</div>
        <div class="preview">
          <div class="preview-container" id="preview-area">
            <span style="color:var(--muted);font-family:var(--mono);font-size:12px">Add components to preview...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
// ── Component state ──────────────────────────────────────────────
let components = [];
let compId = 0;

function addComp(type) {
  const id = ++compId;
  const comp = { id, type, value: type === 'separator' ? '' : (type === 'button' ? 'Click Me' : 'New ' + type) };
  components.push(comp);
  renderComponents();
  renderPreview();
}

function removeComp(id) {
  components = components.filter(c => c.id !== id);
  renderComponents();
  renderPreview();
}

function updateComp(id, val) {
  const c = components.find(c => c.id === id);
  if (c) { c.value = val; renderPreview(); }
}

const icons = { header:'#', text:'T', separator:'—', button:'⬛', image:'🖼' };

function renderComponents() {
  const area = document.getElementById('components-area');
  if (components.length === 0) {
    area.innerHTML = '<div style="color:var(--muted);font-size:13px;text-align:center;padding:16px;font-family:var(--mono)">Add components below ↓</div>';
    return;
  }
  area.innerHTML = components.map(c => \`
    <div class="component-item" data-id="\${c.id}">
      <div class="comp-icon">\${icons[c.type]||'?'}</div>
      <div class="comp-body">
        <div class="comp-type">\${c.type.toUpperCase()}</div>
        \${c.type === 'separator'
          ? '<div style="height:1px;background:var(--border);margin-top:6px"></div>'
          : \`<textarea class="comp-edit" rows="1" oninput="updateComp(\${c.id},this.value)">\${escHtml(c.value)}</textarea>\`
        }
      </div>
      <button class="comp-remove" onclick="removeComp(\${c.id})">✕</button>
    </div>
  \`).join('');
}

function renderPreview() {
  const area = document.getElementById('preview-area');
  if (components.length === 0) {
    area.innerHTML = '<span style="color:var(--muted);font-family:var(--mono);font-size:12px">Add components to preview...</span>';
    return;
  }
  area.innerHTML = components.map(c => {
    if (c.type === 'separator') return '<div class="preview-sep"></div>';
    if (c.type === 'header') {
      const t = c.value;
      if (t.startsWith('# ')) return \`<div class="preview-text preview-h1">\${escHtml(t.slice(2))}</div>\`;
      if (t.startsWith('### ')) return \`<div class="preview-text preview-h3">\${escHtml(t.slice(4))}</div>\`;
      return \`<div class="preview-text preview-h1">\${escHtml(t)}</div>\`;
    }
    if (c.type === 'button') return \`<button style="background:var(--accent);border:none;border-radius:4px;color:#fff;padding:6px 16px;font-size:14px;cursor:pointer;margin-top:6px">\${escHtml(c.value)}</button>\`;
    if (c.type === 'image') return \`<img src="\${escHtml(c.value)}" style="max-width:100%;border-radius:6px;margin-top:6px" onerror="this.style.display='none'">\`;
    return \`<div class="preview-text">\${escHtml(c.value)}</div>\`;
  }).join('');
}

// ── Send message ─────────────────────────────────────────────────
async function sendMessage() {
  const channelId = document.getElementById('channel-id').value.trim();
  if (!channelId) { toast('Enter a channel ID!', 'err'); return; }
  if (components.length === 0) { toast('Add at least one component!', 'err'); return; }

  const flags = [];
  if (document.getElementById('flag-cv2').checked) flags.push('IsComponentsV2');
  if (document.getElementById('flag-ephemeral').checked) flags.push('Ephemeral');

  const btn = document.getElementById('send-btn');
  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId, components, flags })
    });
    const data = await res.json();
    if (data.ok) {
      toast('✅ Message sent!', 'ok');
      components = []; compId = 0;
      renderComponents(); renderPreview();
    } else {
      toast('❌ ' + (data.error || 'Failed'), 'err');
    }
  } catch(e) {
    toast('❌ Network error', 'err');
  }

  btn.disabled = false;
  btn.textContent = '🚀 SEND TO CHANNEL';
}

// ── Stats refresh ─────────────────────────────────────────────────
async function refreshStats() {
  try {
    const r = await fetch('/api/stats');
    const d = await r.json();
    document.getElementById('bot-tag').textContent = d.tag || 'Unknown';
    document.getElementById('stat-ping').textContent = (d.ping || '--') + 'ms';
    document.getElementById('stat-guilds').textContent = d.guilds || '--';
  } catch(_) {}
}
setInterval(refreshStats, 5000);
refreshStats();

// ── VC countdown ──────────────────────────────────────────────────
let vcSeconds = 300;
setInterval(() => {
  vcSeconds--;
  if (vcSeconds < 0) vcSeconds = 300;
  const m = Math.floor(vcSeconds / 60);
  const s = String(vcSeconds % 60).padStart(2,'0');
  document.getElementById('stat-vc').textContent = m + ':' + s;
  document.getElementById('vc-progress').style.width = (vcSeconds / 300 * 100) + '%';
}, 1000);

// ── Helpers ───────────────────────────────────────────────────────
function toggleFlag(labelId, checkbox) {
  document.getElementById(labelId).classList.toggle('active', checkbox.checked);
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function toast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type||'');
  setTimeout(() => t.className = 'toast', 3000);
}
</script>
</body>
</html>`);
});

// ─── API: Send message ────────────────────────────────────────────────────────
app.post('/api/send', async (req, res) => {
    try {
        const { channelId, components, flags } = req.body;
        const guild = client.guilds.cache.get(TARGET_GUILD_ID);
        if (!guild) return res.json({ ok: false, error: 'Guild not found' });

        const channel = guild.channels.cache.get(channelId)
            || await client.channels.fetch(channelId).catch(() => null);
        if (!channel) return res.json({ ok: false, error: 'Channel not found' });

        // Build container from components array
        const container = new ContainerBuilder();
        for (const comp of components) {
            if (comp.type === 'separator') {
                container.addSeparatorComponents(new SeparatorBuilder().setDivider(true));
            } else if (comp.type === 'button') {
                // Buttons go in ActionRow — skip for now, add as text note
                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`[ Button: ${comp.value} ]`)
                );
            } else {
                container.addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(comp.value || '\u200b')
                );
            }
        }

        const msgFlags = [];
        if (flags && flags.includes('IsComponentsV2')) msgFlags.push(MessageFlags.IsComponentsV2);
        if (flags && flags.includes('Ephemeral')) msgFlags.push(MessageFlags.Ephemeral);

        await channel.send({
            components: [container],
            flags: msgFlags
        });

        res.json({ ok: true });
    } catch (err) {
        console.error('[API/send]', err);
        res.json({ ok: false, error: err.message });
    }
});

// ─── API: Stats ───────────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
    res.json({
        tag: client.user?.tag || 'Offline',
        ping: Math.round(client.ws.ping),
        guilds: client.guilds.cache.size
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`[Web] Listening on Port ${PORT}`));

// ─── INITIALIZE CLIENT ────────────────────────────────────────────────────────
const client = new Client({ 
    intents: [ 
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
}); 

// ─── READY ────────────────────────────────────────────────────────────────────
client.once('clientReady', (c) => { 
    console.log(`✅ Success! ${c.user.tag} is now active.`);
    startVoiceChannelRename();
}); 

// ─── VOICE CHANNEL AUTO-RENAME (every 5 min) ──────────────────────────────────
function startVoiceChannelRename() {
    const rename = async () => {
        try {
            const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
            if (!channel) return console.error('[VoiceRename] Channel not found');
            if (channel.name !== VOICE_CHANNEL_NAME) {
                await channel.setName(VOICE_CHANNEL_NAME);
                console.log(`[VoiceRename] Renamed to "${VOICE_CHANNEL_NAME}"`);
            }
        } catch (err) {
            console.error('[VoiceRename] Error:', err.message);
        }
    };

    rename(); // Run immediately on startup
    setInterval(rename, 5 * 60 * 1000); // Then every 5 minutes
    console.log(`[VoiceRename] Will rename channel ${VOICE_CHANNEL_ID} every 5 min → "${VOICE_CHANNEL_NAME}"`);
}

// ─── AUTO-ROLE ON JOIN ────────────────────────────────────────────────────────
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

        await sendRoleLog({
            guild: member.guild,
            targetUser: member.user,
            roleName: role.name,
            action: 'add',
            executor: client.user,
            timestamp: new Date()
        });

    } catch (err) {
        console.error('[AutoRole] Failed to assign role:', err);
    }
});

// ─── ROLE UPDATE LOG ─────────────────────────────────────────────────────────
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const addedRoles   = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

    let executor = null;
    try {
        const { AuditLogEvent } = require('discord.js');
        const logs = await newMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate });
        const entry = logs.entries.first();
        if (entry && Date.now() - entry.createdTimestamp < 5000) {
            executor = entry.executor;
        }
    } catch (_) { }

    const now = new Date();
    for (const role of addedRoles.values()) {
        await sendRoleLog({ guild: newMember.guild, targetUser: newMember.user, roleName: role.name, action: 'add', executor, timestamp: now });
    }
    for (const role of removedRoles.values()) {
        await sendRoleLog({ guild: newMember.guild, targetUser: newMember.user, roleName: role.name, action: 'remove', executor, timestamp: now });
    }
});

// ─── ROLE LOG HELPER ──────────────────────────────────────────────────────────
async function sendRoleLog({ guild, targetUser, roleName, action, executor, timestamp }) {
    try {
        const logChannel = guild.channels.cache.get(ROLE_LOG_CHANNEL);
        if (!logChannel) return;

        const actionText   = action === 'add' ? 'was added' : 'was removed';
        const preposition  = action === 'add' ? 'to' : 'from';
        const executorText = executor ? `${executor.tag} | ${executor.id}` : 'Unknown';

        const timeStr = timestamp.toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });

        const logContainer = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent('# Remove or add role'))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`<@${targetUser.id}> **${roleName}** role ${actionText} ${preposition} them`),
                new TextDisplayBuilder().setContent(`**By :** ${executorText}`),
                new TextDisplayBuilder().setContent(`**Time :** ${timeStr}`)
            );

        await logChannel.send({
            components: [logContainer],
            flags: [MessageFlags.IsComponentsV2]
        });

    } catch (err) {
        console.error('[RoleLog] Failed to send log:', err);
    }
}

// ─── MESSAGE HANDLER ──────────────────────────────────────────────────────────
client.on('messageCreate', async (message) => { 
    if (!message.author.bot) console.log(`[Message] ${message.author.tag}: ${message.content}`); 
    if (message.author.bot || message.content.toLowerCase().trim() !== '-ping') return; 
 
    const apiPing = Math.round(client.ws.ping); 
    const botPing = Math.round(Date.now() - message.createdTimestamp); 
 
    const pingContainer = new ContainerBuilder() 
        .addTextDisplayComponents(new TextDisplayBuilder().setContent('### 🏓 Pong!')) 
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true)) 
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
 
// ─── PREVENT CRASHES ─────────────────────────────────────────────────────────
process.on('unhandledRejection', (error) => { console.error('[Unhandled Rejection]', error); }); 
process.on('uncaughtException',  (error) => { console.error('[Uncaught Exception]', error); }); 
 
// ─── LOGIN ────────────────────────────────────────────────────────────────────
if (!process.env.DISCORD_TOKEN) { 
    console.error('[Fatal] DISCORD_TOKEN is not set! Bot will not login.'); 
} else { 
    client.login(process.env.DISCORD_TOKEN); 
}
