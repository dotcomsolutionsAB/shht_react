import { Box, Card, CardContent, Grid } from "@mui/material";
import Category from "../sections/admin/settings/category";
import SubCategory from "../sections/admin/settings/sub-category";
import Tag from "../sections/admin/settings/tag";
import Counter from "../sections/admin/settings/counter";

const Settings = () => {
  const cardHeight = "560px";
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: cardHeight }}>
            <CardContent>
              <Category />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: cardHeight }}>
            <CardContent>
              <SubCategory />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: cardHeight }}>
            <CardContent>
              <Tag />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: cardHeight }}>
            <CardContent>
              <Counter />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
