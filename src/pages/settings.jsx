import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import Category from "../sections/admin/settings/category";
import SubCategory from "../sections/admin/settings/sub-category";
import Tag from "../sections/admin/settings/tag";
import Counter from "../sections/admin/settings/counter";

const Settings = () => {
  const theme = useTheme();
  const cardHeight = "560px";
  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.grey[400], 0.25)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.06),
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Settings
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Manage categories, tags, and counters used across the platform.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              height: cardHeight,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[400], 0.2)}`,
              boxShadow: `0 10px 24px ${alpha(
                theme.palette.common.black,
                0.06
              )}`,
            }}
          >
            <CardContent sx={{ height: "100%", p: 2.5 }}>
              <Category />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              height: cardHeight,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[400], 0.2)}`,
              boxShadow: `0 10px 24px ${alpha(
                theme.palette.common.black,
                0.06
              )}`,
            }}
          >
            <CardContent sx={{ height: "100%", p: 2.5 }}>
              <SubCategory />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              height: cardHeight,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[400], 0.2)}`,
              boxShadow: `0 10px 24px ${alpha(
                theme.palette.common.black,
                0.06
              )}`,
            }}
          >
            <CardContent sx={{ height: "100%", p: 2.5 }}>
              <Tag />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              height: cardHeight,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[400], 0.2)}`,
              boxShadow: `0 10px 24px ${alpha(
                theme.palette.common.black,
                0.06
              )}`,
            }}
          >
            <CardContent sx={{ height: "100%", p: 2.5 }}>
              <Counter />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
