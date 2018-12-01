const fs = require('fs');

fs.readFile('inputs/day1.txt', 'utf8', (err, data) => {
  // only searching for root so filter out all without children
  const input = data.trim().split('\n');
});
