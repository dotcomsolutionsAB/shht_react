import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import TableNoData from "../../../components/table/table-no-data";
import TableEmptyRows from "../../../components/table/table-empty-rows";

import {
  Autocomplete,
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useGetApi } from "../../../hooks/useGetApi";
import {
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../utils/constants";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getUsers } from "../../../services/admin/users.service";
import {
  exportInvoice,
  getInvoices,
} from "../../../services/admin/invoice.service";
import InvoicesTableRow from "./invoices-table-row";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "client", label: "Client" },
  { id: "order_no", label: "Order No" },
  { id: "so_no", label: "SO Number" },
  { id: "invoice_number", label: "Invoice Number" },
  { id: "invoice_date", label: "Invoice Date" },
  { id: "billed_by", label: "Billed By" },
  { id: "dispatched_by", label: "Dispatched By" },
  { id: "action", label: "Action", align: "center" },
];

export default function Invoices() {
  const { logout } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [isExportLoading, setIsExportLoading] = useState(false);

  const [filter, setFilter] = useState({
    billed_by: null,
    dispatched_by: null,
    date_from: null,
    date_to: null,
  });

  const dataSendingToBackend = {
    search,
    billed_by: filter?.billed_by,
    dispatched_by: filter?.dispatched_by,
    date_from: filter?.date_from,
    date_to: filter?.date_to,
  };

  // api to get clients list
  const {
    dataCount: invoicesCount,
    dataList: invoicesList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getInvoices,
    body: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      ...dataSendingToBackend,
    },
    dependencies: [
      page,
      rowsPerPage,
      search,
      filter?.billed_by,
      filter?.dispatched_by,
      filter?.date_from,
      filter?.date_to,
    ],
    debounceDelay: 500,
  });

  // api to get billed by list
  const { dataList: billedByList } = useGetApi({
    apiFunction: getUsers,
    body: { role: "admin" },
  });

  // api to get dispatched by list
  const { dataList: dispatchedByList } = useGetApi({
    apiFunction: getUsers,
    body: { role: "staff" },
  });

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
    const response = await exportInvoice(dataSendingToBackend);
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
  const notFound = !invoicesCount;

  return (
    <>
      <Helmet>
        <title>Invoices | SHHT</title>
      </Helmet>
      <Card sx={{ p: 2, width: "100%" }}>
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
              placeholder="Search"
              size="small"
              sx={{ width: "200px" }}
            />

            <Autocomplete
              options={billedByList || []}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Billed By" size="small" />
              )}
              value={filter?.billed_by || null}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "billed_by", value: newValue } })
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
            {/* Excel Export */}
            <Button
              color="success"
              variant="contained"
              onClick={handleExport}
              disabled={isExportLoading}
            >
              {isExportLoading ? "Exporting..." : "Excel Export"}
            </Button>
          </Box>
        </Box>

        {/* Table */}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <TableContainer sx={{ overflowY: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {HEAD_LABEL?.map((headCell) => (
                    <TableCell
                      key={headCell?.id}
                      align={headCell?.align || "left"}
                      sx={{
                        width: headCell?.width,
                        minWidth: headCell?.minWidth,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TableSortLabel hideSortIcon>
                        {headCell?.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {invoicesList?.map((row) => (
                  <InvoicesTableRow
                    key={row?.id}
                    refetch={refetch}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    dataCount={invoicesCount}
                    setPage={setPage}
                    row={row}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, invoicesCount)}
                />

                {notFound && <TableNoData query={search} />}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}

        <TablePagination
          page={page}
          component="div"
          count={invoicesCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
