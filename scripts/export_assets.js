const fs = require('fs');
const path = require('path');

function parseEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found at:', envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const config = {};
  content.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      config[key] = val;
    }
  });
  return config;
}

function extractFileKey(keyOrUrl) {
  if (keyOrUrl.includes('figma.com/')) {
    const match = keyOrUrl.match(/(?:file|design)\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return keyOrUrl;
}

// Define the assets we want to export from Figma
const assetsToExport = [
  // Illustrations (PNG, 2x scale for high quality)
  { id: '1006:68', name: 'person_thinking.png', format: 'png', scale: 2 },
  { id: '1006:67', name: 'person_camera.png', format: 'png', scale: 2 },
  { id: '1051:57', name: 'waving.png', format: 'png', scale: 2 },
  { id: '1051:58', name: 'camera_gotcha.png', format: 'png', scale: 2 },
  { id: '1062:78', name: 'card_frame6.png', format: 'png', scale: 2 },
  { id: '1062:81', name: 'card_frame7.png', format: 'png', scale: 2 },
  { id: '1074:377', name: 'laptop_closed.png', format: 'png', scale: 2 },
  { id: '1074:388', name: 'laptop_open.png', format: 'png', scale: 2 },
  
  // Icons/Logos (SVG for vector quality)
  { id: '1074:203', name: 'figma_logo.svg', format: 'svg' },
  { id: '1074:260', name: 'claude_logo.svg', format: 'svg' },
  { id: '1074:271', name: 'github_logo.svg', format: 'svg' },
  { id: '1074:307', name: 'gemini_logo.svg', format: 'svg' },
];

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.statusText}`);
  }
  const fileStream = fs.createWriteStream(destPath);
  const buffer = Buffer.from(await res.arrayBuffer());
  return new Promise((resolve, reject) => {
    fileStream.write(buffer);
    fileStream.end();
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
}

async function exportGroup(config, fileKey, items, format) {
  const ids = items.map(item => item.id).join(',');
  const scale = items[0].scale || 1;
  
  console.log(`Requesting export URLs for ${items.length} ${format.toUpperCase()} assets...`);
  
  let url = `https://api.figma.com/v1/images/${fileKey}?ids=${ids}&format=${format}`;
  if (format === 'png') {
    url += `&scale=${scale}`;
  }

  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': config.PERSONAL_ACCESS_TOKEN || config.FIGMA_ACCESS_TOKEN
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Figma Image Export API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (data.err) {
    throw new Error(`Figma API returned error: ${data.err}`);
  }

  const images = data.images || {};
  const assetsDir = path.join(__dirname, '..', 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  for (const item of items) {
    const imageUrl = images[item.id];
    if (!imageUrl) {
      console.warn(`Warning: No export URL returned for node ID ${item.id} (${item.name})`);
      continue;
    }
    const destPath = path.join(assetsDir, item.name);
    console.log(`Downloading ${item.name} from Figma...`);
    await downloadFile(imageUrl, destPath);
    console.log(`Successfully saved ${item.name} to /assets`);
  }
}

async function main() {
  const config = parseEnv();
  const token = config.PERSONAL_ACCESS_TOKEN || config.FIGMA_ACCESS_TOKEN;
  const fileKeyInput = config.FIGMA_FILE_KEY;

  if (!token || !fileKeyInput) {
    console.error('Error: Token or File Key missing in .env');
    process.exit(1);
  }

  const fileKey = extractFileKey(fileKeyInput);

  // Group by format for separate API calls
  const pngAssets = assetsToExport.filter(a => a.format === 'png');
  const svgAssets = assetsToExport.filter(a => a.format === 'svg');

  try {
    if (pngAssets.length > 0) {
      await exportGroup(config, fileKey, pngAssets, 'png');
    }
    if (svgAssets.length > 0) {
      await exportGroup(config, fileKey, svgAssets, 'svg');
    }
    console.log('\nAll asset exports finished successfully!');
  } catch (err) {
    console.error('\nAsset export failed:', err.message);
    process.exit(1);
  }
}

main();
