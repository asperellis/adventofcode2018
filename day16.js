const readInput = require('./utils/readInput');

readInput(16, data => {
  const input = data.trim().split('-');

  // sample before and after with program lines
  const samples = input[0]
    .trim()
    .split('\r\n\r\n')
    .map(s =>
      s.split('\r\n').map(s =>
        s
          .replace('Before: ', '')
          .replace('After:  ', '')
          .replace(/(,|\]|\[)/g, '')
          .split(' ')
          .map(Number)
      )
    );

  // the program steps
  const program = input[1]
    .trim()
    .split('\n')
    .map(line => line.split(' ').map(Number));

  // checks if a sample meets the condition of an operation
  const OPP_CHECKS = {
    // addr (add register) stores into register C the result of adding register A and register B.
    addr: (before, after, aVal, bVal, cVal) =>
      before[aVal] + before[bVal] === after[cVal],
    // addi (add immediate) stores into register C the result of adding register A and value B.
    addi: (before, after, aVal, bVal, cVal) =>
      before[aVal] + bVal === after[cVal],
    // mulr (multiply register) stores into register C the result of multiplying register A and register B.
    mulr: (before, after, aVal, bVal, cVal) =>
      before[aVal] * before[bVal] === after[cVal],
    // muli (multiply immediate) stores into register C the result of multiplying register A and value B.
    muli: (before, after, aVal, bVal, cVal) =>
      before[aVal] * bVal === after[cVal],
    // banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
    banr: (before, after, aVal, bVal, cVal) => {
      return (before[aVal] & before[bVal]) === after[cVal];
    },
    // bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
    bani: (before, after, aVal, bVal, cVal) => {
      return (before[aVal] & bVal) === after[cVal];
    },
    // borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
    borr: (before, after, aVal, bVal, cVal) => {
      return (before[aVal] | before[bVal]) === after[cVal];
    },
    // bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
    bori: (before, after, aVal, bVal, cVal) => {
      return (before[aVal] | bVal) === after[cVal];
    },
    // setr (set register) copies the contents of register A into register C. (Input B is ignored.)
    setr: (before, after, aVal, bVal, cVal) => before[aVal] === after[cVal],
    // seti (set immediate) stores value A into register C. (Input B is ignored.)
    seti: (before, after, aVal, bVal, cVal) => aVal === after[cVal],
    // gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
    gtir: (before, after, aVal, bVal, cVal) => {
      return (
        (aVal > before[bVal] && after[cVal] === 1) ||
        (aVal <= before[bVal] && after[cVal] === 0)
      );
    },
    // gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
    gtri: (before, after, aVal, bVal, cVal) => {
      return (
        (before[aVal] > bVal && after[cVal] === 1) ||
        (before[aVal] <= bVal && after[cVal] === 0)
      );
    },
    // gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
    gtrr: (before, after, aVal, bVal, cVal) => {
      return (
        (before[aVal] > before[bVal] && after[cVal] === 1) ||
        (before[aVal] <= before[bVal] && after[cVal] === 0)
      );
    },
    // eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
    eqir: (before, after, aVal, bVal, cVal) => {
      return (
        (aVal === before[bVal] && after[cVal] === 1) ||
        (aVal !== before[bVal] && after[cVal] === 0)
      );
    },
    // eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
    eqri: (before, after, aVal, bVal, cVal) => {
      return (
        (before[aVal] === bVal && after[cVal] === 1) ||
        (before[aVal] !== bVal && after[cVal] === 0)
      );
    },
    // eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
    eqrr: (before, after, aVal, bVal, cVal) => {
      return (
        (before[aVal] === before[bVal] && after[cVal] === 1) ||
        (before[aVal] !== before[bVal] && after[cVal] === 0)
      );
    }
  };

  // performs the operations
  const OPPS = {
    // addr (add register) stores into register C the result of adding register A and register B.
    addr: (aVal, bVal, registers) => registers[aVal] + registers[bVal],
    // addi (add immediate) stores into register C the result of adding register A and value B.
    addi: (aVal, bVal, registers) => registers[aVal] + bVal,
    // mulr (multiply register) stores into register C the result of multiplying register A and register B.
    mulr: (aVal, bVal, registers) => registers[aVal] * registers[bVal],
    // muli (multiply immediate) stores into register C the result of multiplying register A and value B.
    muli: (aVal, bVal, registers) => registers[aVal] * bVal,
    // banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
    banr: (aVal, bVal, registers) => registers[aVal] & registers[bVal],
    // bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
    bani: (aVal, bVal, registers) => registers[aVal] & bVal,
    // borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
    borr: (aVal, bVal, registers) => registers[aVal] | registers[bVal],
    // bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
    bori: (aVal, bVal, registers) => registers[aVal] | bVal,
    // setr (set register) copies the contents of register A into register C. (Input B is ignored.)
    setr: (aVal, bVal, registers) => registers[aVal],
    // seti (set immediate) stores value A into register C. (Input B is ignored.)
    seti: (aVal, bVal, registers) => aVal,
    // gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
    gtir: (aVal, bVal, registers) => (aVal > registers[bVal] ? 1 : 0),
    // gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
    gtri: (aVal, bVal, registers) => (registers[aVal] > bVal ? 1 : 0),
    // gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
    gtrr: (aVal, bVal, registers) =>
      registers[aVal] > registers[bVal] ? 1 : 0,
    // eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
    eqir: (aVal, bVal, registers) => (aVal === registers[bVal] ? 1 : 0),
    // eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
    eqri: (aVal, bVal, registers) => (registers[aVal] === bVal ? 1 : 0),
    // eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
    eqrr: (aVal, bVal, registers) =>
      registers[aVal] === registers[bVal] ? 1 : 0
  };

  // maps opp codes to their names
  const OPP_CODES = {
    '0': 'eqri',
    '1': 'mulr',
    '2': 'gtri',
    '3': 'gtrr',
    '4': 'banr',
    '5': 'addi',
    '6': 'seti',
    '7': 'gtir',
    '8': 'muli',
    '9': 'bori',
    '10': 'setr',
    '11': 'addr',
    '12': 'bani',
    '13': 'borr',
    '14': 'eqir',
    '15': 'eqrr'
  };

  // checks samples that meet the min match reqs of operations
  const checkSamples = (samples, oppCodeMinMatch) => {
    // checks if a sample matches a min number of opps
    const check = sample => {
      const [before, rule, after] = sample;
      const [oppCode, aVal, bVal, cVal] = rule;
      let matches = 0;
      const codes = {};

      // checks each opp condition for a match
      for (const oc in OPP_CHECKS) {
        if (OPP_CHECKS[oc](before, after, aVal, bVal, cVal) && !codes[oc]) {
          matches++;
          codes[oc] = true;
        }
      }

      // used to guesstimate opp codes - TODO: programatically do this. not sure how right now
      const isCodeSet = code =>
        Object.keys(OPP_CODES).filter(k => OPP_CODES[k] === code).length === 1;

      // only one so we can match the oppcode with its name
      if (Object.keys(codes).length === 1) {
        OPP_CODES[oppCode] = Object.keys(codes).pop();
      } else {
        // lists out the possibilities for each code
        for (const code in codes) {
          if (!OPP_CODES[oppCode]) {
            OPP_CODES[oppCode] = '';
          }

          if (!OPP_CODES[oppCode].includes(code) && !isCodeSet(code)) {
            OPP_CODES[oppCode] += code + ':';
          }
        }
      }

      return matches >= oppCodeMinMatch;
    };

    // only return the amount of samples that meet the min match given
    return samples.filter(check).length;
  };

  // executes a program based on the opps
  const runProgram = program => {
    // registers are always 4 and start at 0
    const registers = [0, 0, 0, 0];
    // run each line of the program
    program.forEach(line => {
      const [oppCode, aVal, bVal, cVal] = line;
      registers[cVal] = OPPS[OPP_CODES[oppCode]](aVal, bVal, registers);
    });

    // return the first index per rules
    return registers[0];
  };

  // PART 1
  console.log(checkSamples(samples, 3));

  // PART 2
  console.log(runProgram(program));
});
