import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
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
import { Add, CancelOutlined } from "@mui/icons-material";
import {
  createOrder,
  getSoNo,
  updateOrder,
} from "../../../../services/admin/orders.service";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { useGetApi } from "../../../../hooks/useGetApi";
import { getContactPersons } from "../../../../services/admin/clients.service";
import { ORDER_STATUS_LIST } from "../../../../utils/constants";
import ViewContactsModal from "../../clients/modals/view-contacts-modal";

const getInitialState = () => ({
  client: null,
  client_contact_person: null,
  mobile: "",
  email: "",
  company: "SHHT",
  so_no: "",
  so_date: dayjs(),
  checked_by: null,
  order_no: "",
  order_date: null,
  // status: "pending",
  // dispatched_by: null,
  // initiated_by: null,
});

const AddNewOrderModal = ({
  open,
  onClose,
  refetch,
  detail,
  clientList,
  checkedByList,
  initiatedByList,
}) => {
  const { logout } = useAuth();

  const initialState = getInitialState();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [changeViewContactsModalOpen, setChangeViewContactsModal] =
    useState(false);

  // api to get contact person list
  const {
    dataList: contactPersonList,
    dataCount: contactPersonsCount,
    isLoading: isContactPersonsLoading,
    isError: isContactPersonsError,
    refetch: refetchContactPersons,
    errorMessage: errorContactPersonsMessage,
  } = useGetApi({
    apiFunction: getContactPersons,
    body: {
      offset: 0,
      limit: 100,
      client: selectedClientId || "",
    },
    skip: !selectedClientId,
    dependencies: [selectedClientId],
  });

  // api to get so no
  const {
    dataList: soNo,
    isLoading: isSoNoLoading,
    isError: isSoNoError,
    refetch: refetchSoNo,
    errorMessage: errorSoNoMessage,
  } = useGetApi({
    apiFunction: getSoNo,
    body: {
      company: formData?.company || "",
    },
    skip: !open || detail?.id || !formData?.company,
    dependencies: [open, formData?.company],
  });

  const handleAddViewContactModalOpen = () => {
    setChangeViewContactsModal(true);
  };

  const handleAddViewContactModalClose = useCallback(() => {
    setChangeViewContactsModal(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "date" && value ? dayjs(value).format("YYYY-MM-DD") : value;
    if (name === "client") {
      setSelectedClientId(value?.id);
      setFormData((preValue) => ({
        ...preValue,
        client_contact_person: null,
      }));
    }
    if (name === "client_contact_person") {
      setFormData((preValue) => ({
        ...preValue,
        mobile: value?.mobile,
        email: value?.email,
      }));
    }
    if (name === "company" && !value) {
      setFormData((preValue) => ({
        ...preValue,
        so_no: null,
      }));
    }
    setFormData((preValue) => ({ ...preValue, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);

    const payload = {
      ...formData,
      client: formData?.client?.id || "",
      client_contact_person: formData?.client_contact_person?.id || "",
      checked_by: formData?.checked_by?.id || "",
      // dispatched_by: formData?.dispatched_by?.id || "",
      // initiated_by: formData?.initiated_by?.id || "",
      order_date: formData?.order_date
        ? dayjs(formData?.order_date).format("YYYY-MM-DD")
        : null,
      so_date: formData?.so_date
        ? dayjs(formData?.so_date).format("YYYY-MM-DD")
        : null,
    };

    if (detail?.id) {
      response = await updateOrder(payload);
    } else {
      response = await createOrder(payload);
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
    if (!detail?.id)
      setFormData((preValue) => ({ ...preValue, so_no: soNo?.so_no || "" }));
  }, [soNo]);

  useEffect(() => {
    if (detail?.id) {
      setFormData({
        id: detail?.id,
        client: detail?.client || null,
        client_contact_person: detail?.client_contact_person || null,
        mobile: detail?.mobile || "",
        email: detail?.email || "",
        company: detail?.company || "SHHT",
        so_no: detail?.so_no || "",
        so_date: detail?.so_date ? dayjs(detail?.so_date) : dayjs(),
        checked_by: detail?.checked_by || null,
        order_no: detail?.order_no || "",
        order_date: detail?.order_date ? dayjs(detail?.order_date) : null,
        // status: detail?.status || "",
        // dispatched_by: detail?.dispatched_by || null,
        // initiated_by: detail?.initiated_by || null,
      });
      setSelectedClientId(detail?.client?.id);
    } else {
      setFormData(getInitialState());
      setSelectedClientId(null);
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
                    label="Select Client"
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
              <Box
                sx={{ display: "flex", alignItems: "center", height: "100%" }}
              >
                <Autocomplete
                  options={contactPersonList || []}
                  getOptionLabel={(option) => option.name || ""}
                  value={formData?.client_contact_person || null}
                  onChange={(_, newValue) =>
                    handleChange({
                      target: {
                        name: "client_contact_person",
                        value: newValue,
                      },
                    })
                  }
                  loading={isContactPersonsLoading}
                  disabled={!selectedClientId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Contact"
                      name="client_contact_person"
                      required
                      disabled={!selectedClientId}
                      error={isContactPersonsError}
                      helperText={errorContactPersonsMessage || ""}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                    />
                  )}
                  sx={{
                    flex: 1,
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    minWidth: 0,
                    px: 0.2,
                    height: "100%",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                  disabled={!selectedClientId}
                  onClick={handleAddViewContactModalOpen}
                >
                  <Add />
                </Button>
              </Box>
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
                disabled={detail?.id}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="SO Number"
                name="so_no"
                fullWidth
                required
                value={isSoNoLoading ? "Loading..." : formData?.so_no || ""}
                error={isSoNoError}
                helperText={errorSoNoMessage || ""}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DatePicker
                label="SO Date"
                slotProps={{
                  textField: { required: true, fullWidth: true },
                }}
                disableFuture
                value={formData?.so_date ? dayjs(formData?.so_date) : null}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={checkedByList || []}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Checked By"
                    required
                    fullWidth
                  />
                )}
                value={formData?.checked_by || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "checked_by", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Order Number"
                name="order_no"
                fullWidth
                required
                value={formData?.order_no || ""}
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
            {/* <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={ORDER_STATUS_LIST || []}
                renderInput={(params) => (
                  <TextField {...params} label="Status" />
                )}
                value={formData?.status || null}
                onChange={(_, newValue) =>
                  handleChange({ target: { name: "status", value: newValue } })
                }
              />
            </Grid> */}
            {/* <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={checkedByList || []}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Dispatched By" />
                )}
                value={formData?.dispatched_by || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "dispatched_by", value: newValue },
                  })
                }
              />
            </Grid> */}
            {/* <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={initiatedByList || []}
                getOptionLabel={(option) => option?.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Initiated By" />
                )}
                value={formData?.initiated_by || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "initiated_by", value: newValue },
                  })
                }
              />
            </Grid> */}
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
        {/* View Contacts*/}
        <ViewContactsModal
          open={changeViewContactsModalOpen}
          onClose={handleAddViewContactModalClose}
          client_id={selectedClientId}
          rmList={checkedByList}
          contactPersonList={contactPersonList}
          contactPersonsCount={contactPersonsCount}
          isContactPersonsLoading={isContactPersonsLoading}
          isContactPersonsError={isContactPersonsError}
          refetchContactPersons={refetchContactPersons}
          errorContactPersonsMessage={errorContactPersonsMessage}
        />
      </DialogContent>
    </Dialog>
  );
};

AddNewOrderModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  clientList: PropTypes.array,
  checkedByList: PropTypes.array,
  dispatchedByList: PropTypes.array,
  initiatedByList: PropTypes.array,
};

export default memo(AddNewOrderModal);
