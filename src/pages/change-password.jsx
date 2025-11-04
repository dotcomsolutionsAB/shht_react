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
import { useEffect, useRef, useState } from "react";
import { changePassword } from "../services/admin/users.service";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import ChangePasswordSchema from "../joi/change-password-schema";

const ChangePassword = () => {
  const { logout } = useAuth();
  const newPasswordRef = useRef(null);
  const newPasswordConfirmationRef = useRef(null);

  const initialState = {
    new_password: "",
    new_password_confirmation: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] =
    useState(false);

  const handleShowNewPassword = () => {
    setShowNewPassword((preValue) => !preValue);
  };
  const handleShowNewPasswordConfirmation = () => {
    setShowNewPasswordConfirmation((preValue) => !preValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
    if (name === "new_password" && e.key === "Enter") {
      newPasswordConfirmationRef.current.focus();
    }
    if (name === "new_password_confirmation" && e.key === "Enter") {
      handleChangePassword();
    }
  };

  // validation from joi
  const { error } = ChangePasswordSchema.validate(formData);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (error) {
      error?.details?.forEach((err) => {
        toast.error(err.message);
      });
    } else {
      setIsLoading(true);
      const response = await changePassword(formData);
      setIsLoading(false);

      if (response?.code === 200) {
        setFormData(initialState);
        toast.success(response?.message || `Password changed successfully`);
      } else if (response?.code === 401) {
        logout(response);
      } else {
        toast.error(response?.message || "Some error occurred.");
      }
    }
  };

  useEffect(() => {
    if (newPasswordRef.current) {
      newPasswordRef.current.focus();
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100% - 40px)",
      }}
    >
      <Card
        elevation={10}
        sx={{
          width: "350px",
          zIndex: 2,
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            Change Password
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
            onSubmit={handleChangePassword}
          >
            <TextField
              label="New Password"
              name="new_password"
              type={`${showNewPassword ? "text" : "password"}`}
              required
              inputRef={newPasswordRef}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {showNewPassword ? (
                        <VisibilityOffRounded
                          onClick={handleShowNewPassword}
                          cursor="pointer"
                          fontSize="24px"
                        />
                      ) : (
                        <VisibilityRounded
                          onClick={handleShowNewPassword}
                          cursor="pointer"
                          fontSize="24px"
                        />
                      )}
                    </InputAdornment>
                  ),
                },
              }}
              value={formData?.new_password || ""}
              onChange={handleChange}
            />
            <TextField
              label="New Password Confirmation"
              name="new_password_confirmation"
              type={`${showNewPasswordConfirmation ? "text" : "password"}`}
              required
              inputRef={newPasswordConfirmationRef}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {showNewPasswordConfirmation ? (
                        <VisibilityOffRounded
                          onClick={handleShowNewPasswordConfirmation}
                          cursor="pointer"
                          fontSize="24px"
                        />
                      ) : (
                        <VisibilityRounded
                          onClick={handleShowNewPasswordConfirmation}
                          cursor="pointer"
                          fontSize="24px"
                        />
                      )}
                    </InputAdornment>
                  ),
                },
              }}
              value={formData?.new_password_confirmation || ""}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? (
                <CircularProgress size={27} color="inherit" />
              ) : (
                "Change Password"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;
