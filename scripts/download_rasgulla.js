const fs = require('fs');
const path = require('path');

function parseEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const config = {};
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      config[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
  return config;
}

function extractFileKey(keyOrUrl) {
  if (keyOrUrl.includes('figma.com/')) {
    const match = keyOrUrl.match(/(?:file|design)\/([a-zA-Z0-9]+)/);
    if (match && match[1]) return match[1];
  }
  return keyOrUrl;
}

async function main() {
  const config = parseEnv();
  const token = config.PERSONAL_ACCESS_TOKEN || config.FIGMA_ACCESS_TOKEN;
  const fileKey = extractFileKey(config.FIGMA_FILE_KEY);

  console.log('Fetching Rasgulla illustration from Figma...');
  const res = await fetch(`https://api.figma.com/v1/images/${fileKey}?ids=1088:407&format=png&scale=2`, {
    headers: { 'X-Figma-Token': token }
  });
  const data = await res.json();
  const imageUrl = data.images['1088:407'];
  
  if (imageUrl) {
    const imgRes = await fetch(imageUrl);
    fs.writeFileSync(path.join(__dirname, '..', 'assets', 'rasgula.png'), Buffer.from(await imgRes.arrayBuffer()));
    console.log('Successfully saved rasgula.png to /assets!');
  } else {
    console.error('Could not get image URL for Rasgulla.');
  }
}

main();
