import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import MyRecipesPage from "./pages/MyRecipesPage";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/recipe/:id", element: <RecipePage /> },
      { path: "/my-recipes", element: <MyRecipesPage /> },
    ],
  },
]);
