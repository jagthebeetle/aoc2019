const fs = require('fs');

const width = 25;
const height = 6;
const pixels = fs.readFileSync('input.txt', 'utf8').split('').map(Number);

const layers = [[]];
let pixelIndex = 0;
let layer = layers[0];
for (const pixel of pixels) {
  layer[pixelIndex] = pixel;
  pixelIndex = (pixelIndex + 1) % (width * height);
  if (pixelIndex === 0) {
    layers.push(layer);
    layer = [];
  }
}

// Part 1
function part1() {
  const specialLayer = layers.reduce((maxLayer, currentLayer) => {
    return countDigit(currentLayer, 0) < countDigit(maxLayer, 0) ?
        currentLayer :
        maxLayer;
  });
  console.info(countDigit(specialLayer, 1) * countDigit(specialLayer, 2));
}

const compositeLayer = [];
for (let i = 0; i < width * height; ++i) {
  let currentLayer = 0;
  while (layers[currentLayer][i] === 2) {
    currentLayer++;
  }
  compositeLayer[i] = layers[currentLayer][i] === 1 ? ' ' : '█';
}
console.info(compositeLayer.join(''));

function countDigit(layer, digit) {
  return layer.reduce(
      (digitCount, pixel) => pixel === digit ? digitCount + 1 : digitCount, 0);
}
