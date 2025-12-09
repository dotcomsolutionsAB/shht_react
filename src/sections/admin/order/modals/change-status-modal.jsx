import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import { useGetApi } from "../../../../hooks/useGetApi";
import { getUsers } from "../../../../services/admin/users.service";
import {
  getOrderStatus,
  updateOrderStatus,
} from "../../../../services/admin/orders.service";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import { DatePicker } from "@mui/x-date-pickers";

const ChangeStatusModal = ({ open, onClose, detail, refetch }) => {
  const { logout } = useAuth();
  const initialState = {
    order_id: detail?.order_no,
    status: "",
    optional_fields: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // api to get order status
  const { dataList: orderStatus, isLoading } = useGetApi({
    apiFunction: getOrderStatus,
    body: { id: detail?.id },
    skip: !open,
    dependencies: [open],
  });

  // api to get dispatched by list
  const { dataList: dispatchedByList } = useGetApi({
    apiFunction: getUsers,
    body: { role: "staff" },
    skip: !open || formData?.status !== "dispatched",
    dependencies: [open, formData?.status],
  });

  const handleChange = (e, key) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "date" && value ? dayjs(value).format("YYYY-MM-DD") : value;
    if (key === "optional_fields") {
      setFormData((preValue) => ({
        ...preValue,
        optional_fields: { ...preValue?.optional_fields, [name]: parsedValue },
      }));
    } else setFormData((preValue) => ({ ...preValue, [name]: parsedValue }));
  };

  const handleChangeStatusSubmit = async (e) => {
    e.preventDefault();

    let payload = formData;

    if (formData?.status === "dispatched") {
      payload = {
        ...formData,
        optional_fields: {
          dispatched_by: formData?.optional_fields?.dispatched_by?.id || "",
        },
      };
    }
    if (formData?.status === "invoiced") {
      payload = {
        ...formData,
        optional_fields: {
          invoice_number: formData?.optional_fields?.invoice_number || "",
          invoice_date: formData?.optional_fields?.invoice_date
            ? dayjs(formData?.optional_fields?.invoice_date).format(
                "YYYY-MM-DD"
              )
            : null,
        },
      };
    }

    setLoading(true);
    const response = await updateOrderStatus(payload);
    setLoading(false);
    if (response?.code === 200) {
      onClose();
      toast.success(response?.message || "Order status updated successfully!");
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    setFormData((preValue) => ({
      ...preValue,
      status: orderStatus?.current_status,
    }));
  }, [orderStatus]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box
        id="change-status-dialog-title"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <Typography variant="h5">Change Status</Typography>
        <CancelOutlined
          sx={{
            cursor: "pointer",
          }}
          onClick={onClose}
        />
      </Box>

      <DialogContent>
        <Box
          component="form"
          id="changeStatusForm"
          onSubmit={handleChangeStatusSubmit}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6">
                Order No : {detail?.order_no || ""}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={orderStatus?.allowed_status || []}
                renderInput={(params) => (
                  <TextField {...params} label="Status" required fullWidth />
                )}
                value={formData?.status || null}
                onChange={(_, newValue) =>
                  handleChange({ target: { name: "status", value: newValue } })
                }
                loading={isLoading}
              />
            </Grid>
            {formData?.status === "dispatched" && (
              <Grid item xs={6}>
                <Autocomplete
                  options={dispatchedByList || []}
                  getOptionLabel={(option) => option?.name || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Dispatched By"
                      required
                      fullWidth
                    />
                  )}
                  value={formData?.optional_fields?.dispatched_by || null}
                  onChange={(_, newValue) =>
                    handleChange(
                      {
                        target: { name: "dispatched_by", value: newValue },
                      },
                      "optional_fields"
                    )
                  }
                  loading={isLoading}
                />
              </Grid>
            )}
            {formData?.status === "invoiced" && (
              <>
                <Grid item xs={6}>
                  <TextField
                    label="Invoice Number"
                    name="invoice_number"
                    value={formData?.optional_fields?.invoice_number || ""}
                    onChange={(e) => handleChange(e, "optional_fields")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="Invoice Date"
                    name="invoice_date"
                    value={
                      formData?.optional_fields?.invoice_date
                        ? dayjs(formData?.optional_fields?.invoice_date)
                        : null
                    }
                    onChange={(newValue) =>
                      handleChange(
                        {
                          target: {
                            name: "invoice_date",
                            value: newValue,
                            type: "date",
                          },
                        },
                        "optional_fields"
                      )
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          size="large"
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          form="changeStatusForm"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ChangeStatusModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  detail: PropTypes.object,
  refetch: PropTypes.func,
};

export default memo(ChangeStatusModal);
