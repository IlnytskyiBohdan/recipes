import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useMyRecipesStore } from "../store/store";

interface RecipeCardProps {
  meal: {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea?: string;
  };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ meal }) => {
  const { myRecipes, addRecipe, removeRecipe } = useMyRecipesStore();
  const isAdded = myRecipes.some((r) => r.idMeal === meal.idMeal);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia component='img' height='140' image={meal.strMealThumb} alt={meal.strMeal} />
      <CardContent>
        <Typography variant='h6'>{meal.strMeal}</Typography>
        <Typography variant='body2' color='textSecondary'>
          {meal.strCategory} {meal.strArea ? `- ${meal.strArea}` : ""}
        </Typography>

        <Button
          component={Link}
          to={`/recipe/${meal.idMeal}`}
          variant='contained'
          color='primary'
          fullWidth
          sx={{ mt: 1 }}>
          View Recipe
        </Button>

        {isAdded ? (
          <Button
            variant='outlined'
            color='error'
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => removeRecipe(meal.idMeal)}>
            Remove from My Recipes
          </Button>
        ) : (
          <Button
            variant='contained'
            color='secondary'
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => addRecipe(meal)}>
            Add to My Recipes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
