const fs = require('fs');

// Fuel required to launch a given module is based on its mass. Specifically, to
// find the fuel required for a module, take its mass, divide by three, round
// down, and subtract 2.
function fuel(mass) {
  return Math.floor(mass / 3) - 2;
}

const input = fs.readFileSync('input.txt', 'utf8');

console.info(input.split('\n').reduce((acc, c) => acc + fuel(c), 0));

// boo floating point shit. switch to py for magic num type
// maybe point free haskell next
