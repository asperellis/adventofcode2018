const fs = require('fs');

fs.readFile('inputs/day2.txt', 'utf8', (err, data) => {
  // puzzle input. array of strings with +/- and a numeric value
  const input = data.trim().split('\n');

  // data map of each char in id string and how many times it appears in the string
  const mapChars = idStr =>
    idStr.split('').reduce((charMap, char) => {
      if (!charMap[char]) {
        charMap[char] = 0;
      }

      charMap[char]++;

      return charMap;
    }, {});

  // counts if theres an occurance of two or three of the same char in an id string
  const hasTwoOrThreeSimilarChars = (counts, charMap) => {
    const objectValues = Object.keys(charMap).map(e => charMap[e]);
    if (objectValues.indexOf(2) > -1) {
      counts.twos++;
    }

    if (objectValues.indexOf(3) > -1) {
      counts.threes++;
    }

    return counts;
  };

  const charCounts = input
    .map(mapChars)
    .reduce(hasTwoOrThreeSimilarChars, { twos: 0, threes: 0 });

  // PART 1 Solution
  console.log(charCounts.twos * charCounts.threes);
});
