import { useCallback, useState } from "react";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";

import {
  Autocomplete,
  Box,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useGetApi } from "../../../hooks/useGetApi";
import {
  DEFAULT_LIMIT,
  ORDER_STATUS_LIST,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../utils/constants";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";
import { Helmet } from "react-helmet-async";
import OrderTableRow from "./order-table-row";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getUsers } from "../../../services/admin/users.service";
import AddNewOrderModal from "./modals/add-new-order-modal";
import { exportOrder, getOrders } from "../../../services/admin/orders.service";
import { getClients } from "../../../services/admin/clients.service";
import { useLocation } from "react-router-dom";

// ----------------------------------------------------------------------

export default function Order() {
  const { logout } = useAuth();
  const { state } = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [isExportLoading, setIsExportLoading] = useState(false);

  const [filter, setFilter] = useState({
    client: null,
    status: state?.status || null,
    checked_by: null,
    dispatched_by: null,
    date_from: null,
    date_to: null,
  });

  const dataSendingToBackend = {
    search,
    client: filter?.client?.id || null,
    status: filter?.status || null,
    checked_by: filter?.checked_by?.id || null,
    dispatched_by: filter?.dispatched_by?.id || null,
    date_from: filter?.date_from || null,
    date_to: filter?.date_to || null,
  };

  // api to get orders list
  const {
    dataCount: ordersCount,
    dataList: ordersList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getOrders,
    body: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      ...dataSendingToBackend,
    },
    dependencies: [
      page,
      rowsPerPage,
      search,
      filter?.client,
      filter?.status,
      filter?.checked_by,
      filter?.dispatched_by,
      filter?.date_from,
      filter?.date_to,
    ],
    debounceDelay: 500,
  });

  // api to get client list
  const { dataList: clientList } = useGetApi({
    apiFunction: getClients,
  });

  // api to get checked by list
  const { dataList: checkedByList } = useGetApi({
    apiFunction: getUsers,
    body: { role: "staff" },
  });

  // api to get initiated by list
  const { dataList: initiatedByList } = useGetApi({
    apiFunction: getUsers,
    body: { role: "sales" },
  });

  // api to get dispatched by list
  const { dataList: dispatchedByList } = useGetApi({
    apiFunction: getUsers,
    body: { role: "dispatch" },
  });

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFilter((preValue) => ({
      ...preValue,
      [name]:
        type === "date"
          ? value
            ? dayjs(value).format("YYYY-MM-DD")
            : null
          : value,
    }));
  };

  const handleExport = async () => {
    setIsExportLoading(true);
    const response = await exportOrder(dataSendingToBackend);
    setIsExportLoading(false);

    if (response?.code === 200) {
      const link = document.createElement("a");
      link.href = response?.data?.file_url || "";
      link.target = "_blank"; // Open in a new tab
      link.rel = "noopener noreferrer"; // Add security attributes

      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link after triggering the download
      document.body.removeChild(link);

      toast.success(response?.message || "File downloaded successfully!");
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleSearch = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  // change to next or prev page
  const handleChangePage = (_, newPage) => {
    if (!isLoading) setPage(newPage);
  };

  // change rows per page
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // if no search result is found
  const notFound = !ordersCount;

  return (
    <>
      <Helmet>
        <title>Orders | SHHT</title>
      </Helmet>
      <Card sx={{ p: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            width: "100%",
            mb: 2,
          }}
        >
          <Typography variant="h6">Statistics</Typography>
          {/* Status Bar  */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              borderRadius: "10px",
              bgcolor: "primary.light",
              color: "primary.dark",
              overflow: "auto",
              maxWidth: "calc(100% - 200px)",
              border: `1px solid`,
              borderColor: "primary.main",
            }}
          >
            {ORDER_STATUS_LIST?.map((item, index) => (
              <Box
                key={item + index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  height: "80px",
                }}
              >
                {index !== 0 && (
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      bgcolor: "primary.main",
                      width: "1px",
                      height: "100%",
                    }}
                  />
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    px: 0.5,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "status",
                        value: item === filter?.status ? null : item,
                      },
                    })
                  }
                >
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    0
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight:
                        filter?.status === item
                          ? "fontWeightBold"
                          : "fontWeightRegular",
                      textTransform: "capitalize",
                    }}
                  >
                    {item?.replaceAll("_", " ")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* Search  */}
            <TextField
              value={search || ""}
              onChange={handleSearch}
              placeholder="Search by SO No, Order No"
              size="small"
              sx={{ width: "250px" }}
            />

            <Autocomplete
              options={clientList || []}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Client" size="small" />
              )}
              value={filter?.client || null}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "client", value: newValue } })
              }
              sx={{ minWidth: "200px" }}
            />
            {/* <Autocomplete
              options={ORDER_STATUS_LIST || []}
              renderInput={(params) => (
                <TextField {...params} label="Status" size="small" />
              )}
              value={filter?.status || null}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "status", value: newValue } })
              }
              sx={{ minWidth: "200px" }}
            /> */}
            <Autocomplete
              options={checkedByList || []}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Checked By" size="small" />
              )}
              value={filter?.checked_by || null}
              onChange={(_, newValue) =>
                handleChange({
                  target: { name: "checked_by", value: newValue },
                })
              }
              sx={{ minWidth: "200px" }}
            />
            <Autocomplete
              options={dispatchedByList || []}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Dispatched By" size="small" />
              )}
              value={filter?.dispatched_by || null}
              onChange={(_, newValue) =>
                handleChange({
                  target: { name: "dispatched_by", value: newValue },
                })
              }
              sx={{ minWidth: "200px" }}
            />

            <DatePicker
              label="Date From"
              slotProps={{
                textField: {
                  size: "small",
                  sx: { width: "200px" },
                },
              }}
              disableFuture
              value={filter?.date_from ? dayjs(filter?.date_from) : null}
              onChange={(newDate) =>
                handleChange({
                  target: { name: "date_from", value: newDate, type: "date" },
                })
              }
            />

            <DatePicker
              label="Date To"
              slotProps={{
                textField: {
                  size: "small",
                  sx: { width: "200px" },
                },
              }}
              disableFuture
              value={filter?.date_to ? dayjs(filter?.date_to) : null}
              onChange={(newDate) =>
                handleChange({
                  target: { name: "date_to", value: newDate, type: "date" },
                })
              }
            />
          </Box>

          <Box sx={{ ml: "auto" }}>
            {/* Add Order*/}
            <Button variant="contained" onClick={handleModalOpen}>
              + Add Order
            </Button>
            {/* Excel Export */}
            <Button
              color="success"
              variant="contained"
              sx={{ ml: 2 }}
              onClick={handleExport}
              disabled={isExportLoading}
            >
              {isExportLoading ? "Exporting..." : "Excel Export"}
            </Button>
          </Box>
          {/* Modal */}
          <AddNewOrderModal
            open={modalOpen}
            onClose={handleModalClose}
            refetch={refetch}
            clientList={clientList}
            checkedByList={checkedByList}
            initiatedByList={initiatedByList}
          />
        </Box>

        {/* Table */}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <>
            <Grid container spacing={2}>
              {ordersList?.map((row) => (
                <Grid item xs={12} lg={6} key={row?.id}>
                  <OrderTableRow
                    key={row?.id}
                    refetch={refetch}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    dataCount={ordersCount}
                    setPage={setPage}
                    row={row}
                    clientList={clientList}
                    checkedByList={checkedByList}
                    initiatedByList={initiatedByList}
                  />
                </Grid>
              ))}

              {notFound && <Box>No Data Found</Box>}
            </Grid>
          </>
        )}

        {/* Pagination */}

        <TablePagination
          page={page}
          component="div"
          count={ordersCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
