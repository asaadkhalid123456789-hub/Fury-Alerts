const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = '1480131301083185163';
const STREAMER = 'fahadft';

const STATE_FILE = './state.json';

// Load last state (prevents spam after restart)
let isLive = false;
if (fs.existsSync(STATE_FILE)) {
  const data = JSON.parse(fs.readFileSync(STATE_FILE));
  isLive = data.isLive;
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify({ isLive }));
}

async function checkKick() {
  try {
    const res = await axios.get(`https://kick.com/api/v2/channels/${STREAMER}`);
    const live = res.data.livestream !== null;

    // Went LIVE
    if (live && !isLive) {
      isLive = true;
      saveState();

      const channel = await client.channels.fetch(CHANNEL_ID);

      channel.send({
        content: `@everyone 🔴 **${STREAMER} is now LIVE on Kick!**\nhttps://kick.com/${STREAMER}`,
        allowedMentions: { parse: ['everyone'] }
      });
    }

    // Went OFFLINE
    if (!live && isLive) {
      isLive = false;
      saveState();
    }

  } catch (err) {
    console.error('Kick error:', err.message);
  }
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  setInterval(checkKick, 60000); // every 60 sec
});

client.login(TOKEN = 'MTQ4NzMzNDgyNjAyMDE3OTk5OA.GvHwJt.bn2N6D-JAkO5RM9e2Du4leYnI_yXOo7aR_wMcs');
