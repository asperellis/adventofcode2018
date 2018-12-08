const fs = require('fs');

module.exports = (day, solution) =>
  fs.readFile(`inputs/day${day}.txt`, 'utf8', (err, data) => solution(data));
