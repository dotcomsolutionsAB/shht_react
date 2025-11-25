import PropTypes from "prop-types";
import { Delete, Edit, Key, MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog";
import { deleteUser } from "../../../services/admin/users.service";
import AddNewUserModal from "./modals/add-new-user-modal";
import ChangePasswordModal from "./modals/change-password-modal";

const UsersTableRow = ({
  row,
  refetch,
  page,
  rowsPerPage,
  dataCount,
  setPage,
  userTypeList,
}) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  // open action menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleEditModalClose = useCallback(() => {
    setEditModalOpen(false);
  }, []);

  const handleChangePasswordModalOpen = () => {
    setChangePasswordModalOpen(true);
    handleMenuClose();
  };

  const handleChangePasswordModalClose = useCallback(() => {
    setChangePasswordModalOpen(false);
  }, []);

  const handleConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
    handleMenuClose();
  };

  const handleConfirmationModalClose = useCallback(() => {
    setConfirmationModalOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    setIsDeleteLoading(true);
    const response = await deleteUser(row);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "User deleted successfully!");
      refetch();

      // Handle pagination navigation if current page becomes empty
      const newDataCount = dataCount - 1;
      const maxPage = Math.max(0, Math.ceil(newDataCount / rowsPerPage) - 1);
      if (page > maxPage) {
        setPage(maxPage);
      }
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} key={row?.id} role="checkbox">
        <TableCell>{row?.name || "-"}</TableCell>
        <TableCell>{row?.username || "-"}</TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.role || "-"}
        </TableCell>
        <TableCell>{row?.mobile || "-"}</TableCell>
        <TableCell>{row?.email || "-"}</TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.order_views || "-"}
        </TableCell>

        <TableCell>{row?.change_status === "1" ? "Yes" : "No"}</TableCell>
        <TableCell>{row?.whatsapp_status === "1" ? "Yes" : "No"}</TableCell>
        <TableCell>{row?.email_status === "1" ? "Yes" : "No"}</TableCell>

        <TableCell align="center">
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
        <MenuItem onClick={handleEditModalOpen}>
          <Edit fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleChangePasswordModalOpen}>
          <Key fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Change Password
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
        title="Are you sure you want to delete this user?"
      />

      {/* Change Password*/}
      <ChangePasswordModal
        open={changePasswordModalOpen}
        onClose={handleChangePasswordModalClose}
        user_id={row?.id}
      />

      {/* Edit User*/}
      <AddNewUserModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        refetch={refetch}
        detail={row}
        userTypeList={userTypeList || []}
      />
    </>
  );
};

UsersTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  dataCount: PropTypes.number,
  setPage: PropTypes.func,
  userTypeList: PropTypes.array,
};

export default memo(UsersTableRow);
