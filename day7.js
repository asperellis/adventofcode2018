const readInput = require('./utils/readInput');

readInput(7, data => {
  // puzzle input. set of instruction steps
  const input = data
    .trim()
    .split('\n')
    .map(instruction =>
      instruction
        .replace(' can begin.', '')
        .replace('Step ', '')
        .split(' must be finished before step ')
    );

  const buildSleigh = steps => {
    // breaking start and finished into two arrays to search for roots
    const stepsBrokenApart = steps.reduce(
      (steps, r) => [[...steps[0], r[0]], [...steps[1], r[1]]],
      [[], []]
    );

    // the roots are the starting points for the instruction set
    const roots = new Set(
      stepsBrokenApart
        .shift()
        .filter(step => !stepsBrokenApart[0].includes(step))
    );

    const timeForStep = char => 60 + char.charCodeAt() - 64;

    let stepsRemaining = [...steps];
    let stepsInOrder = '';
    let stepsToRun = [];

    // start with the roots
    roots.forEach(r => stepsToRun.push(r));
    // alpha order
    stepsToRun.sort();

    // now run through the steps starting with the roots to get the order
    while (stepsToRun.length) {
      // get the next step
      const step = stepsToRun.shift();

      // list of steps left
      stepsRemaining = stepsRemaining.filter(s => s[0] !== step);

      // add the steps children to the queue - the last filter removes any next step that still has other steps tied to it
      let nextSteps = steps
        .filter(s => s[0] === step)
        .map(next => next[1])
        .filter(ns => !stepsRemaining.filter(sr => sr[1] === ns).length);

      // add it to the order
      stepsInOrder += step;

      // add the next steps if any
      if (nextSteps.length > 0) {
        stepsInOrder += ':';
        stepsToRun = [...stepsToRun, ...nextSteps].sort();
      }
    }

    return stepsInOrder;
  };

  // PART 1
  console.log(buildSleigh(input).replace(/:/g, ''));

  // PART 2
  // console.log(getBuildTime(buildSleigh(input), 5));
});
