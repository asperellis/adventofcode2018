const fs = require('fs');

fs.readFile('inputs/day1.txt', 'utf8', (err, data) => {
  // puzzle input. array of strings with +/- and a numeric value
  const input = data.trim().split('\n');

  // changes the frequency value
  const adjustFrequency = (frequency, change) => {
    // the numeric value of the change
    const value = parseInt(change.slice(1), 10);
    // + or -
    const direction = change.slice(0, 1);
    // adjustment functions
    const adjust = {
      '+': (f, n) => (f += n),
      '-': (f, n) => (f -= n)
    };
    // new frequency
    return adjust[direction](frequency, value);
  };

  // gets the frequency based on an array of changes
  const getFrequency = changes => {
    let frequency = 0;

    // for each change adjust the frequency
    changes.forEach(change => {
      frequency = adjustFrequency(frequency, change);
    });

    return frequency;
  };

  // runs through all the changes until the first repeated frequency is found
  const getFirstRepeatedFrequency = changes => {
    // tracks all the frequencies
    const frequencies = {};
    let frequency = 0;
    let changeIndex = 0;
    let frequencyRepeated = false;

    // run until we have a repeated frequency
    while (!frequencyRepeated) {
      // adjust the frequency
      frequency = adjustFrequency(frequency, changes[changeIndex]);

      if (frequencies[frequency]) {
        // repeated frequency found
        frequencyRepeated = true;
      } else {
        frequencies[frequency] = 1;
        changeIndex++;
        // reset to the start
        if (changeIndex === changes.length) {
          changeIndex = 0;
        }
      }
    }

    return frequency;
  };

  // PART 1 Solution - 569 for me
  console.log(getFrequency(input));

  // PART 2 Solution - 77666 for me
  console.log(getFirstRepeatedFrequency(input));
});
