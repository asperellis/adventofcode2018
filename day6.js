const fs = require('fs');

fs.readFile('inputs/day6.txt', 'utf8', (err, data) => {
  // puzzle input. array of strings with +/- and a numeric value
  const input = data
    .trim()
    .split('\n')
    .map(c => c.split(', ').map(Number));

  // calcs manhattan distance between two points
  const calcDistance = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);

  const getLargestFiniteArea = coordinates => {
    // increase the count of each mapped coordinate only if one coord is closest (vs 2)
    const areas = {};
    const maxBounds = {};
    const infiniteAreas = [];

    for (const coordinate of coordinates) {
      // plot the given coordinates - account for their area
      const [x, y] = coordinate;
      areas[`${x},${y}`] = 1;

      // also get max bounds
      if (x > (maxBounds.x || 0)) {
        maxBounds.x = x;
      }
      if (y > (maxBounds.y || 0)) {
        maxBounds.y = y;
      }
    }

    // go through each coordinate and find its closest mapped coordinate
    for (let x = 0; x < maxBounds.x; x++) {
      for (let y = 0; y < maxBounds.y; y++) {
        let closestDistance;
        let closestPoint = '';
        const isAtBounds =
          x === 0 || y === 0 || x === maxBounds.x - 1 || y === maxBounds.y - 1;

        // for every mapped coordinate find the closest one to x,y
        for (const coordinate of coordinates) {
          // distance between coordinate and x,y
          const distanceBetween = calcDistance([x, y], coordinate);

          // check if its distance closer or equal to the closest point
          if (!closestDistance || closestDistance > distanceBetween) {
            closestDistance = distanceBetween;
            closestPoint = `${coordinate[0]},${coordinate[1]}`;
          } else if (closestDistance === distanceBetween) {
            closestPoint += `:${coordinate[0]},${coordinate[1]}`;
          }
        }

        const onlyOneClosestPoint = closestPoint.split(':').length === 1;

        // keep track of the infinite areas - the ones that touch the bounds
        if (
          isAtBounds &&
          onlyOneClosestPoint &&
          !infiniteAreas.includes(closestPoint)
        ) {
          infiniteAreas.push(closestPoint);
        }

        // if theres only one point thats closest then count it
        if (onlyOneClosestPoint) {
          areas[closestPoint] += 1;
        }
      }
    }

    // ignore infinite spanning areas
    const largestFiniteArea = Object.keys(areas)
      .filter(area => !infiniteAreas.includes(area))
      .reduce((a, b) => (areas[a] > areas[b] ? a : b));

    return areas[largestFiniteArea];
  };

  // PART 1
  console.log(getLargestFiniteArea(input));
});
