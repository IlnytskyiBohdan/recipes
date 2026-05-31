import { useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, Container, Badge, Box, Tooltip } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useMyRecipesStore } from "../store/store";
import { ColorModeContext } from "../context/ColorModeContext";

const Header = () => {
  const { myRecipes } = useMyRecipesStore();
  const { toggleColorMode } = useContext(ColorModeContext);
  const theme = useTheme();

  return (
    <AppBar>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", fontWeight: 700, letterSpacing: 0.5 }}>
            Recipes
          </Typography>

          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Tooltip title={theme.palette.mode === "dark" ? "Light mode" : "Dark mode"}>
              <IconButton color="inherit" onClick={toggleColorMode} size="small">
                {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
            <IconButton component={Link} to="/my-recipes" color="inherit" aria-label="My Recipes">
              <Badge badgeContent={myRecipes.length} color="secondary">
                <RestaurantIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
