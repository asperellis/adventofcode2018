const readInput = require('./utils/readInput');

readInput(11, data => {
  // just one nubmer given
  const gridSerialNumber = Number(data);

  const getLargestPowerGrid = (gridSize, sectionSize, serialNumber) => {
    const powerLevels = {};

    const calcPowerLevel = (x, y, serial, size) => {
      let sectionPowerLevel = 0;

      const coordPowerLevel = (z, k, s) => {
        // Find the fuel cell's rack ID, which is its X coordinate plus 10.
        const rackId = z + 10;
        // Begin with a power level of the rack ID times the Y coordinate.
        let powerLevel = rackId * k;
        // Increase the power level by the value of the grid serial number (your puzzle input).
        powerLevel += s;
        // Set the power level to itself multiplied by the rack ID.
        powerLevel *= rackId;
        // Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
        powerLevel = powerLevel.toString().slice(2, 3) || 0;
        // Subtract 5 from the power level.
        powerLevel = Number(powerLevel) - 5;

        return powerLevel;
      };

      for (let k = y; k < y + size; k++) {
        for (let z = x; z < x + size; z++) {
          sectionPowerLevel += coordPowerLevel(k, z, serial);
        }
      }
      return sectionPowerLevel;
    };

    for (let y = 1; y < gridSize - sectionSize; y += sectionSize) {
      for (let x = 1; x < gridSize - sectionSize; x += sectionSize) {
        powerLevels[`${x},${y}`] = calcPowerLevel(
          x,
          y,
          serialNumber,
          sectionSize
        );
      }
    }

    return Object.keys(powerLevels).reduce((a, b) =>
      powerLevels[a] > powerLevels[b] ? a : b
    );
  };

  console.log(getLargestPowerGrid(300, 3, gridSerialNumber));
});
