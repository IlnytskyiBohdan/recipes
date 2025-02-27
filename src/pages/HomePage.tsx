import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRecipesByCategory,
  fetchAllRecipes,
  fetchCategories,
  searchRecipes,
} from "../api/recipes";
import { debounce } from "lodash";
import {
  Container,
  Grid,
  TextField,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";
import RecipeCard from "../components/RecipeCard";

const ITEMS_PER_PAGE = 12;

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);

  const { data: categories = [], isSuccess } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && categories.length > 0) {
      setCategory("Beef");
    }
  }, [isSuccess, categories]);

  const { data: recipes = [], isFetching } = useQuery({
    queryKey: ["recipes", category],
    queryFn: () =>
      category === "All Recipes" ? fetchAllRecipes() : fetchRecipesByCategory(category),
    staleTime: Infinity,
    enabled: !!category,
  });

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim()) {
        const result = await searchRecipes(query);
        setFilteredRecipes(result);
      } else {
        setFilteredRecipes([]);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const displayedRecipes = searchTerm
    ? filteredRecipes
    : recipes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <Container sx={{ mt: 12, mb: 6 }}>
      <Typography variant='h4' sx={{ mb: 3, textAlign: "center" }}>
        All Recipes
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label='Search recipes...'
            variant='outlined'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            fullWidth
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            disabled={categories.length === 0}>
            <MenuItem value='All Recipes'>All Recipes</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {isFetching && <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />}

      <Grid container spacing={3}>
        {displayedRecipes.map((meal) => (
          <Grid item key={meal.idMeal} xs={12} sm={6} md={4}>
            <RecipeCard meal={meal} />
          </Grid>
        ))}
      </Grid>

      {!searchTerm && recipes.length > ITEMS_PER_PAGE && (
        <Pagination
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
          count={Math.ceil(recipes.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      )}
    </Container>
  );
};

export default HomePage;
