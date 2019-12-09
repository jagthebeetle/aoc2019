const fs = require('fs');

function consumeIn() {
  return 5;
}

function emit(v) {
  console.log('OUTPUT', v);
}

const MODES = {
  0: (ram, address) => ram[ram[address]],
  1: (ram, address) => ram[address],
};

const OPCODES = {
  1: {
    execute: (a, b, c, ram) => ram[c] = a + b,
    length: 4,
    modeOverrides: {2: '1'},
  },
  2: {
    execute: (a, b, c, ram) => ram[c] = a * b,
    length: 4,
    modeOverrides: {2: '1'},
  },
  3: {
    execute: (a, ram) => ram[a] = consumeIn(),
    length: 2,
    modeOverrides: {0: '1'},
  },
  4: {
    execute: (a) => emit(a),
    length: 2,
    modeOverrides: {},
  },
  5: {jump: (a) => a !== 0, length: 3, modeOverrides: {}},
  6: {jump: (a) => a === 0, length: 3, modeOverrides: {}},
  7: {
    execute: (a, b, c, ram) => ram[c] = a < b ? 1 : 0,
    length: 4,
    modeOverrides: {2: '1'},
  },
  8: {
    execute: (a, b, c, ram) => ram[c] = a === b ? 1 : 0,
    length: 4,
    modeOverrides: {2: '1'},
  }
};

function execute(ram) {
  let address = 0;
  let [op, params] = load(ram, address);
  while (op) {
    if (op.jump) {
      if (op.jump(params[0])) {
        address = params[1];
      } else {
        address += op.length;
      }
    } else {
      op.execute(...params, ram);
      address += op.length;
    }
    [op, params] = load(ram, address);
  }
  return ram[0];
}

/**
 *
 * @param {number[]} ram
 * @param {number} address
 */
function load(ram, address) {
  const opAndModes = ram[address];
  const opcode = opAndModes % 100;
  const modesCode = opAndModes - opcode;
  const op = OPCODES[opcode];
  console.info(`Read ${opAndModes} at ${address}`);
  if (!op) {
    return [];
  }
  console.info(ram.slice(address, address + op.length))

  const arity = op.length - 1;
  const modes =
      String(modesCode / 100).padStart(arity, '0').split('').reverse();
  const params = [];
  for (let i = 0; i < modes.length; ++i) {
    const mode = op.modeOverrides[i] || modes[i];
    params.push(MODES[mode](ram, address + 1 + i));
  }
  return [op, params];
}

const f = fs.readFileSync('input.txt', 'utf8');
const program = f.split(',').map(Number);
execute(program);
