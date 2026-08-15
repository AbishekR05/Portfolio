const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'figma_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function findNode(node, name) {
  if (node.name === name) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child, name);
      if (found) return found;
    }
  }
  return null;
}

const node = findNode(data.document, 'Rasgula 1');
if (node) {
  console.log('Rasgula 1 node found:');
  console.log(JSON.stringify({
    id: node.id,
    type: node.type,
    absoluteBoundingBox: node.absoluteBoundingBox,
    absoluteRenderBounds: node.absoluteRenderBounds
  }, null, 2));
} else {
  console.log('Rasgula 1 not found.');
}
