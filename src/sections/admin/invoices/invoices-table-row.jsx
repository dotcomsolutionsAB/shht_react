import PropTypes from "prop-types";
import { Delete, MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog";
import { deleteInvoice } from "../../../services/admin/invoice.service";
import dayjs from "dayjs";

const InvoicesTableRow = ({
  row,
  refetch,
  page,
  rowsPerPage,
  dataCount,
  setPage,
}) => {
  const { logout } = useAuth();
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
    const response = await deleteInvoice(row);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Invoice deleted successfully!");
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
          {row?.order?.client?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.order?.order_no || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.order?.so_no || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.invoice_number || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.invoice_date
            ? dayjs(row?.invoice_date).format("DD-MM-YYYY")
            : "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.billed_by?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.order?.dispatched_by?.name || "-"}
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
        title="Are you sure you want to delete this invoice?"
      />
    </>
  );
};

InvoicesTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  dataCount: PropTypes.number,
  setPage: PropTypes.func,
};

export default memo(InvoicesTableRow);
