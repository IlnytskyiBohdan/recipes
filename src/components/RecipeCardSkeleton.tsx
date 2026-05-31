import { Card, CardContent, Skeleton } from "@mui/material";

const RecipeCardSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" height={180} />
    <CardContent>
      <Skeleton variant="text" width="80%" height={28} />
      <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
      <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1, mb: 1 }} />
      <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
    </CardContent>
  </Card>
);

export default RecipeCardSkeleton;
