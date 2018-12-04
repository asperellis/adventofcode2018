const fs = require('fs');
const moment = require('moment');

fs.readFile('inputs/day4.txt', 'utf8', (err, data) => {
  // input - date time of guards working and their sleep schedule - sorted by date
  const input = data
    .trim()
    .split('\n')
    .sort((a, b) => {
      const getDate = str =>
        str
          .split(']')
          .shift()
          .slice(1);
      return moment.utc(getDate(a)).diff(moment.utc(getDate(b)));
    });

  const getLargestValue = obj =>
    Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));

  const guardSleepData = records => {
    // data of all the guards and their total mins slept on the job
    const guardsSleepTracker = {};
    // tracks guards minute popularity for sleeping
    const minuteTracker = {};

    let currentGuard;
    let lastSlept;

    for (const record of records) {
      const [datetime, description] = record.replace('[', '').split('] ');

      if (description.includes('begins shift')) {
        // set the current guard
        currentGuard = Number(description.split(' ')[1].slice(1));
        // for tracking mins slept we need to setup the guard in the tracker
        if (!guardsSleepTracker[currentGuard]) {
          guardsSleepTracker[currentGuard] = 0;
        }
        if (!minuteTracker[currentGuard]) {
          minuteTracker[currentGuard] = {};
        }
      } else {
        // guard is either sleeping or waking up so we need time work
        const min = Number(
          datetime
            .split(' ')
            .pop()
            .split(':')
            .pop()
        );

        if (description.includes('falls asleep')) {
          lastSlept = min;
        }

        if (description.includes('wakes up')) {
          // add to the total mins slept
          guardsSleepTracker[currentGuard] += min - lastSlept;
          // keeps track of what minutes each guard sleeps on the most
          for (let i = lastSlept; i < min; i++) {
            if (!minuteTracker[currentGuard][i]) {
              minuteTracker[currentGuard][i] = 1;
            } else {
              minuteTracker[currentGuard][i] += 1;
            }
          }
        }
      }
    }

    // For Part 1
    const sleepiestGuard = getLargestValue(guardsSleepTracker);
    const sleepiestGuardMin = getLargestValue(minuteTracker[sleepiestGuard]);

    // For Part 2
    let sleepiestMin = 0;
    let sleepiestMinCount = 0;
    let sleepiestMinGuard = 0;

    // Go through all of the collected min data. get each guards most freq min and compare to the others
    for (const guard in minuteTracker) {
      // if a guard has sleep data
      if (Object.keys(minuteTracker[guard]).length) {
        const guardsFavoriteMin = getLargestValue(minuteTracker[guard]);
        if (minuteTracker[guard][guardsFavoriteMin] > sleepiestMinCount) {
          sleepiestMin = guardsFavoriteMin;
          sleepiestMinGuard = guard;
          sleepiestMinCount = minuteTracker[guard][guardsFavoriteMin];
        }
      }
    }

    console.log(sleepiestMin, sleepiestMinGuard);
    return {
      sleepiestGuard,
      sleepiestGuardMin,
      sleepiestMin,
      sleepiestMinGuard
    };
  };

  // guard sleep data processed - returns sleepiest guard and his/her fav min + table of min slept freq for part 2
  const sleepData = guardSleepData(input);

  // PART 1 - Get the guard that sleeps the most
  console.log(sleepData.sleepiestGuard * sleepData.sleepiestGuardMin);

  // PART 2 - Which guard slept the most on a single minute
  console.log(sleepData.sleepiestMin * sleepData.sleepiestMinGuard);
});
