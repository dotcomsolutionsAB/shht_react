import {
  Box,
  Grid,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import { memo, useCallback, useState } from "react";

import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { Delete, Edit, CheckCircle, Cancel } from "@mui/icons-material";
import {
  deleteCounter,
  updateCounter,
} from "../../../services/admin/counter.service";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog";

const CounterRow = ({ counter, refetch }) => {
  const { logout } = useAuth();

  const initialState = {
    id: counter?.id || null,
    prefix: counter?.prefix || "",
    number: counter?.number || "",
    postfix: counter?.postfix || "",
  };

  const [formData, setFormData] = useState(initialState);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmationModalClose = useCallback(() => {
    setConfirmationModalOpen(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditOpen(false);
    setFormData(initialState);
  };

  const handleSaveEdit = useCallback(async () => {
    if (!formData.prefix || !formData.number || !formData.postfix) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsEditLoading(true);
    const response = await updateCounter(formData);
    setIsEditLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Counter updated successfully!");
      setIsEditOpen(false);
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  }, [formData]);

  const handleDelete = useCallback(async () => {
    setIsDeleteLoading(true);
    const response = await deleteCounter(counter);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Counter deleted successfully!");
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  }, []);
  return (
    <Grid item xs={12}>
      <Grid container columnSpacing={2} rowSpacing={1} alignItems="center">
        <Grid item xs={6} lg={3.5}>
          <TextField
            label="Prefix"
            name="prefix"
            value={formData.prefix || ""}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            disabled={!isEditOpen}
          />
        </Grid>
        <Grid item xs={6} lg={3}>
          <TextField
            label="Number"
            name="number"
            value={formData.number || ""}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            disabled={!isEditOpen}
          />
        </Grid>
        <Grid item xs={6} lg={3.5}>
          <TextField
            label="Postfix"
            name="postfix"
            value={formData.postfix || ""}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            disabled={!isEditOpen}
          />
        </Grid>
        <Grid item xs={6} lg={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            {isEditOpen ? (
              <>
                <IconButton
                  color="error"
                  onClick={handleCancelEdit}
                  disabled={isEditLoading}
                >
                  <Cancel />
                </IconButton>
                {isEditLoading ? (
                  <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <IconButton
                    color="success"
                    onClick={handleSaveEdit}
                    disabled={isEditLoading}
                  >
                    <CheckCircle />
                  </IconButton>
                )}
              </>
            ) : (
              <>
                <IconButton color="primary" onClick={handleEditClick}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={handleConfirmationModalOpen}>
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Delete Counter Confirmation Modal*/}
      <ConfirmationDialog
        open={confirmationModalOpen}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        title="Are you sure you want to delete this counter?"
      />
    </Grid>
  );
};

CounterRow.propTypes = {
  counter: PropTypes.object,
  refetch: PropTypes.func,
};

export default memo(CounterRow);
