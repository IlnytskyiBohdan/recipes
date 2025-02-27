import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Typography, Card, CardMedia, CardContent, Button, Grid } from "@mui/material";
import { fetchRecipeById } from "../api/recipes";
import { useMyRecipesStore } from "../store/store";

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const { myRecipes, addRecipe, removeRecipe } = useMyRecipesStore();
  const isAdded = myRecipes.some((r) => r.idMeal === id);

  useEffect(() => {
    if (id) {
      fetchRecipeById(id).then(setRecipe);
    }
  }, [id]);

  if (!recipe) return <Typography sx={{ textAlign: "center", mt: 12 }}>Loading...</Typography>;

  return (
    <Container sx={{ mt: 12, mb: 6 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        {recipe.strMeal}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardMedia component="img" image={recipe.strMealThumb} alt={recipe.strMeal} />
          </Card>
        </Grid>

  
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6">Category: {recipe.strCategory}</Typography>
              <Typography variant="h6">Origin: {recipe.strArea}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Ingredients:
              </Typography>
              <ul>
                {Array.from({ length: 20 }, (_, i) => i + 1)
                  .map((index) => ({
                    ingredient: recipe[`strIngredient${index}`],
                    measure: recipe[`strMeasure${index}`],
                  }))
                  .filter(({ ingredient }) => ingredient)
                  .map(({ ingredient, measure }) => (
                    <li key={ingredient}>
                      {ingredient} - {measure}
                    </li>
                  ))}
              </ul>

             
              {isAdded ? (
                <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={() => removeRecipe(recipe.idMeal)}>
                  Remove from My Recipes
                </Button>
              ) : (
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={() => addRecipe(recipe)}>
                  Add to My Recipes
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>


      <Typography variant="h5" sx={{ mt: 4 }}>
        Instructions:
      </Typography>
      <Typography variant="body1">{recipe.strInstructions}</Typography>
    </Container>
  );
};

export default RecipePage;