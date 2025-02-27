import { useState, useEffect } from "react";
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button } from "@mui/material";
import { useMyRecipesStore } from "../store/store";
import { fetchRecipeById } from "../api/recipes";

const MyRecipesPage = () => {
  const { myRecipes, removeRecipe } = useMyRecipesStore();
  const [selectedRecipe, setSelectedRecipe] = useState(myRecipes[0] || null);
  const [recipeDetails, setRecipeDetails] = useState<any>(null);
  const [totalIngredients, setTotalIngredients] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedRecipe) {
      fetchRecipeById(selectedRecipe.idMeal).then(setRecipeDetails);
    }
  }, [selectedRecipe]);

  useEffect(() => {
    const fetchIngredients = async () => {
      const allIngredients: Record<string, string[]> = {};

      for (const recipe of myRecipes) {
        const details = await fetchRecipeById(recipe.idMeal);
        if (details) {
          for (let i = 1; i <= 20; i++) {
            const ingredient = details[`strIngredient${i}`];
            const measure = details[`strMeasure${i}`];
            if (ingredient) {
              if (!allIngredients[ingredient]) {
                allIngredients[ingredient] = [];
              }
              allIngredients[ingredient].push(measure.trim());
            }
          }
        }
      }

      const summarizedIngredients = Object.entries(allIngredients).reduce(
        (acc, [name, measures]) => {
          acc[name] = measures.join(", ");
          return acc;
        },
        {} as Record<string, string>
      );

      setTotalIngredients(summarizedIngredients);
    };

    fetchIngredients();
  }, [myRecipes]);

  return (
    <Container sx={{ mt: 12, mb: 6 }}>
      <Typography variant='h3' component='h1' sx={{ mb: 3, textAlign: "center" }}>
        My Recipes
      </Typography>

      <Grid container spacing={3}>
        {myRecipes.length > 0 && (
          <Grid item xs={12} md={4}>
            {myRecipes.map((recipe) => (
              <Card key={recipe.idMeal} sx={{ display: "flex", mb: 2 }}>
                <CardMedia
                  component='img'
                  sx={{ width: 100 }}
                  image={recipe.strMealThumb}
                  alt={recipe.strMeal}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant='h6'>{recipe.strMeal}</Typography>
                  <Typography variant='body1' color='textSecondary'>
                    {recipe.strCategory} {recipe.strArea ? `- ${recipe.strArea}` : ""}
                  </Typography>
                  <Button
                    variant='outlined'
                    color='primary'
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => setSelectedRecipe(recipe)}>
                    View
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => removeRecipe(recipe.idMeal)}>
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Grid>
        )}

        <Grid item xs={12} md={myRecipes.length > 0 ? 8 : 12}>
          {recipeDetails ? (
            <>
              <Typography variant='h4' sx={{ mb: 2 }}>
                {recipeDetails.strMeal}
              </Typography>
              <Typography variant='h5'>
                <strong>Ingredients:</strong>
              </Typography>
              <ul>
                {Array.from({ length: 20 }, (_, i) => i + 1)
                  .map((i) => ({
                    ingredient: recipeDetails[`strIngredient${i}`],
                    measure: recipeDetails[`strMeasure${i}`],
                  }))
                  .filter((item) => item.ingredient)
                  .map((item, index) => (
                    <li key={index}>
                      {item.ingredient} - {item.measure}
                    </li>
                  ))}
              </ul>
              <Typography variant='h5' sx={{ mt: 3 }}>
                <strong>Instructions:</strong>
              </Typography>
              <Typography variant='body1'>{recipeDetails.strInstructions}</Typography>
            </>
          ) : (
            <Typography variant='h6' sx={{ textAlign: "center", color: "gray" }}>
              Select a recipe to view details
            </Typography>
          )}
        </Grid>
      </Grid>

      {Object.keys(totalIngredients).length > 0 && (
        <Container sx={{ mt: 4, textAlign: "left", pl: 0 }}>
          <Typography variant='h4'>Ingredients Summary:</Typography>
          <ul style={{ listStyleType: "none", padding: 0, marginLeft: 0 }}>
            {Object.entries(totalIngredients).map(([name, quantity]) => (
              <li key={name}>
                <Typography variant='h6'>
                  {name} - {quantity}
                </Typography>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </Container>
  );
};

export default MyRecipesPage;
