import PropTypes from "prop-types";
import { Delete, Edit, Key, MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog";
import AddNewClientModal from "./modals/add-new-client-modal";
import ViewContactsModal from "./modals/view-contacts-modal";
import { deleteClient } from "../../../services/admin/clients.service";

const ClientsTableRow = ({
  row,
  refetch,
  page,
  rowsPerPage,
  dataCount,
  setPage,
  categoryList,
  subCategoryList,
  tagsList,
  rmList,
  salesPersonList,
}) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [changeViewContactsModalOpen, setChangeViewContactsModal] =
    useState(false);

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

  const handleChangeViewContactsModalOpen = () => {
    setChangeViewContactsModal(true);
    handleMenuClose();
  };

  const handleChangeViewContactsModalClose = useCallback(() => {
    setChangeViewContactsModal(false);
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
    const response = await deleteClient(row);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Client deleted successfully!");
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
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.category?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.sub_category?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.tags?.map((item) => item?.name)?.join(", ")}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.city || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.state || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.rm?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.sales_person?.name || "-"}
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
        <MenuItem onClick={handleEditModalOpen}>
          <Edit fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleChangeViewContactsModalOpen}>
          <Key fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          View Contacts
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
        title="Are you sure you want to delete this client?"
      />

      {/* View Contacts*/}
      <ViewContactsModal
        open={changeViewContactsModalOpen}
        onClose={handleChangeViewContactsModalClose}
        client_id={row?.id}
      />

      {/* Edit Client*/}
      <AddNewClientModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        refetch={refetch}
        detail={row}
        categoryList={categoryList}
        subCategoryList={subCategoryList}
        tagsList={tagsList}
        rmList={rmList}
        salesPersonList={salesPersonList}
      />
    </>
  );
};

ClientsTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  dataCount: PropTypes.number,
  setPage: PropTypes.func,
  categoryList: PropTypes.array,
  subCategoryList: PropTypes.array,
  tagsList: PropTypes.array,
  rmList: PropTypes.array,
  salesPersonList: PropTypes.array,
};

export default memo(ClientsTableRow);
