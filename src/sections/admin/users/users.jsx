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
  Autocomplete,
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AddRounded, FileDownloadRounded, FilterAltRounded } from "@mui/icons-material";
import { useGetApi } from "../../../hooks/useGetApi";
import {
  DEFAULT_LIMIT,
  emptyRows,
  ROLE_LIST,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../utils/constants";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";
import { Helmet } from "react-helmet-async";
import UsersTableRow from "./users-table-row";
import { exportUser, getUsers } from "../../../services/admin/users.service";
import AddNewUserModal from "./modals/add-new-user-modal";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "name", label: "Name" },
  { id: "username", label: "Username" },
  { id: "role", label: "User Role" },
  { id: "mobile", label: "Mobile" },
  { id: "email", label: "Email" },
  { id: "order_views", label: "View" },
  { id: "status", label: "Status" },
  { id: "whatsapp_status", label: "WhatsApp" },
  { id: "email_status", label: "Email" },
  { id: "action", label: "Action", align: "center" },
];

export default function Users() {
  const theme = useTheme();
  const { logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [role, setRole] = useState("");

  // api to get users list
  const {
    dataCount: usersCount,
    dataList: usersList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getUsers,
    body: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      search,
      role,
    },
    dependencies: [page, rowsPerPage, search, role],
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
    const response = await exportUser({
      search,
    });
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
  const notFound = !usersCount;

  return (
    <>
      <Helmet>
        <title>Users | SHHT</title>
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
              Users
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Manage team access, roles, and communication settings.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleModalOpen}
              startIcon={<AddRounded />}
              sx={{ textTransform: "none" }}
            >
              Add User
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
          <AddNewUserModal
            open={modalOpen}
            onClose={handleModalClose}
            refetch={refetch}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
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
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
              placeholder="Search"
              size="small"
              sx={{ width: "240px" }}
            />

            <Autocomplete
              options={ROLE_LIST || []}
              renderInput={(params) => (
                <TextField {...params} label="Role" size="small" />
              )}
              value={role || ""}
              onChange={(_, newValue) => setRole(newValue)}
              sx={{ minWidth: "200px", textTransform: "capitalize" }}
            />
          </Box>
        </Box>

        {/* Table */}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <TableContainer
            sx={{
              overflowY: "unset",
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[400], 0.2)}`,
            }}
          >
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    "& th": {
                      fontWeight: 700,
                      color: "text.primary",
                    },
                  }}
                >
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
                {usersList?.map((row, index) => (
                  <UsersTableRow
                    key={row?.id}
                    index={index}
                    refetch={refetch}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    dataCount={usersCount}
                    setPage={setPage}
                    row={row}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, usersCount)}
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
          count={usersCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
