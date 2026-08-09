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
    // URL looks like: https://www.figma.com/design/cbWtokegqfqzBjdK9OHUSL/Portfolio?node-id=0-1&t=8Dq65P6UYptgbIVA-1
    // or https://www.figma.com/file/cbWtokegqfqzBjdK9OHUSL/...
    const match = keyOrUrl.match(/(?:file|design)\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return keyOrUrl;
}

async function main() {
  const config = parseEnv();
  const token = config.PERSONAL_ACCESS_TOKEN || config.FIGMA_ACCESS_TOKEN;
  const fileKeyInput = config.FIGMA_FILE_KEY;

  if (!token) {
    console.error('Error: PERSONAL_ACCESS_TOKEN or FIGMA_ACCESS_TOKEN is missing in .env');
    process.exit(1);
  }
  if (!fileKeyInput) {
    console.error('Error: FIGMA_FILE_KEY is missing in .env');
    process.exit(1);
  }

  const fileKey = extractFileKey(fileKeyInput);
  console.log(`Parsed File Key: ${fileKey}`);
  console.log('Fetching file data from Figma API...');

  const url = `https://api.figma.com/v1/files/${fileKey}`;
  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': token
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Figma API Error (${response.status}):`, errorText);
    process.exit(1);
  }

  const data = await response.json();
  
  // Write the full json data to figma_data.json
  const outPath = path.join(__dirname, '..', 'figma_data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Saved full Figma file data to figma_data.json`);

  // Summarize what we found
  console.log('\n--- Design File Summary ---');
  console.log(`File Name: ${data.name}`);
  console.log(`Last Modified: ${data.lastModified}`);
  console.log(`Version: ${data.version}`);
  console.log('\n--- Pages ---');
  data.document.children.forEach(page => {
    console.log(`- Page: "${page.name}" [ID: ${page.id}] (${page.children ? page.children.length : 0} top-level items)`);
    if (page.children) {
      page.children.slice(0, 10).forEach(child => {
        console.log(`  * [${child.type}] "${child.name}" [ID: ${child.id}]`);
      });
      if (page.children.length > 10) {
        console.log(`  * ... and ${page.children.length - 10} more items`);
      }
    }
  });
}

main().catch(err => {
  console.error('Execution failed:', err);
});
