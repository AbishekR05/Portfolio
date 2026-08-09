const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'figma_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function findNode(node, id) {
  if (node.id === id) {
    return node;
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

const node = findNode(data.document, '1035:33'); // Actual frame
if (node) {
  console.log('Actual frame children:');
  node.children.forEach(child => {
    const box = child.absoluteBoundingBox || child.absoluteRenderBounds || { x: 0, y: 0, width: 0, height: 0 };
    console.log(`- "${child.name}" [Type: ${child.type}] [ID: ${child.id}]`);
    console.log(`  Coords: (x: ${Math.round(box.x)}, y: ${Math.round(box.y)}), Size: ${Math.round(box.width)}x${Math.round(box.height)}`);
  });
} else {
  console.log('Actual frame not found.');
}
