const fs = require('fs');

fs.readFile('inputs/day5.txt', 'utf8', (err, data) => {
  const input = data.trim();

  // removes any polar opposite chars (aA|Aa) from a string input
  const reactPolymer = polymer => {
    let reacted = polymer;
    let location = 0;

    const isPolarOpposite = (a, b) =>
      a !== b &&
      (a === b.toUpperCase() ||
        a.toUpperCase() === b ||
        a === b.toLowerCase() ||
        a.toLowerCase() === b);

    while (location < reacted.length) {
      const unit1 = reacted[location];
      const unit2 = reacted[location + 1];

      if (unit1 && unit2 && isPolarOpposite(unit1, unit2)) {
        reacted = reacted.slice(0, location) + reacted.slice(location + 2);
        location--;
      } else {
        location++;
      }
    }

    return reacted.length;
  };

  // takes each char a-z out of the polymer and returns the shortest length you can get reacting the polymer without the removed char
  const optimizeReaction = polymer => {
    // char code for a and z - the min / max
    const a = 97;
    const z = 122;

    // the best length - shortest
    let optimizedLength = polymer.length;

    // from a-z
    for (let charCode = a; charCode <= z; charCode++) {
      // get the char and take it out of the polymer
      const char = new RegExp(String.fromCharCode(charCode), 'gmi');
      const reactedLength = reactPolymer(polymer.replace(char, ''));

      // update if its less than current optimized length
      if (reactedLength < optimizedLength) {
        optimizedLength = reactedLength;
      }
    }

    return optimizedLength;
  };

  // PART 1
  console.log(reactPolymer(input));

  // PART 2
  console.log(optimizeReaction(input));
});
