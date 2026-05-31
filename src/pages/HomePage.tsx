import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchRecipesByCategory,
  fetchAllRecipes,
  fetchCategories,
  searchRecipes,
  Recipe,
} from "../api/recipes";
import { debounce } from "lodash";
import {
  Container,
  Box,
  TextField,
  MenuItem,
  Select,
  Typography,
  Pagination,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RecipeCard from "../components/RecipeCard";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

const ITEMS_PER_PAGE = 12;

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

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
    <>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(150deg, #E65100 0%, #BF360C 55%, #7B1A00 100%)",
          color: "white",
          pt: { xs: "72px", sm: "88px" },
          pb: { xs: 5, md: 7 },
        }}>
        <Container maxWidth="md">
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3.2rem" },
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.2,
              mb: 1.5,
            }}>
            Discover Your Next<br />Favourite Recipe
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              mb: 4,
              opacity: 0.85,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}>
            Search thousands of dishes from around the world
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, flexDirection: { xs: "column", sm: "row" } }}>
            <TextField
              fullWidth
              placeholder="Search recipes..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              inputProps={{ "aria-label": "Select recipe category" }}
              disabled={categories.length === 0}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                minWidth: { sm: 190 },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              }}>
              <MenuItem value="All Recipes">All Recipes</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Container>
      </Box>

      {/* Cards section */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
          {searchTerm
            ? `Results for "${searchTerm}"`
            : category === "All Recipes"
            ? "All Recipes"
            : `${category} Recipes`}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: { xs: 1, sm: 2, md: 3 },
          }}>
          {isFetching
            ? Array.from({ length: 12 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : displayedRecipes.map((meal) => <RecipeCard key={meal.idMeal} meal={meal} />)}
        </Box>

        {!isFetching && searchTerm && filteredRecipes.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 6, color: "text.secondary" }}>
            Nothing found for "{searchTerm}"
          </Typography>
        )}

        {!searchTerm && recipes.length > ITEMS_PER_PAGE && (
          <Pagination
            sx={{ mt: 4, display: "flex", justifyContent: "center" }}
            count={Math.ceil(recipes.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        )}
      </Container>
    </>
  );
};

export default HomePage;
