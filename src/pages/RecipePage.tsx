import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Container, Typography, Card, CardMedia, CardContent, Button, Grid, CircularProgress, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchRecipeById } from "../api/recipes";
import { useMyRecipesStore } from "../store/store";

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { myRecipes, addRecipe, removeRecipe } = useMyRecipesStore();
  const isAdded = myRecipes.some((r) => r.idMeal === id);

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
    staleTime: Infinity,
  });

  if (isLoading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 16 }} />;
  if (isError || !recipe) return <Typography sx={{ textAlign: "center", mt: 12 }}>Рецепт не найден</Typography>;

  return (
    <Container sx={{ mt: 12, mb: 6 }}>
      <Box sx={{ mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
      <Typography variant="h4" component="h1" sx={{ textAlign: "center", mb: 3 }}>
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
              <Typography variant="body1" component="p"><strong>Category:</strong> {recipe.strCategory}</Typography>
              <Typography variant="body1" component="p"><strong>Origin:</strong> {recipe.strArea}</Typography>
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


      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 1 }}>
        Instructions
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.8 }}>{recipe.strInstructions}</Typography>

      {recipe.strYoutube && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Video Recipe
          </Typography>
          <Box
            component="iframe"
            src={`https://www.youtube.com/embed/${new URL(recipe.strYoutube).searchParams.get("v")}`}
            title={`${recipe.strMeal} video recipe`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sx={{
              width: "100%",
              height: { xs: 240, sm: 400, md: 480 },
              border: 0,
              borderRadius: 2,
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default RecipePage;