import PropTypes from "prop-types";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog";
import { deleteContactPerson } from "../../../../services/admin/clients.service";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // open action menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
  }, []);

  return (
    <>
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
        <MenuItem>
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
