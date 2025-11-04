import { Box, Button, Container, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import Error_Image_Svg from "../assets/images/404_Image.svg";
import Error_Image_Webp from "../assets/images/404_Image.webp";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate("/", { replace: true });
  };
  return (
    <>
      <Helmet>
        <title>404 | SHHT</title>
      </Helmet>
      <Container
        sx={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" sx={{ mb: 2 }}>
            Sorry, page not found!
          </Typography>

          <Typography sx={{ color: "text.secondary" }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: 320,
              height: 300,
              my: { xs: 5, sm: 10 },
            }}
          >
            <Box
              component="img"
              src={Error_Image_Svg}
              alt="Error Svg Pic"
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />
            <Box
              component="img"
              src={Error_Image_Webp}
              alt="Error WebP Pic"
              sx={{
                width: "auto",
                height: "70%",
                position: "absolute",
                top: 40,
                right: 70,
                zIndex: 0,
              }}
            />
          </Box>

          <Button
            size="large"
            variant="contained"
            color="inherit"
            onClick={handleGoToHome}
          >
            Go to home
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Page404;
