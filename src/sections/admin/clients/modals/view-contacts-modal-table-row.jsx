import PropTypes from "prop-types";
import {
  Delete,
  Edit,
  MoreVert,
  Cancel,
  CheckCircle,
} from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  TextField,
  Autocomplete,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog";
import {
  deleteContactPerson,
  updateContactPerson,
} from "../../../../services/admin/clients.service";
import useAuth from "../../../../hooks/useAuth";

const ViewContactsModalTableRow = ({ row, refetch, rmList, client_id }) => {
  const { logout } = useAuth();

  const initialState = {
    client: client_id,
    name: row?.name || "",
    mobile: row?.mobile || "",
    email: row?.email || "",
    rm: row?.rm || null,
  };

  const [formData, setFormData] = useState(initialState);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // open action menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditOpen(true);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setIsEditOpen(false);
    setFormData(initialState);
  };

  const handleEditChange = (e, field = null, value = null) => {
    if (field) {
      // For Autocomplete (rm field)
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      // For TextField
      const { name, value: val } = e.target;
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.mobile || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const response = await updateContactPerson({
      id: row?.id,
      client: client_id,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      rm_id: formData.rm?.id,
    });
    setIsSubmitting(false);

    if (response?.code === 200) {
      toast.success(
        response?.message || "Contact person updated successfully!"
      );
      handleCancelEdit();
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmationModalClose = useCallback(() => {
    setConfirmationModalOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    setIsDeleteLoading(true);
    const response = await deleteContactPerson(row);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(
        response?.message || "Contact Person deleted successfully!"
      );
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  }, [row, refetch, logout, handleConfirmationModalClose]);

  return (
    <>
      {isEditOpen ? (
        <TableRow>
          <TableCell sx={{ padding: "8px" }}>
            <TextField
              size="small"
              fullWidth
              required
              name="name"
              value={formData.name}
              onChange={handleEditChange}
            />
          </TableCell>
          <TableCell sx={{ padding: "8px" }}>
            <TextField
              type="tel"
              size="small"
              fullWidth
              required
              name="mobile"
              value={formData.mobile}
              onChange={handleEditChange}
            />
          </TableCell>
          <TableCell sx={{ padding: "8px" }}>
            <TextField
              type="email"
              size="small"
              fullWidth
              required
              name="email"
              value={formData.email}
              onChange={handleEditChange}
            />
          </TableCell>
          <TableCell sx={{ padding: "8px" }}>
            <Autocomplete
              size="small"
              options={rmList || []}
              getOptionLabel={(option) => option?.name || ""}
              value={formData.rm || null}
              onChange={(_, value) => handleEditChange(null, "rm", value)}
              renderInput={(params) => <TextField {...params} required />}
            />
          </TableCell>
          <TableCell
            align="center"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <IconButton
              size="small"
              color="error"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
            >
              <Cancel />
            </IconButton>
            <IconButton
              size="small"
              color="success"
              onClick={handleSaveEdit}
              disabled={isSubmitting}
            >
              <CheckCircle />
            </IconButton>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow hover tabIndex={-1} key={row?.id} role="checkbox">
          <TableCell sx={{ textTransform: "capitalize" }}>
            {row?.name || "-"}
          </TableCell>
          <TableCell sx={{ textTransform: "capitalize" }}>
            {row?.mobile || "-"}
          </TableCell>
          <TableCell sx={{ textTransform: "capitalize" }}>
            {row?.email || "-"}
          </TableCell>
          <TableCell sx={{ textTransform: "capitalize" }}>
            {row?.rm?.name || "-"}
          </TableCell>
          <TableCell sx={{ textTransform: "capitalize" }} align="center">
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </TableCell>
        </TableRow>
      )}

      {/* Row-Specific Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <Edit fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleConfirmationModalOpen}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete User*/}
      <ConfirmationDialog
        open={confirmationModalOpen}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        title="Are you sure you want to delete this contact person?"
      />
    </>
  );
};

ViewContactsModalTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  rmList: PropTypes.array.isRequired,
  client_id: PropTypes.number.isRequired,
};

export default memo(ViewContactsModalTableRow);
