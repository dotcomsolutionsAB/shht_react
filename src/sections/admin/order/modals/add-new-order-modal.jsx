import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import {
  Autocomplete,
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
import {
  createOrder,
  updateOrder,
} from "../../../../services/admin/orders.service";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

const getInitialState = () => ({
  company: "",
  client: null,
  client_contact_person: null,
  email: "",
  mobile: "",
  so_date: null,
  order_no: "",
  order_date: null,
  invoice: null,
  status: "",
  initiated_by: null,
  checked_by: null,
  dispatched_by: null,
  drive_link: "",
});

const AddNewClientModal = ({ open, onClose, refetch, detail, clientList }) => {
  const { logout } = useAuth();

  const initialState = getInitialState();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "date" && value ? dayjs(value).format("YYYY-MM-DD") : value;
    setFormData((preValue) => ({ ...preValue, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);

    if (detail?.id) {
      response = await updateOrder(formData);
    } else {
      response = await createOrder(formData);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `Order ${detail?.id ? "updated" : "added"} successfully`
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
        id: detail?.id,
        company: detail?.company || "",
        client: detail?.client || null,
        client_contact_person: detail?.client_contact_person || null,
        email: detail?.email || "",
        mobile: detail?.mobile || "",
        so_date: detail?.so_date ? dayjs(detail?.so_date) : null,
        order_no: detail?.order_no || "",
        order_date: detail?.order_date ? dayjs(detail?.order_date) : null,
        invoice: detail?.invoice || null,
        status: detail?.status || "",
        initiated_by: detail?.initiated_by || null,
        checked_by: detail?.checked_by || null,
        dispatched_by: detail?.dispatched_by || null,
        drive_link: detail?.drive_link || "",
      });
    } else {
      setFormData(getInitialState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={!isLoading ? onClose : null} maxWidth="lg">
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
        {detail?.id ? "Edit Order" : `Add Order`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={clientList || []}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Client"
                    name="client"
                    required
                  />
                )}
                value={formData?.client || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "client", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                type="tel"
                label="Mobile"
                name="mobile"
                fullWidth
                required
                value={formData?.mobile || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                type="email"
                label="Email"
                name="email"
                fullWidth
                required
                value={formData?.email || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={["SHHT", "SHAPL"]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Company Name"
                    name="company"
                    required
                  />
                )}
                value={formData?.company || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "company", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="SO Number - Auto"
                name="so_number"
                fullWidth
                required
                value={formData?.so_number || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DatePicker
                label="SO Date - Auto"
                slotProps={{
                  textField: { required: true, fullWidth: true },
                }}
                disableFuture
                value={formData?.so_date ? dayjs(formData?.so_date) : null}
                onChange={(newDate) =>
                  handleChange({
                    target: { name: "so_date", value: newDate, type: "date" },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Order Number"
                name="order_number"
                fullWidth
                required
                value={formData?.order_number || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DatePicker
                label="Order Date"
                slotProps={{
                  textField: { required: true, fullWidth: true },
                }}
                disableFuture
                value={
                  formData?.order_date ? dayjs(formData?.order_date) : null
                }
                onChange={(newDate) =>
                  handleChange({
                    target: {
                      name: "order_date",
                      value: newDate,
                      type: "date",
                    },
                  })
                }
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

AddNewClientModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  clientList: PropTypes.array,
};

export default memo(AddNewClientModal);
