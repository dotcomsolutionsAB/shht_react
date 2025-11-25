import PropTypes from "prop-types";
import { memo, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import {
  CancelOutlined,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { changePassword } from "../../../../services/admin/users.service";
import ChangePasswordModalSchema from "../../../../joi/change-password-modal-schema";

const ViewContactsModal = ({ open, onClose, user_id }) => {
  const { logout } = useAuth();

  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);

  const initialState = {
    password: "",
    password_confirmation: "",
    user_id,
  };

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const handleShowPassword = () => {
    setShowPassword((preValue) => !preValue);
  };

  const handleShowPasswordConfirmation = () => {
    setShowPasswordConfirmation((preValue) => !preValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
    if (name === "password" && e.key === "Enter") {
      passwordConfirmationRef.current.focus();
    }
    if (name === "password_confirmation" && e.key === "Enter") {
      handleChangePassword();
    }
  };

  // validation from joi
  const { error } = ChangePasswordModalSchema.validate(formData);

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
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, []);
  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} maxWidth="sm">
      <Box
        id="change-password-dialog-title"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <Typography variant="h5">Change Password</Typography>
        <CancelOutlined
          sx={{
            cursor: "pointer",
          }}
          onClick={!isLoading ? onClose : null}
        />
      </Box>

      <DialogContent>
        <Box
          id="changePasswordForm"
          component="form"
          onSubmit={handleChangePassword}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="New Password"
                name="password"
                type={`${showPassword ? "text" : "password"}`}
                required
                fullWidth
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Re-enter New Password"
                name="password_confirmation"
                type={`${showPasswordConfirmation ? "text" : "password"}`}
                required
                fullWidth
                inputRef={passwordConfirmationRef}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {showPasswordConfirmation ? (
                          <VisibilityOffRounded
                            onClick={handleShowPasswordConfirmation}
                            cursor="pointer"
                            fontSize="24px"
                          />
                        ) : (
                          <VisibilityRounded
                            onClick={handleShowPasswordConfirmation}
                            cursor="pointer"
                            fontSize="24px"
                          />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
                value={formData?.password_confirmation || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          size="large"
          disabled={isLoading}
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          form="changePasswordForm"
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Update"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewContactsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user_id: PropTypes.number.isRequired,
};

export default memo(ViewContactsModal);
