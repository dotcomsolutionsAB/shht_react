import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import useAuth from "../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import LoginSchema from "../joi/login-schema";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import Login_Background from "../assets/images/Login_Background.jpg";
import SHHT_Logo from "../assets/logos/SHHT_Logo.png";

const loginCardWidth = "clamp(400px, 40vw, 100%)";

const Login = () => {
  const { login, isLoading } = useAuth();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
    if (name === "username" && e.key === "Enter") {
      passwordRef.current.focus();
    }
    if (name === "password" && e.key === "Enter") {
      handleLogin();
    }
  };

  const handleShowPassword = () => {
    setShowPassword((preValue) => !preValue);
  };

  // validation from joi
  const { error } = LoginSchema.validate(formData);

  const handleLogin = (e) => {
    e.preventDefault();
    if (error) {
      error?.details?.forEach((err) => {
        toast.error(err.message);
      });
    } else {
      login(formData);
    }
  };

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  return (
    <Box
      sx={{
        height: "100svh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Helmet>
        <title>Login | SHHT</title>
      </Helmet>

      {/* Background and Card */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Background */}
        <Box
          component="img"
          src={Login_Background}
          sx={{
            height: "100%",
            width: { xs: "100%", sm: "90%", md: "80%" },
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -2,
          }}
        ></Box>

        <Box
          sx={{
            width: "70%",
            height: "100%",
            bgcolor: "primary.main",
            position: "absolute",
            right: 0,
            top: 0,
            transform: `skew(-15deg) translateX(calc(100% * ${Math.tan(
              (15 * Math.PI) / 180
            )}))`,
            transformOrigin: "left",
            zIndex: -1,
            display: { xs: "none", sm: "block" },
          }}
        ></Box>

        {/* Left Side */}
        <Box
          sx={{
            width: { xs: "100%", sm: `calc(100% - ${loginCardWidth})` },
            height: { xs: "40%", sm: "100%" },
            display: "flex",
            alignItems: { xs: "end", sm: "center" },
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={SHHT_Logo}
            sx={{
              height: { xs: "150px", sm: "300px", md: "400px" },
              width: { xs: "300px", sm: "300px", md: "400px" },
              objectFit: "contain",
            }}
          ></Box>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            width: { xs: "100%", sm: loginCardWidth },
            height: { xs: "60%", sm: "100%" },
            display: "flex",
            alignItems: { sm: "center" },
            justifyContent: "center",
          }}
        >
          <Card
            elevation={10}
            sx={{
              maxWidth: "90vw",
              maxHeight: "330px",
              width: "300px",
              zIndex: 2,
            }}
          >
            <CardContent
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  color: "primary.main",
                  textDecoration: "underline",
                }}
              >
                Login
              </Typography>
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", mt: 3 }}
                onSubmit={handleLogin}
              >
                <TextField
                  label="Username"
                  name="username"
                  type="text"
                  required
                  inputRef={usernameRef}
                  value={formData?.username || ""}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  label="Password"
                  name="password"
                  type={`${showPassword ? "text" : "password"}`}
                  required
                  inputRef={passwordRef}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {showPassword ? (
                            <VisibilityOffRounded
                              onClick={handleShowPassword}
                              cursor="pointer"
                              fontSize="24px"
                            />
                          ) : (
                            <VisibilityRounded
                              onClick={handleShowPassword}
                              cursor="pointer"
                              fontSize="24px"
                            />
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                  value={formData?.password || ""}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3 }}
                >
                  {isLoading ? (
                    <CircularProgress size={27} color="inherit" />
                  ) : (
                    "SIGN IN"
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
