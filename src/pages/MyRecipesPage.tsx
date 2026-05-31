import { useState, useEffect } from "react";
import { Container, Grid, Typography, Card, CardContent, CardMedia, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useMyRecipesStore } from "../store/store";
import { fetchRecipeById } from "../api/recipes";
import { Recipe } from "../api/recipes";
import { summarizeIngredients, SummarizedIngredient } from "../utils/summarizeIngredients";

const MyRecipesPage = () => {
  const { myRecipes, removeRecipe } = useMyRecipesStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(myRecipes[0] || null);
  const [recipeDetails, setRecipeDetails] = useState<Recipe | null>(null);
  const [totalIngredients, setTotalIngredients] = useState<SummarizedIngredient[]>([]);

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
            const ingredientKey = `strIngredient${i}` as keyof Recipe;
            const measureKey = `strMeasure${i}` as keyof Recipe;

            const ingredient = details[ingredientKey];
            const measure = details[measureKey];

            if (ingredient) {
              if (!allIngredients[ingredient]) {
                allIngredients[ingredient] = [];
              }
              allIngredients[ingredient].push(measure?.trim() || "");
            }
          }
        }
      }

      setTotalIngredients(summarizeIngredients(allIngredients));
    };

    fetchIngredients();
  }, [myRecipes]);

  return (
    <Container sx={{ mt: 12, mb: 6 }}>
      <Typography variant='h3' component='h1' sx={{ mb: 3, textAlign: "center" }}>
        My Recipes
      </Typography>

      {myRecipes.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Box
            component="svg"
            viewBox="0 0 200 180"
            sx={{ width: 160, height: 144, display: "block", mx: "auto", mb: 3 }}
            fill="none"
          >
            <ellipse cx="100" cy="98" rx="70" ry="70" fill="#FFF3E0" />
            <ellipse cx="100" cy="98" rx="70" ry="70" stroke="#FFCCBC" strokeWidth="2.5" />
            <ellipse cx="100" cy="98" rx="55" ry="55" stroke="#FFE0B2" strokeWidth="1.5" />
            <rect x="27" y="20" width="4" height="140" rx="2" fill="#E65100" />
            <rect x="20" y="20" width="3" height="45" rx="1.5" fill="#E65100" />
            <rect x="34" y="20" width="3" height="45" rx="1.5" fill="#E65100" />
            <path d="M20 65 Q23.5 72 27 72 Q30.5 72 34 65" stroke="#E65100" strokeWidth="1.5" fill="none" />
            <rect x="169" y="20" width="4" height="140" rx="2" fill="#E65100" />
            <path d="M173 20 Q183 48 173 72" fill="#FFCCBC" stroke="#E65100" strokeWidth="1.5" />
            <circle cx="100" cy="98" r="25" stroke="#FFCCBC" strokeWidth="1.5" strokeDasharray="4 3" />
          </Box>
          <Typography variant="h5" component="h2" sx={{ mb: 1.5, fontWeight: 600 }}>
            No saved recipes yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Find something you like and tap "Add to My Recipes"
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary" size="large">
            Browse Recipes
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
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
                    <Typography variant='h6' component="p">{recipe.strMeal}</Typography>
                    <Typography variant='body2' color='textSecondary'>
                      {recipe.strCategory} {recipe.strArea ? `- ${recipe.strArea}` : ""}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/recipe/${recipe.idMeal}`}
                      variant='outlined'
                      color='primary'
                      fullWidth
                      sx={{ mt: 1 }}>
                      View Recipe
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

            <Grid item xs={12} md={8}>
              {recipeDetails ? (
                <>
                  <Typography variant='h4' component="h2" sx={{ mb: 2 }}>
                    {recipeDetails.strMeal}
                  </Typography>
                  <Typography variant='h6' component="h3">
                    Ingredients
                  </Typography>
                  <ul>
                    {Array.from({ length: 20 }, (_, i) => {
                      const ingredientKey = `strIngredient${i + 1}` as keyof typeof recipeDetails;
                      const measureKey = `strMeasure${i + 1}` as keyof typeof recipeDetails;
                      const ingredient = recipeDetails[ingredientKey];
                      const measure = recipeDetails[measureKey];

                      return ingredient ? (
                        <li key={i}>
                          {ingredient} - {measure || ""}
                        </li>
                      ) : null;
                    })}
                  </ul>
                  <Typography variant='h6' component="h3" sx={{ mt: 3 }}>
                    Instructions
                  </Typography>
                  <Typography variant='body1'>{recipeDetails.strInstructions}</Typography>
                </>
              ) : (
                <Typography variant='body1' sx={{ textAlign: "center", color: "gray", mt: 8 }}>
                  Select a recipe to view details
                </Typography>
              )}
            </Grid>
          </Grid>

          {totalIngredients.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant='h4' component='h2' sx={{ textAlign: "center", mb: 3 }}>
                Shopping List
              </Typography>
              <Grid container spacing={0} sx={{ maxWidth: 700, mx: "auto" }}>
                {totalIngredients.map(({ name, summary }) => (
                  <Grid item xs={12} sm={6} key={name}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75, px: 1, borderBottom: "1px solid", borderColor: "divider" }}>
                      <Typography variant="body1">{name}</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ ml: 2, flexShrink: 0 }}>{summary}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default MyRecipesPage;
