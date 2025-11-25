import { useCallback, useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import TableNoData from "../../../components/table/table-no-data";
import TableEmptyRows from "../../../components/table/table-empty-rows";

import {
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
import ClientsTableRow from "./clients-table-row";
import AddNewClientModal from "./modals/add-new-client-modal";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import {
  exportClient,
  getClients,
} from "../../../services/admin/clients.service";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "name", label: "Client" },
  { id: "category", label: "Category" },
  { id: "sub_category", label: "Sub-Category" },
  { id: "tags", label: "Tags" },
  { id: "city", label: "City" },
  { id: "state", label: "State" },
  { id: "rm", label: "RM" },
  { id: "sales_person", label: "Sales Person" },
  { id: "action", label: "Action", align: "center" },
];

export default function Clients() {
  const { logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [isExportLoading, setIsExportLoading] = useState(false);

  const dataSendingToBackend = {
    search,
  };

  // api to get clients list
  const {
    dataCount: clientsCount,
    dataList: clientsList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getClients,
    body: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      ...dataSendingToBackend,
    },
    dependencies: [page, rowsPerPage, search],
    debounceDelay: 500,
  });

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleExport = async () => {
    setIsExportLoading(true);
    const response = await exportClient(dataSendingToBackend);
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
  const notFound = !clientsCount;

  return (
    <>
      <Helmet>
        <title>Clients | SHHT</title>
      </Helmet>
      <Card sx={{ p: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mt: 1,
            mb: 2,
            width: "100%",
          }}
        >
          {/* Search  */}
          <TextField
            value={search || ""}
            onChange={handleSearch}
            placeholder="Search"
            size="small"
            sx={{ maxWidth: "300px" }}
          />

          <Box>
            {/* Add Client*/}
            <Button variant="contained" onClick={handleModalOpen}>
              + Add Client
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
          <AddNewClientModal
            open={modalOpen}
            onClose={handleModalClose}
            refetch={refetch}
            userTypeList={["admin", "sales", "staff", "dispatch"]}
          />
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
                {clientsList?.map((row, index) => (
                  <ClientsTableRow
                    key={row?.id}
                    index={index}
                    refetch={refetch}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    dataCount={clientsCount}
                    setPage={setPage}
                    row={row}
                    userTypeList={["admin", "sales", "staff", "dispatch"]}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, clientsCount)}
                />

                {notFound && <TableNoData query="" />}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}

        <TablePagination
          page={page}
          component="div"
          count={clientsCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
