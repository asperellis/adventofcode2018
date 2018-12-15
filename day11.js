const readInput = require('./utils/readInput');

readInput(11, data => {
  // just one nubmer given
  const gridSerialNumber = Number(data);

  const getLargestPowerGrid = (gridSize, sectionSize, serialNumber) => {
    let maxPowerLevel = 0;
    let maxPowerLevelCoord = '';

    const calcPowerLevel = (x, y, serial, size) => {
      let sectionPowerLevel = 0;

      const coordPowerLevel = (k, z, s) => {
        // Find the fuel cell's rack ID, which is its X coordinate plus 10.
        const rackId = k + 10;
        // Begin with a power level of the rack ID times the Y coordinate.
        let powerLevel = rackId * z;
        // Increase the power level by the value of the grid serial number (your puzzle input).
        powerLevel += s;
        // Set the power level to itself multiplied by the rack ID.
        powerLevel *= rackId;
        // Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
        powerLevel =
          String(powerLevel).slice(-3).length > 2
            ? Number(String(powerLevel).slice(-3)[0])
            : 0;
        // Subtract 5 from the power level.
        powerLevel -= 5;

        return powerLevel;
      };

      for (let k = x; k < x + size; k++) {
        for (let z = y; z < y + size; z++) {
          sectionPowerLevel += coordPowerLevel(k, z, serial);
        }
      }

      return sectionPowerLevel;
    };

    for (let x = 1; x < gridSize - sectionSize; x += sectionSize) {
      for (let y = 1; y < gridSize - sectionSize; y += sectionSize) {
        const sectionPowerLevel = calcPowerLevel(
          x,
          y,
          serialNumber,
          sectionSize
        );

        if (sectionPowerLevel > maxPowerLevel) {
          maxPowerLevel = sectionPowerLevel;
          maxPowerLevelCoord = `${x},${y}`;
        }
      }
    }

    // testing console.log(calcPowerLevel(217, 196, 39, 3, true));

    return `${sectionSize}x${sectionSize} Section at ${maxPowerLevelCoord} has max power level of ${maxPowerLevel}`;
  };

  // PART 1
  console.log(getLargestPowerGrid(300, 3, 42));
});
