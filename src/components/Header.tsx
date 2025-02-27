import { AppBar, Toolbar, Typography, IconButton, Container, Badge } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { Link } from "react-router-dom";
import { useMyRecipesStore } from "../store/store";

const Header = () => {
  const { myRecipes } = useMyRecipesStore();

  return (
    <AppBar>
      <Container>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant='h6'
            component={Link}
            to='/'
            sx={{ textDecoration: "none", color: "inherit" }}>
            Recipes
          </Typography>

          <IconButton component={Link} to='/my-recipes' color='inherit'>
            <Badge badgeContent={myRecipes.length} color='secondary'>
              <RestaurantIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
