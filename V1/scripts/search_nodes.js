const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'figma_data.json');
if (!fs.existsSync(dataPath)) {
  console.error('figma_data.json not found. Please run fetch_figma.js first.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Searching nodes in Figma document...');

function traverse(node, depth = 0) {
  const result = [];
  if (node.name && (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET' || node.type === 'GROUP' || node.type === 'INSTANCE' || node.type === 'VECTOR')) {
    result.push({
      id: node.id,
      name: node.name,
      type: node.type,
      depth
    });
  }
  if (node.children) {
    node.children.forEach(child => {
      result.push(...traverse(child, depth + 1));
    });
  }
  return result;
}

const allNodes = traverse(data.document);

console.log(`Total relevant nodes found: ${allNodes.length}`);

// Print frames, component sets, and components
console.log('\n--- Frames and Components ---');
allNodes.forEach(n => {
  if (n.type === 'FRAME' || n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') {
    console.log(`${' '.repeat(n.depth * 2)}[${n.type}] "${n.name}" (ID: ${n.id})`);
  }
});

// Search specifically for names containing keywords
const keywords = ['laptop', 'about', 'skills', 'hero', 'project', 'card', 'contact'];
console.log('\n--- Keyword Search Results ---');
allNodes.forEach(n => {
  const lowercaseName = n.name.toLowerCase();
  const matchedKeyword = keywords.find(kw => lowercaseName.includes(kw));
  if (matchedKeyword) {
    console.log(`Matched "${matchedKeyword}": [${n.type}] "${n.name}" (ID: ${n.id})`);
  }
});
