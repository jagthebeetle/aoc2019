const fs = require('fs');

function consumeIn() {
  return 2;
}

function emit(v) {
  console.log('OUTPUT', v);
}

const MODES = {
  0: (ram, address) => {
    const position = ram[address] || 0;
    const value = ram[position] || 0;
    // console.info(`Read ${value} at ${position}.`);
    return value;
  },
  1: (ram, address) => {
    const value = ram[address] || 0
    // console.info(`Read ${value} directly.`);
    return value;
  },
  2: (ram, address, relativeBase) => {
    const position = relativeBase + (ram[address] || 0);
    const value = ram[position] || 0;
    // console.info(`Read ${value} at ${position} (stored at ${ram[address]} +
    // ${
    //     relativeBase}).`);
    return value;
  },
};

const OPCODES = {
  1: {
    execute: (a, b, c, ram) => {
      // console.info(`adding ${a} and ${b} and stored at ${c}`);
      ram[c] = a + b;
    },
    length: 4,
    modeOverrides: {2: '1'},
  },
  2: {
    execute: (a, b, c, ram) => {
      // console.info(`multiplied ${a} and ${b} and stored at ${c}`);
      ram[c] = a * b;
    },
    length: 4,
    modeOverrides: {2: '1'},
  },
  3: {
    execute: (a, ram) => {
      // console.info(`storing from stdin at ${a}`);
      ram[a] = consumeIn();
    },
    length: 2,
    modeOverrides: {0: '1'},
  },
  4: {
    execute: (a) => emit(a),
    length: 2,
    modeOverrides: {},
  },
  5: {
    jump: (a) => {
      // console.info(`jumping to second arg if ${a} != 0`);
      return a !== 0;
    },
    length: 3,
    modeOverrides: {}
  },
  6: {
    jump: (a) => {
      // console.info(`jumping to second arg if ${a} == 0`);
      return a === 0;
    },
    length: 3,
    modeOverrides: {}
  },
  7: {
    execute: (a, b, c, ram) => {
      // console.info(`Setting ${c} to ${a} < ${b}?`);
      ram[c] = a < b ? 1 : 0
    },
    length: 4,
    modeOverrides: {2: '1'},
  },
  8: {
    execute: (a, b, c, ram) => {
      // console.info(`Setting ${c} to ${a} == ${b}?`);
      ram[c] = a === b ? 1 : 0
    },
    length: 4,
    modeOverrides: {2: '1'},
  },
  9: {
    length: 2,
    modeOverrides: {},
    rbpChange: true,
  }
};

function execute(ram) {
  let address = 0;
  let relativeBase = 0;
  let [op, params] = load(ram, address, relativeBase);
  while (op) {
    if (op.jump) {
      if (op.jump(params[0])) {
        address = params[1];
      } else {
        address += op.length;
      }
    } else {
      if (op.rbpChange) {
        relativeBase += (params[0] || 0);
      } else {
        op.execute(...params, ram);
      }
      address += op.length;
    }
    [op, params] = load(ram, address, relativeBase);
  }
  return ram[0];
}

/**
 *
 * @param {number[]} ram
 * @param {number} address
 */
function load(ram, address, relativeBase) {
  const opAndModes = ram[address];
  const opcode = opAndModes % 100;
  const modesCode = opAndModes - opcode;
  const op = OPCODES[opcode];
  // console.info(`IP ${address}. RBP: ${relativeBase}`);
  if (!op) {
    return [];
  }
  // console.info(ram.slice(address, address + op.length))

  const arity = op.length - 1;
  const modes =
      String(modesCode / 100).padStart(arity, '0').split('').reverse();
  const params = [];
  for (let i = 0; i < modes.length; ++i) {
    const mode = modes[i] === '2' ? '2' : op.modeOverrides[i] || modes[i];
    params.push(
        (modes[i] === '2' && op.modeOverrides[i]) ?
            relativeBase + ram[address + 1 + i] :
            MODES[mode](ram, address + 1 + i, relativeBase));
  }
  return [op, params];
}

const f = fs.readFileSync('input.txt', 'utf8');
const program = f.split(',').map(Number);
execute(program);
