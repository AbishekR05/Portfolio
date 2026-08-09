const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'figma_data.json');
if (!fs.existsSync(dataPath)) {
  console.error('figma_data.json not found.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const textNodes = [];
const frames = {};
const fonts = new Set();

function traverse(node, currentFrame = null) {
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'COMPONENT_SET' || node.type === 'GROUP') {
    currentFrame = {
      id: node.id,
      name: node.name,
      type: node.type,
      absoluteBoundingBox: node.absoluteBoundingBox,
      layoutMode: node.layoutMode,
      children: []
    };
    frames[node.id] = currentFrame;
  }

  if (node.type === 'TEXT') {
    const textStyle = node.style || {};
    const fontInfo = `${textStyle.fontFamily} (${textStyle.fontWeight || 400}, ${textStyle.fontSize || 12}px)`;
    fonts.add(fontInfo);
    
    const textData = {
      id: node.id,
      name: node.name,
      characters: node.characters || '',
      fontFamily: textStyle.fontFamily,
      fontSize: textStyle.fontSize,
      fontWeight: textStyle.fontWeight,
      color: node.fills && node.fills[0] && node.fills[0].color ? node.fills[0].color : null,
      frame: currentFrame ? currentFrame.name : 'Root'
    };
    textNodes.push(textData);
    if (currentFrame) {
      currentFrame.children.push(textData);
    }
  }

  if (node.children) {
    node.children.forEach(child => traverse(child, currentFrame));
  }
}

traverse(data.document);

console.log('--- Typography & Styles ---');
console.log('Font Families Used:');
Array.from(fonts).forEach(f => console.log(`  - ${f}`));

console.log('\n--- Text Content by Frame ---');
const textByFrame = {};
textNodes.forEach(t => {
  if (!textByFrame[t.frame]) textByFrame[t.frame] = [];
  textByFrame[t.frame].push(t);
});

for (const [frameName, texts] of Object.entries(textByFrame)) {
  console.log(`\nFrame: "${frameName}"`);
  texts.forEach(t => {
    console.log(`  - [Text Node: "${t.name}"]`);
    console.log(`    Style: ${t.fontFamily} | size: ${t.fontSize}px | weight: ${t.fontWeight}`);
    console.log(`    Content: "${t.characters.replace(/\n/g, '\\n')}"`);
  });
}

console.log('\n--- Visual Layout Flow of Main Containers ---');
// Let's print the top level canvas objects under Page 1 or ViewPort to see their coordinates.
// This tells us the layout structure/flow!
const page1 = data.document.children[0];
console.log(`Document Canvas Root: "${page1.name}"`);
if (page1.children) {
  page1.children.forEach(child => {
    if (child.type === 'FRAME' || child.type === 'GROUP' || child.type === 'COMPONENT_SET') {
      const box = child.absoluteBoundingBox || child.absoluteRenderBounds || { x: 0, y: 0, width: 0, height: 0 };
      console.log(`  - Container: "${child.name}" [${child.type}]`);
      console.log(`    Position: (x: ${Math.round(box.x)}, y: ${Math.round(box.y)}), Size: ${Math.round(box.width)}x${Math.round(box.height)}`);
      
      // Print children within the container
      if (child.children) {
        child.children.forEach(sub => {
          if (sub.type === 'FRAME' || sub.type === 'GROUP' || sub.type === 'COMPONENT') {
            const subBox = sub.absoluteBoundingBox || sub.absoluteRenderBounds || { x: 0, y: 0, width: 0, height: 0 };
            console.log(`      * Sub: "${sub.name}" [${sub.type}] (x: ${Math.round(subBox.x)}, y: ${Math.round(subBox.y)}, ${Math.round(subBox.width)}x${Math.round(subBox.height)})`);
          }
        });
      }
    }
  });
}
