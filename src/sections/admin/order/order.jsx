import { useCallback, useState } from "react";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TablePagination from "@mui/material/TablePagination";

import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AddRounded, FileDownloadRounded, FilterAltRounded } from "@mui/icons-material";
import { useGetApi } from "../../../hooks/useGetApi";
import {
  DEFAULT_LIMIT,
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
import {
  exportOrder,
  getOrders,
  getOrderStatusCounts,
} from "../../../services/admin/orders.service";
import { getClients } from "../../../services/admin/clients.service";
import { useLocation } from "react-router-dom";

// ----------------------------------------------------------------------

export default function Order() {
  const theme = useTheme();
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

  const { dataList: statusCounts } = useGetApi({
    apiFunction: getOrderStatusCounts,
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

  const toTitleCase = (value = "") =>
    value
      .toString()
      .replaceAll("_", " ")
      .split(" ")
      .map((word) =>
        word ? `${word[0].toUpperCase()}${word.slice(1)}` : ""
      )
      .join(" ");

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
      <Card
        sx={{
          p: 2,
          width: "100%",
          borderRadius: 2,
          boxShadow: `0 10px 28px ${alpha(theme.palette.common.black, 0.06)}`,
          border: `1px solid ${alpha(theme.palette.grey[400], 0.25)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Orders
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Track, filter, and manage all order activity in one place.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleModalOpen}
              startIcon={<AddRounded />}
              sx={{ textTransform: "none" }}
            >
              Add Order
            </Button>
            <Button
              color="success"
              variant="contained"
              startIcon={<FileDownloadRounded />}
              sx={{ textTransform: "none" }}
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Status Overview
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: "primary.dark",
              overflow: "auto",
              maxWidth: "calc(100% - 200px)",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {(statusCounts || []).map((item, index) => {
              const itemType = item?.type || "";
              const isTotal = itemType.toLowerCase() === "total";
              const isSelected = isTotal
                ? !filter?.status
                : filter?.status === itemType;
              return (
                <Box
                  key={`${itemType}-${index}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1.5,
                    cursor: "pointer",
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, 0.18)
                      : "transparent",
                    border: `1px solid ${
                      isSelected
                        ? alpha(theme.palette.primary.main, 0.3)
                        : "transparent"
                    }`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.16),
                    },
                  }}
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "status",
                        value: isTotal
                          ? null
                          : itemType === filter?.status
                          ? null
                          : itemType,
                      },
                    })
                  }
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {item?.count ?? 0}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: isSelected ? 700 : 500,
                      textTransform: "capitalize",
                    }}
                  >
                    {toTitleCase(itemType)}
                  </Typography>
                </Box>
              );
            })}
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
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.grey[100], 0.7),
            border: `1px solid ${alpha(theme.palette.grey[400], 0.2)}`,
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "text.secondary",
                pr: 0.5,
              }}
            >
              <FilterAltRounded fontSize="small" />
              <Typography variant="subtitle2">Filters</Typography>
            </Box>
            {/* Search  */}
            <TextField
              value={search || ""}
              onChange={handleSearch}
              placeholder="Search by SO No, Order No"
              size="small"
              sx={{ width: "240px" }}
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
                  sx: { width: "180px" },
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
                  sx: { width: "180px" },
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

              {notFound && (
                <Box
                  sx={{
                    width: "100%",
                    py: 4,
                    textAlign: "center",
                    color: "text.secondary",
                    borderRadius: 2,
                    border: `1px dashed ${alpha(
                      theme.palette.grey[400],
                      0.4
                    )}`,
                    bgcolor: alpha(theme.palette.grey[100], 0.6),
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    No orders match the current filters.
                  </Typography>
                  <Typography variant="body2">
                    Try adjusting your search or clearing filters to see more results.
                  </Typography>
                </Box>
              )}
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
