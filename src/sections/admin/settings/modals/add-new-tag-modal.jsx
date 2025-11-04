import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import {
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
import { createTag, updateTag } from "../../../../services/admin/tags.service";

const AddNewTagModal = ({ open, onClose, refetch, detail }) => {
  const { logout } = useAuth();

  const initialState = {
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
    if (formData?.name?.trim() === "") {
      toast.error("Tag name is required.");
      return;
    }
    let response;
    setIsLoading(true);
    if (detail?.id) {
      response = await updateTag(formData);
    } else {
      response = await createTag(formData);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `Tag ${detail?.id ? "updated" : "added"} successfully`
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
        {detail?.id ? "Edit Tag" : `Add New Tag`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Tag Name"
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

AddNewTagModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
};

export default memo(AddNewTagModal);
