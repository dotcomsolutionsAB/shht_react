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
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import { CancelOutlined } from "@mui/icons-material";
import {
  createSubCategory,
  updateSubCategory,
} from "../../../../services/admin/sub-category.service";

const AddNewSubCategoryModal = ({
  open,
  onClose,
  refetch,
  detail,
  categoriesList = [],
}) => {
  const { logout } = useAuth();

  const initialState = {
    category: null,
    name: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.category) {
      toast.error("Category is required.");
      return;
    }
    if (formData?.name?.trim() === "") {
      toast.error("Sub Category name is required.");
      return;
    }

    const payload = { ...formData, category: formData?.category?.id || "" };

    let response;
    setIsLoading(true);
    if (detail?.id) {
      response = await updateSubCategory(payload);
    } else {
      response = await createSubCategory(payload);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `Sub Category ${detail?.id ? "updated" : "added"} successfully`
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
      });
    } else {
      setFormData(initialState);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null}>
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
        {detail?.id ? "Edit Sub Category" : `Add New Sub Category`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={categoriesList || []}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Category" required />
                )}
                value={formData?.category || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "category", value: newValue },
                  })
                }
              />
              {/* <TextField
                label="Category Id"
                name="category"
                fullWidth
                required
                value={formData?.category || ""}
                onChange={handleChange}
              /> */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sub Category Name"
                name="name"
                fullWidth
                required
                value={formData?.name || ""}
                onChange={handleChange}
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

AddNewSubCategoryModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  categoriesList: PropTypes.array,
};

export default memo(AddNewSubCategoryModal);
