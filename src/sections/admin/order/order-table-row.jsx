import PropTypes from "prop-types";
import {
  ChangeCircle,
  Delete,
  Edit,
  Launch,
  MoreVert,
  Visibility,
} from "@mui/icons-material";
import {
  Card,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import ConfirmationDialog from "../../../components/confirmation-dialog/confirmation-dialog";
import PreviewModal from "./modals/preview-modal";
import ChangeStatusModal from "./modals/change-status-modal";
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
  clientList,
  checkedByList,
  initiatedByList,
}) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);

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

  const handleChangeStatusModalOpen = () => {
    setChangeStatusModalOpen(true);
    handleMenuClose();
  };

  const handleChangeStatusModalClose = useCallback(() => {
    setChangeStatusModalOpen(false);
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
      <Card
        sx={{
          border: "2px solid",
          borderColor: "primary.main",
          height: { xs: "auto", lg: "350px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1,
            px: 1.5,
            borderBottom: "2px solid",
            borderColor: "primary.main",
            bgcolor: "primary.light",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography>{row?.client?.name || "-"}</Typography>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "text.secondary",
                textTransform: "capitalize",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: 12,
                fontWeight: 500,
                bgcolor: "grey.300",
              }}
            >
              {row?.status ? row.status.replaceAll("_", " ") : null}
            </Box>
          </Box>
          <IconButton aria-label="more" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </Box>
        <Grid
          container
          sx={{ py: 1, height: "calc(100% - 48px)", overflowY: "auto" }}
        >
          {/* first row */}
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Contact</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography>
                  {`${row?.client_contact_person?.name || "-"} (${
                    row?.client_contact_person?.mobile
                  })`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Initiated By</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography>{row?.initiated_by?.name || "-"}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* second row */}
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Order Id</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography>
                  {`${row?.so_no || "-"} (${row?.so_date})`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Checked By</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography>{row?.checked_by?.name || "-"}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* third row */}
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Order No</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography>
                  {`${row?.order_no || "-"} (${row?.order_date})`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Dispatched By</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography>
                  {`${row?.dispatched_by?.name || "-"} (${
                    row?.dispatched_date || "-"
                  })`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* fourth row */}
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Order Value</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography>{row?.order_value || "-"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Drive Link</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography>
                  {row?.drive_link ? (
                    <Launch
                      sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                      onClick={() =>
                        window.open(
                          row.drive_link,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    />
                  ) : (
                    "-"
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* fifth row */}
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12} sm={6} md={3} sx={{ py: 0.5, px: 1 }}>
                <Typography variant="subtitle1">Invoice No</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={9} sx={{ py: 0.5, px: 1 }}>
                <Typography>
                  {`${row?.invoice?.invoice_number || "-"} (${
                    row?.invoice?.invoice_date || "-"
                  })`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>

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
        {/* <MenuItem onClick={handlePreviewModalOpen}>
          <Visibility fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Preview
        </MenuItem> */}
        <MenuItem onClick={handleChangeStatusModalOpen}>
          <ChangeCircle fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Change Status
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

      {/* View Orders Modal*/}
      <PreviewModal
        open={previewModalOpen}
        onClose={handlePreviewModalClose}
        detail={row}
      />

      {/* Change Status Modal */}
      <ChangeStatusModal
        open={changeStatusModalOpen}
        onClose={handleChangeStatusModalClose}
        detail={row}
        refetch={refetch}
      />

      {/* Edit Order*/}
      <AddNewOrderModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        refetch={refetch}
        detail={row}
        clientList={clientList}
        checkedByList={checkedByList}
        initiatedByList={initiatedByList}
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
  clientList: PropTypes.array,
  checkedByList: PropTypes.array,
  initiatedByList: PropTypes.array,
};

export default memo(OrderTableRow);
