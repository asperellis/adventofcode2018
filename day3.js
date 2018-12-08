const readInput = require('./utils/readInput');

readInput(3, data => {
  // puzzle input. array of strings with rect sizes and dist from left and right edges ie
  // #1 @ 236,827: 24x17 => [id, @, xy, wh]
  const input = data
    .trim()
    .split('\n')
    .map(claim => {
      const [id, at, location, size] = claim.split(' ');
      const [distFromLeft, distFromTop] = location
        .slice(0, -1)
        .split(',')
        .map(Number);
      const [width, height] = size.split('x').map(Number);

      return { id, distFromLeft, distFromTop, width, height };
    });

  const plotClaims = claims => {
    // where we will plot each claim
    const grid = {};

    // for each claim save to the grid - each coord will count overlaps
    for (const claim of claims) {
      // plot the claim
      for (
        let x = claim.distFromLeft;
        x < claim.distFromLeft + claim.width;
        x++
      ) {
        for (
          let y = claim.distFromTop;
          y < claim.distFromTop + claim.height;
          y++
        ) {
          grid[`${x},${y}`] = (grid[`${x},${y}`] || 0) + 1;
        }
      }
    }

    // return the object values that are > 1 which = overlap
    return Object.keys(grid)
      .map(e => grid[e])
      .filter(v => v > 1).length;
  };

  const getClaimWithNoOverlaps = claims => {
    // checks if two claims overlap
    const overlaps = (c1, c2) =>
      c1.distFromLeft < c2.distFromLeft + c2.width &&
      c1.distFromTop < c2.distFromTop + c2.height &&
      c2.distFromLeft < c1.distFromLeft + c1.width &&
      c2.distFromTop < c1.distFromTop + c1.height;

    for (let i = 0; i < claims.length; i++) {
      let overlapped = false;

      // check all the other claims to see if it overlaps this one
      for (let k = 0; k < claims.length; k++) {
        // a claim would overlap itself!
        if (claims[i].id !== claims[k].id) {
          // checks for overlap between two claims
          if (overlaps(claims[i], claims[k])) {
            overlapped = true;
            break;
          }
        }
      }

      // the lone clean claim
      if (!overlapped) {
        return claims[i].id;
      }
    }

    return false;
  };

  // PART 1 Solution
  console.log(plotClaims(input));

  // PART 2 Solution
  console.log(getClaimWithNoOverlaps(input));
});
