import axios from "axios";

const API_URL = "https://themealdb.com/api/json/v1/1";

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  strTags?: string;
  strSource?: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

export interface Category {
  strCategory: string;
}

export const fetchCategories = async (): Promise<string[]> => {
  const res = await axios.get<{ meals: Category[] }>(`${API_URL}/list.php?c=list`);
  return res.data.meals.map((cat) => cat.strCategory);
};

export const fetchAllRecipes = async (): Promise<Recipe[]> => {
  const res = await axios.get<{ meals: Recipe[] }>(`${API_URL}/filter.php?i`);
  return res.data.meals;
};

export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  const res = await axios.get<{ meals: Recipe[] }>(`${API_URL}/search.php?s=${query}`);
  return res.data.meals || [];
};

export const fetchRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  const res = await axios.get<{ meals: Recipe[] }>(`${API_URL}/filter.php?c=${category}`);
  const recipes = res.data.meals || [];
  return recipes.map((meal) => ({ ...meal, strCategory: category }));
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const res = await axios.get<{ meals: Recipe[] | null }>(`${API_URL}/lookup.php?i=${id}`);
    return res.data.meals ? res.data.meals[0] : null;
  } catch (error) {
    console.error(`Error fetching recipe with id ${id}`, error);
    return null;
  }
};
