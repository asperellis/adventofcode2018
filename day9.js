const readInput = require('./utils/readInput');

readInput(9, data => {
  const [players, marbles] = data
    .replace(' points', '')
    .trim()
    .split(' players; last marble is worth ')
    .map(Number);

  const playMarbles = (playerCount, marbleCount) => {
    let marbleCircle = [0];
    let marbleEnteringCircle = 1;
    const scores = {};
    let currentMarble = 0;
    let currentMarbleLocation = marbleCircle.indexOf(currentMarble);
    let currentPlayer = 1;

    while (marbleEnteringCircle < marbleCount) {
      if (marbleEnteringCircle % 23 === 0) {
        // scoring
        // diff actions for marbles that are multiples of 23 based on rules
        if (!scores[currentPlayer]) {
          scores[currentPlayer] = 0;
        }

        // player keeps the marble and adds to the score
        let marbleToRemoveIndex =
          (currentMarbleLocation - 7) % marbleCircle.length;
        if (marbleToRemoveIndex < 0) {
          marbleToRemoveIndex = marbleCircle.length + marbleToRemoveIndex;
        }
        const marbleToRemove = marbleCircle[marbleToRemoveIndex];

        // update scores
        scores[currentPlayer] += marbleEnteringCircle + marbleToRemove;

        // The marble 7 marbles counter-clockwise from the current marble is removed from the circle
        marbleCircle = [
          ...marbleCircle.slice(0, marbleToRemoveIndex),
          ...marbleCircle.slice(marbleToRemoveIndex + 1)
        ];

        // The marble located immediately clockwise of the marble that was removed becomes the new current marble.
        currentMarble = marbleCircle[marbleToRemoveIndex];
      } else {
        // normal play - place it in the circle at the right location - between index to the right 1 and 2 - two away
        if (
          marbleCircle.length < 2 ||
          currentMarbleLocation + 2 === marbleCircle.length
        ) {
          marbleCircle.push(marbleEnteringCircle);
        } else {
          const newMarbleLocation =
            (currentMarbleLocation + 2) % marbleCircle.length;

          marbleCircle = [
            ...marbleCircle.slice(0, newMarbleLocation),
            marbleEnteringCircle,
            ...marbleCircle.slice(newMarbleLocation)
          ];
        }

        // set the current marble
        currentMarble = marbleEnteringCircle;
      }

      // change players
      if (currentPlayer === playerCount) {
        currentPlayer = 1;
      } else {
        currentPlayer++;
      }

      // next marble
      marbleEnteringCircle++;
      currentMarbleLocation = marbleCircle.indexOf(currentMarble);
    }

    const winningPlayer = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    return `Player ${winningPlayer} won with a score of ${
      scores[winningPlayer]
    }`;
  };

  // PART 1
  console.log(playMarbles(players, marbles));

  // PART 2
  console.log(playMarbles(players, marbles * 100));
});
