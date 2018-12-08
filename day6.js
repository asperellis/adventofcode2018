const readInput = require('./utils/readInput');

readInput(6, data => {
  // puzzle input. array of strings with +/- and a numeric value
  const input = data
    .trim()
    .split('\n')
    .map(c => c.split(', ').map(Number));

  // calcs manhattan distance between two points
  const calcDistance = (p, q) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]);

  // given a set of coordinates get the max x,y from the set
  const getBounds = coordinates =>
    coordinates.reduce(
      (bounds, coordinate) => {
        const [x, y] = coordinate;
        if (x > bounds.x) {
          bounds.x = x;
        }
        if (y > bounds.y) {
          bounds.y = y;
        }

        return bounds;
      },
      { x: 0, y: 0 }
    );

  const getLargestFiniteArea = coordinates => {
    // increase the count of each mapped coordinate only if one coord is closest (vs 2)
    const areas = {};
    const maxBounds = getBounds(coordinates);
    const infiniteAreas = [];

    // go through each coordinate and find its closest mapped coordinate
    for (let x = 0; x < maxBounds.x; x++) {
      for (let y = 0; y < maxBounds.y; y++) {
        let closestDistance;
        let closestPoint = '';
        const isAtBounds =
          x === 0 || y === 0 || x === maxBounds.x - 1 || y === maxBounds.y - 1;

        // for every mapped coordinate find the closest one to x,y
        for (const coordinate of coordinates) {
          const [p, q] = coordinate;
          // distance between coordinate and x,y
          const distanceBetween = calcDistance([x, y], [p, q]);

          // object that keeps track of each areas size
          if (!areas[`${p},${q}`]) {
            areas[`${p},${q}`] = 1;
          }

          // check if its distance closer or equal to the closest point
          if (!closestDistance || closestDistance > distanceBetween) {
            closestDistance = distanceBetween;
            closestPoint = `${p},${q}`;
          } else if (closestDistance === distanceBetween) {
            closestPoint += `:${p},${q}`;
          }
        }

        // keep track of the infinite areas - the ones that touch the bounds
        if (
          isAtBounds &&
          closestPoint.split(':').length === 1 &&
          !infiniteAreas.includes(closestPoint)
        ) {
          infiniteAreas.push(closestPoint);
        }

        // if theres only one point thats closest then count it
        if (closestPoint.split(':').length === 1) {
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

  // given a map of coordinates calculate the region size of coordinates less than the max distance provided
  const getSafeRegionSize = (coordinates, maxDistance) => {
    let safeRegionSize = 0;
    const maxBounds = getBounds(coordinates);

    // go through each coordinate within the bounds and find the sum of distances from each mapped coordinate
    for (let x = 0; x < maxBounds.x; x++) {
      for (let y = 0; y < maxBounds.y; y++) {
        let distanceFromMappedCoordinates = 0;
        // for every mapped coordinate find the closest one to x,y
        for (const coordinate of coordinates) {
          // distance between coordinate and x,y
          distanceFromMappedCoordinates += calcDistance([x, y], coordinate);
        }

        // if the sum is less than the maxDistance then count that coordinate as part of the safe region
        if (distanceFromMappedCoordinates < maxDistance) {
          safeRegionSize += 1;
        }
      }
    }

    return safeRegionSize;
  };

  // PART 1
  console.log(getLargestFiniteArea(input));

  // PART 2
  console.log(getSafeRegionSize(input, 10000));
});
