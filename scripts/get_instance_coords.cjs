const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'figma_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

console.log('Finding all instances and their absolute bounding boxes...');

const instances = [];

function traverse(node) {
  if (node.type === 'INSTANCE') {
    instances.push({
      id: node.id,
      name: node.name,
      box: node.absoluteBoundingBox || node.absoluteRenderBounds
    });
  }
  if (node.children) {
    node.children.forEach(traverse);
  }
}

traverse(data.document);

instances.forEach(inst => {
  const box = inst.box || { x: 0, y: 0, width: 0, height: 0 };
  console.log(`- Instance: "${inst.name}" [ID: ${inst.id}]`);
  console.log(`  Coords: (x: ${Math.round(box.x)}, y: ${Math.round(box.y)}), Size: ${Math.round(box.width)}x${Math.round(box.height)}`);
});
