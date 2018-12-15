const readInput = require('./utils/readInput');
const fs = require('fs');

readInput(10, data => {
  let points = data
    .trim()
    .split('\n')
    .map(d =>
      d
        .slice(0, -1)
        .replace('position=<', '')
        .replace(' velocity=', '')
        .split('><')
        .map(c => c.split(', ').map(Number))
    );

  const movePoints = points => {
    let [x, y] = points[0];
    let [vx, vy] = points[1];

    x += vx;
    y += vy;

    return [[x, y], [vx, vy]];
  };

  const plotPoints = points => {
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
        { xMax: 0, yMax: 0, xMin: 0, yMin: 0 }
      );
    const [x, y] = points[0];
  };

  setInterval(() => {
    points = points.map(movePoints);
    const pointsPlotted = plotPoints(points);

    fs.writeFile('./outputs/day10output.txt', pointsPlotted, err => {
      // throws an error, you could also catch it here
      if (err) throw err;
    });
  }, 1000);
});
