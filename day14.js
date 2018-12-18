const readInput = require('./utils/readInput');

readInput(14, data => {
  const generateNewRecipies = (c1, c2) => String(Number(c1) + Number(c2));

  const makeRecipies = n => {
    let recipes = '37';
    let currRecipe1 = 0;
    let currRecipe2 = 1;

    while (recipes.length < n + 10) {
      recipes += generateNewRecipies(
        recipes[currRecipe1],
        recipes[currRecipe2]
      );

      currRecipe1 =
        (currRecipe1 + (Number(recipes[currRecipe1]) + 1)) % recipes.length;
      currRecipe2 =
        (currRecipe2 + (Number(recipes[currRecipe2]) + 1)) % recipes.length;
    }

    return recipes.slice(n, n + 10);
  };

  const howManyRecipesUntil = str => {
    let recipes = '37';
    let currRecipe1 = 0;
    let currRecipe2 = 1;
    let recipesMade = 2;

    while (recipes.slice(-1 * str.length) !== str) {
      const newRecipes = generateNewRecipies(
        recipes[currRecipe1],
        recipes[currRecipe2]
      );

      recipes += newRecipes;

      currRecipe1 =
        (currRecipe1 + (Number(recipes[currRecipe1]) + 1)) % recipes.length;
      currRecipe2 =
        (currRecipe2 + (Number(recipes[currRecipe2]) + 1)) % recipes.length;

      recipesMade += newRecipes.length;
    }

    return recipesMade - str.length;
  };

  // PART 1
  console.log(makeRecipies(Number(data)));

  // PART 2
  console.log(howManyRecipesUntil(data));
});
