import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import {
  CancelOutlined,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import {
  createUser,
  updateUser,
} from "../../../../services/admin/users.service";
import { ROLE_LIST } from "../../../../utils/constants";

const AddNewUserModal = ({ open, onClose, refetch, detail }) => {
  const { logout } = useAuth();

  const initialState = {
    name: "",
    username: "",
    password: "",
    mobile: "",
    email: "",
    role: "",
    order_views: "self",
    change_status: "0",
    whatsapp_status: "0",
    email_status: "0",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((preValue) => !preValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);
    if (detail?.id) {
      delete formData?.password;
      delete formData?.role;
      response = await updateUser(formData);
    } else {
      response = await createUser(formData);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `User ${detail?.id ? "updated" : "added"} successfully`
      );
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    if (detail?.id) {
      setFormData({
        ...initialState,
        id: detail?.id,
        name: detail?.name || "",
        username: detail?.username || "",
        mobile: detail?.mobile || "",
        email: detail?.email || "",
        order_views: detail?.order_views || "",
        change_status: detail?.change_status || "",
        email_status: detail?.email_status || "",
        whatsapp_status: detail?.whatsapp_status || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : null}
      slotProps={{
        paper: {
          sx: {
            minWidth: { xs: "95vw", sm: "550px", md: "800px", lg: "1100px" },
            position: "relative",
          },
        },
      }}
    >
      <CancelOutlined
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "primary.contrastText",
          fontSize: "24px",
          cursor: "pointer",
        }}
        onClick={!isLoading ? onClose : null}
      />
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {detail?.id ? "Edit User" : `Add New User`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Username"
                name="username"
                fullWidth
                required
                value={formData?.username || ""}
                onChange={handleChange}
              />
            </Grid>
            {detail?.id ? null : (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  type={`${showPassword ? "text" : "password"}`}
                  label="Password"
                  name="password"
                  value={formData?.password || ""}
                  onChange={handleChange}
                  required={detail?.id ? false : true}
                  fullWidth
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
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Mobile"
                name="mobile"
                fullWidth
                value={formData?.mobile || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="email"
                label="Email"
                name="email"
                fullWidth
                required
                value={formData?.email || ""}
                onChange={handleChange}
              />
            </Grid>
            {detail?.id ? null : (
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  options={ROLE_LIST || []}
                  getOptionLabel={(option) =>
                    option.charAt(0).toUpperCase() + option.slice(1)
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Role" name="role" required />
                  )}
                  value={formData?.role || null}
                  onChange={(_, newValue) =>
                    handleChange({
                      target: { name: "role", value: newValue },
                    })
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={["global", "self"]}
                getOptionLabel={(option) =>
                  option.charAt(0).toUpperCase() + option.slice(1)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Order Views"
                    name="order_views"
                    required
                  />
                )}
                value={formData?.order_views || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "order_views", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={["1", "0"]}
                getOptionLabel={(option) => (option === "1" ? "Yes" : "No")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Change Status"
                    name="change_status"
                    required
                  />
                )}
                value={formData?.change_status || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "change_status", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={["1", "0"]}
                getOptionLabel={(option) => (option === "1" ? "Yes" : "No")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Whatsapp Status"
                    name="whatsapp_status"
                    required
                  />
                )}
                value={formData?.whatsapp_status || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "whatsapp_status", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={["1", "0"]}
                getOptionLabel={(option) => (option === "1" ? "Yes" : "No")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Email Status"
                    name="email_status"
                    required
                  />
                )}
                value={formData?.email_status || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "email_status", value: newValue },
                  })
                }
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
            }}
          >
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Close
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? (
                <CircularProgress size={24} />
              ) : detail?.id ? (
                "Update"
              ) : (
                `Save`
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AddNewUserModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
};

export default memo(AddNewUserModal);
