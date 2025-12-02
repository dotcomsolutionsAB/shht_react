import PropTypes from "prop-types";
import {
  Delete,
  Edit,
  Launch,
  MoreVert,
  Visibility,
} from "@mui/icons-material";
import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog";
import PreviewModal from "./modals/preview-modal";
import AddNewOrderModal from "./modals/add-new-order-modal";
import { deleteOrder } from "../../../services/admin/orders.service";
import dayjs from "dayjs";

const OrderTableRow = ({
  row,
  refetch,
  page,
  rowsPerPage,
  dataCount,
  setPage,
}) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

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

  const handlePreviewModalOpen = () => {
    setPreviewModalOpen(true);
    handleMenuClose();
  };

  const handlePreviewModalClose = useCallback(() => {
    setPreviewModalOpen(false);
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
    const response = await deleteOrder(row);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Order deleted successfully!");
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
          {row?.client?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.so_no || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.so_date ? dayjs(row?.so_date).format("DD-MM-YYYY") : "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.order_no || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.order_date ? dayjs(row?.order_date).format("DD-MM-YYYY") : "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.checked_by?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.status || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.invoice?.invoice_number || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.invoice?.invoice_date
            ? dayjs(row?.invoice?.invoice_date).format("DD-MM-YYYY")
            : "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>
          {row?.dispatched_by?.name || "-"}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize", textAlign: "center" }}>
          {row?.drive_link ? (
            <Launch
              sx={{
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
              onClick={() =>
                window.open(row.drive_link, "_blank", "noopener,noreferrer")
              }
            />
          ) : (
            "-"
          )}
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
        <MenuItem onClick={handlePreviewModalOpen}>
          <Visibility fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Preview
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
        title="Are you sure you want to delete this order?"
      />

      {/* View Orders*/}
      <PreviewModal
        open={previewModalOpen}
        onClose={handlePreviewModalClose}
        detail={row}
      />

      {/* Edit Order*/}
      <AddNewOrderModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        refetch={refetch}
        detail={row}
      />
    </>
  );
};

OrderTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  dataCount: PropTypes.number,
  setPage: PropTypes.func,
};

export default memo(OrderTableRow);
