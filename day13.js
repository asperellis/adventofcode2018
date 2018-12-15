const readInput = require('./utils/readInput');

readInput(13, data => {
  // carts
  class Cart {
    constructor(location, type) {
      this.type = type; // see CART_TYPES
      this.turning = 'l'; // l, s, r
      this.location = location; // [x, y]
    }
  }

  // the track the carts move on
  const track = data
    .trim()
    .split('\n')
    .map(row => row.split(''));

  // the types of carts
  const CART_TYPES = ['v', '^', '<', '>'];

  // all of the carts on the track
  const carts = [];

  // location of a cart collision
  let collision = false;

  // sorts carts by their y first and then x closest to 0,0
  const byLocation = (c1, c2) => {
    const [c1x, c1y] = c1.location;
    const [c2x, c2y] = c2.location;

    if (c2y < c1y) {
      return 1;
    }

    if (c1y < c2y || c1x < c2x) {
      return -1;
    }

    if (c2x < c1x) {
      return 1;
    }

    return 0;
  };

  // find all the carts
  for (let y = 0; y < track.length; y++) {
    for (let x = 0; x < track[y].length; x++) {
      const char = track[y][x];
      if (CART_TYPES.indexOf(char) >= 0) {
        // make a cart
        const cart = new Cart([x, y], char);
        carts.push(cart);
      }
      // take the cart off the track. only moving the carts location based on the track
      track[y][x] = '|';
    }
  }

  const moveCarts = carts => {
    carts.forEach(cart => {
      // they are in a current location
      const location = track[cart.location[1]][cart.location[0]];
    });

    return carts;
  };

  while (!collision) {
    carts = moveCarts(carts).sort(byLocation);
  }

  console.log(carts, carts.sort(byLocation));
});
