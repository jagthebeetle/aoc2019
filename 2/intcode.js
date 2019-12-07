const fs = require('fs');

const ops = {
  1: (a, b, c, ram) => ram[c] = ram[a] + ram[b],
  2: (a, b, c, ram) => ram[c] = ram[a] * ram[b],
};

function execute(program, noun = 12, verb = 2) {
  program[1] = noun;
  program[2] = verb;
  let address = 0;
  let op = ops[program[address]];
  while (op) {
    op(program[address + 1], program[address + 2], program[address + 3],
       program);
    address += 4;
    op = ops[program[address]];
  }
  return program[0];
}

const f = fs.readFileSync('input.txt', 'utf8');
const program = f.split(',').map(Number);
// bonus
for (let i = 0; i < 100; ++i) {
  for (let j = 0; j < 100; ++j) {
    const val = execute([...program], i, j);
    if (val == 19690720) {
      console.info(100 * i + j);
    }
  }
}
