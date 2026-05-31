import { Card, CardContent, Typography, Button, Box } from "@mui/material";
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
    <Card
      sx={{
        width: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
        },
      }}>
      {/* Image with gradient overlay */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Box
          component="img"
          src={meal.strMealThumb}
          alt={meal.strMeal}
          sx={{
            width: "100%",
            height: { xs: 140, sm: 190 },
            objectFit: "cover",
            display: "block",
            transition: "transform 0.35s",
            ".MuiCard-root:hover &": { transform: "scale(1.06)" },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: { xs: 1, sm: 1.5 },
          }}>
          <Typography
            component="p"
            sx={{
              color: "white",
              fontSize: { xs: "0.76rem", sm: "0.92rem" },
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 0.25,
            }}>
            {meal.strMeal}
          </Typography>
          <Typography
            component="p"
            sx={{ color: "rgba(255,255,255,0.72)", fontSize: { xs: "0.62rem", sm: "0.72rem" } }}>
            {meal.strCategory}
            {meal.strArea ? ` · ${meal.strArea}` : ""}
          </Typography>
        </Box>
      </Box>

      <CardContent
        sx={{ p: { xs: 1, sm: 1.5 }, "&:last-child": { pb: { xs: 1, sm: 1.5 } } }}>
        <Button
          component={Link}
          to={`/recipe/${meal.idMeal}`}
          variant="contained"
          color="primary"
          fullWidth
          size="small"
          sx={{ mb: 0.5 }}>
          View Recipe
        </Button>

        {isAdded ? (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            size="small"
            onClick={() => removeRecipe(meal.idMeal)}>
            Remove
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            size="small"
            onClick={() => addRecipe(meal)}>
            + My Recipes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
