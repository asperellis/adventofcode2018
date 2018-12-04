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

      charMap[char] += 1;

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

  const findSimilar = ids => {
    const queue = ids.map(mapChars);

    while (queue.length) {
      const map1 = queue.shift();
      for (let i = 0; i < queue.length; i++) {
        let diffs = 0;
        const map2 = queue[i];

        for (const char in map1) {
          diffs += Math.abs(map1[char] - (map2[char] || 0));
        }

        for (const char in map2) {
          if (!map1[char]) {
            diffs += map2[char];
          }
        }
        if (diffs === 2) {
          console.log([map1, map2]);
        }
      }
    }

    return 'no diffs';
  };

  //console.log(findSimilar(input));
  let arr = input;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const charsI = [...arr[i]];
      const charsJ = [...arr[j]];
      console.log(charsI, charsJ);
      let diff = charsI.reduce((a, c, i) => a + (c === charsJ[i] ? 0 : 1), 0);

      if (diff === 1) {
        console.log(arr[i]);
        console.log(arr[j]);
      }
    }
  }
});
