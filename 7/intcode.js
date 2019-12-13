const fs = require('fs');

class Device {
  constructor(name, ram, input, phaseConfig) {
    this.name = name;
    this.halted = false;
    this.input = input;
    this.output = [];
    this.phaseConfig = phaseConfig;
    this.initialRead = true;
    this.ram = ram;
    this.address = 0;
  }

  readInput() {
    if (this.initialRead) {
      this.initialRead = false;
      return this.phaseConfig;
    } else {
      return this.input.pop();
    }
  }

  execute() {
    let [op, params] = load(this.ram, this.address);
    while (op) {
      if (op.jump) {
        if (op.jump(params[0])) {
          this.address = params[1];
        } else {
          this.address += op.length;
        }
      } else if (op.halt) {
        this.halted = true;
        return;
      } else {
        if (op.read) {
          const input = this.readInput();
          if (input == null) {
            return;
          }
          op.execute(...params, this.ram, () => input);
        } else if (op.write) {
          op.execute(...params, (v) => {
            this.output.push(v);
          });
        } else {
          op.execute(...params, this.ram);
        }
        this.address += op.length;
      }
      [op, params] = load(this.ram, this.address);
    }
  }
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
    read: true,
    execute: (a, ram, consume) => ram[a] = consume(),
    length: 2,
    modeOverrides: {0: '1'},
  },
  4: {
    write: true,
    execute: (a, emit) => emit(a),
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
  },
  99: {
    halt: true,
    modeOverrides: {},
  }
};

function load(ram, address) {
  const opAndModes = ram[address];
  const opcode = opAndModes % 100;
  const modesCode = opAndModes - opcode;
  const op = OPCODES[opcode];
  if (!op) {
    return [];
  }

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

const f = fs.readFileSync(process.argv[2] || 'input.txt', 'utf8');
const program = f.split(',').map(Number);

const permutations = permuteAll([5, 6, 7, 8, 9]);

let maxSignal = -Infinity;
for (const phaseConfig of permutations) {
  let devices = setUpAmplifierLoop(program, phaseConfig);
  const deviceE = devices[4];

  while (devices.length) {
    for (const device of devices) {
      device.execute();
    }
    devices = devices.filter(d => !d.halted);
  }
  const lastOutputFromE = deviceE.output.pop();
  if (lastOutputFromE > maxSignal) {
    maxSignal = lastOutputFromE;
  }
}
console.info(maxSignal);

function setUpAmplifierLoop(program, [aPhase, bPhase, cPhase, dPhase, ePhase]) {
  const a = new Device('A', [...program], null, aPhase);
  const b = new Device('B', [...program], a.output, bPhase);
  const c = new Device('C', [...program], b.output, cPhase);
  const d = new Device('D', [...program], c.output, dPhase);
  const e = new Device('E', [...program], d.output, ePhase);

  // Further special configuration of device A: tie the knot, and inject a
  // synthetic 0 signal.
  a.input = e.output;
  a.input.push(0);
  return [a, b, c, d, e];
}

// https://stackoverflow.com/a/20871714
function permuteAll(inputArr) {
  const result = [];
  function permute(arr, m = []) {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(inputArr)

  return result;
}
