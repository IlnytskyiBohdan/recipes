import { create } from "zustand";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea?: string;
  strInstructions?: string;
  [key: string]: any; 
}


interface MyRecipesStore {
  myRecipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (idMeal: string) => void;
}


const STORAGE_KEY = "myRecipes";

export const useMyRecipesStore = create<MyRecipesStore>((set) => {

  const storedRecipes = localStorage.getItem(STORAGE_KEY);
  const initialState = storedRecipes ? JSON.parse(storedRecipes) : [];

  return {
    myRecipes: initialState,

    addRecipe: (recipe) =>
      set((state) => {
        if (state.myRecipes.some((r) => r.idMeal === recipe.idMeal)) return state; 
        const updatedRecipes = [...state.myRecipes, recipe];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
        return { myRecipes: updatedRecipes };
      }),

    removeRecipe: (idMeal) =>
      set((state) => {
        const updatedRecipes = state.myRecipes.filter((r) => r.idMeal !== idMeal);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
        return { myRecipes: updatedRecipes };
      }),
  };
});