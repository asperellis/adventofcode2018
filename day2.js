const readInput = require('./utils/readInput');

readInput(2, data => {
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

  // finds 2 similar ids that are only one char different in the same location
  const findSimilar = ids => {
    let diffLocation = 0;

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const charsI = [...ids[i]];
        const charsJ = [...ids[j]];

        let diff = charsI.reduce((a, c, i) => {
          if (c === charsJ[i]) {
            return a;
          }
          diffLocation = i;
          return a + 1;
        }, 0);

        if (diff === 1) {
          // send back shared chars of similars
          return (
            ids[i].slice(0, diffLocation) +
            ids[i].slice(diffLocation + 1, ids[i].length)
          );
        }
      }
    }

    return 'no diffs';
  };

  const charCounts = input
    .map(mapChars)
    .reduce(hasTwoOrThreeSimilarChars, { twos: 0, threes: 0 });

  // PART 1
  console.log(charCounts.twos * charCounts.threes);

  // PART 2
  console.log(findSimilar(input));
});
