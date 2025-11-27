import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import { Cancel, CancelOutlined } from "@mui/icons-material";
import {
  createClient,
  updateClient,
} from "../../../../services/admin/clients.service";
import { STATES_LIST } from "../../../../utils/constants";

const getInitialState = () => ({
  name: "",
  category: null,
  sub_category: null,
  tags: [],
  city: "",
  state: "",
  pincode: "",
  contact_person: [
    {
      id: Date.now(),
      name: "",
      mobile: "",
      email: "",
      rm: null,
    },
  ],
});

const AddNewClientModal = ({
  open,
  onClose,
  refetch,
  detail,
  categoryList = [],
  subCategoryList = [],
  tagsList = [],
  rmList = [],
}) => {
  const { logout } = useAuth();

  const initialState = getInitialState();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e, field = null, index = null) => {
    const { name, value } = e.target;

    if (field === "contact_person" && index !== null) {
      const updatedContactPersons = formData.contact_person.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      );
      setFormData((preValue) => ({
        ...preValue,
        contact_person: updatedContactPersons,
      }));
    } else {
      setFormData((preValue) => ({ ...preValue, [name]: value }));
    }
  };

  const handleAddNewRow = () => {
    setFormData((preValue) => ({
      ...preValue,
      contact_person: [
        ...preValue.contact_person,
        { id: Date.now(), name: "", mobile: "", email: "", rm: null },
      ],
    }));
  };

  const deleteRow = (item) => {
    const updatedContactPersons = formData.contact_person?.filter(
      (person) => person?.id !== item?.id
    );
    setFormData((preValue) => ({
      ...preValue,
      contact_person: updatedContactPersons,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);

    let submitData = {
      ...formData,
      category: formData?.category?.id,
      sub_category: formData?.sub_category?.id,
      tags: formData?.tags?.map((tag) => tag.id).join(","),
    };
    if (detail?.id) {
      // When editing, exclude contact_person from the request
      submitData = Object.keys(submitData).reduce((acc, key) => {
        if (key !== "contact_person") {
          acc[key] = submitData[key];
        }
        return acc;
      }, {});
    }

    if (detail?.id) {
      response = await updateClient(submitData);
    } else {
      response = await createClient({
        ...submitData,
        contact_person: formData?.contact_person?.map((person) => ({
          name: person?.name,
          mobile: person?.mobile,
          email: person?.email,
          rm: person?.rm?.id,
        })),
      });
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `Client ${detail?.id ? "updated" : "added"} successfully`
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
        name: detail?.name || "",
        category: detail?.category || null,
        sub_category: detail?.sub_category || null,
        tags: detail?.tags || [],
        city: detail?.city || "",
        state: detail?.state || "",
        pincode: detail?.pincode || "",
      });
    } else {
      setFormData(getInitialState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : null}
      slotProps={{
        paper: {
          sx: {
            minWidth: { xs: "95vw", sm: "550px", md: "800px", lg: "1100px" },
            position: "relative",
          },
        },
      }}
    >
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
        {detail?.id ? "Edit Client" : `Add Client`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={categoryList || []}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    name="category"
                    required
                  />
                )}
                value={formData?.category || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "category", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={subCategoryList || []}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub-Category"
                    name="sub_category"
                    required
                  />
                )}
                value={formData?.sub_category || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "sub_category", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                limitTags={1}
                options={tagsList || []}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                renderInput={(params) => <TextField {...params} label="Tags" />}
                renderTags={(value) => [
                  value[0] && (
                    <Chip
                      key={0}
                      label={
                        <>
                          {value[0]?.name}
                          {value.length > 1 && (
                            <span
                              style={{ fontWeight: "bold", marginLeft: "5px" }}
                            >
                              {" "}
                              +{value.length - 1}
                            </span>
                          )}
                        </>
                      }
                    />
                  ),
                ]}
                renderOption={(props, option, { selected }) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      bgcolor: selected ? "custom.body_color" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: "primary.main",
                        fontWeight: "bold",
                        minWidth: "20px",
                      }}
                    >
                      {selected ? "✓" : ""}
                    </Box>
                    <span>{option?.name}</span>
                  </Box>
                )}
                value={formData?.tags || []}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "tags", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="City/Town"
                name="city"
                fullWidth
                required
                value={formData?.city || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={STATES_LIST || []}
                renderInput={(params) => (
                  <TextField {...params} label="State" name="state" required />
                )}
                value={formData?.state || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "state", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Pincode"
                name="pincode"
                fullWidth
                required
                value={formData?.pincode || ""}
                onChange={handleChange}
              />
            </Grid>
            {!detail?.id && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h5">Contact Person</Typography>
                    <Button variant="contained" onClick={handleAddNewRow}>
                      + Add New Row
                    </Button>
                  </Box>
                </Grid>

                {formData?.contact_person?.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={6} md={3}>
                        <TextField
                          label="Name"
                          name="name"
                          fullWidth
                          required
                          value={item?.name || ""}
                          onChange={(e) =>
                            handleChange(e, "contact_person", index)
                          }
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Autocomplete
                          options={rmList || []}
                          getOptionLabel={(option) => option?.name || ""}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="RM"
                              name="rm"
                              required
                            />
                          )}
                          value={item?.rm || null}
                          onChange={(_, newValue) =>
                            handleChange(
                              {
                                target: {
                                  name: "rm",
                                  value: newValue,
                                },
                              },
                              "contact_person",
                              index
                            )
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        md={formData?.contact_person?.length > 1 ? 2.5 : 3}
                      >
                        <TextField
                          label="Email"
                          name="email"
                          fullWidth
                          required
                          value={item?.email || ""}
                          onChange={(e) =>
                            handleChange(e, "contact_person", index)
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={formData?.contact_person?.length > 1 ? 2.5 : 3}
                      >
                        <TextField
                          label="Mobile"
                          name="mobile"
                          fullWidth
                          required
                          value={item?.mobile || ""}
                          onChange={(e) =>
                            handleChange(e, "contact_person", index)
                          }
                        />
                      </Grid>

                      {formData?.contact_person?.length > 1 ? (
                        <Grid item xs={12} md={1} sx={{ textAlign: "right" }}>
                          <IconButton
                            color="error"
                            onClick={() => deleteRow(item)}
                          >
                            <Cancel />
                          </IconButton>
                        </Grid>
                      ) : null}
                    </Grid>
                  </Grid>
                ))}
              </>
            )}
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
  categoryList: PropTypes.array,
  subCategoryList: PropTypes.array,
  tagsList: PropTypes.array,
  rmList: PropTypes.array,
};

export default memo(AddNewClientModal);
