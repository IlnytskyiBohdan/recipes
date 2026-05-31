import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#1a1a1a", color: "rgba(255,255,255,0.6)", mt: "auto", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "white" }}>
            Recipes
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <MuiLink component={Link} to="/" color="inherit" underline="hover" variant="body2">Home</MuiLink>
            <MuiLink component={Link} to="/my-recipes" color="inherit" underline="hover" variant="body2">My Recipes</MuiLink>
          </Box>
          <Typography variant="body2">
            © {new Date().getFullYear()} IlnytskyiBohdan
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
