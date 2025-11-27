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
  Checkbox,
  Chip,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
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
import { getCategories } from "../../../services/admin/category.service";
import { getSubCategories } from "../../../services/admin/sub-category.service";
import { getTags } from "../../../services/admin/tags.service";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getUsers } from "../../../services/admin/users.service";

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
  const [filter, setFilter] = useState({
    category: [],
    sub_category: [],
    tags: [],
    rm: [],
    date_from: null,
    date_to: null,
  });

  const dataSendingToBackend = {
    search,
    category: filter?.category?.map((item) => item?.id).join(","),
    sub_category: filter?.sub_category?.map((item) => item?.id).join(","),
    tags: filter?.tags?.map((item) => item?.id).join(","),
    rm: filter?.rm?.map((item) => item?.id).join(","),
    date_from: filter?.date_from,
    date_to: filter?.date_to,
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
    dependencies: [
      page,
      rowsPerPage,
      search,
      filter?.category,
      filter?.sub_category,
      filter?.rm,
      filter?.tags,
      filter?.date_from,
      filter?.date_to,
    ],
    debounceDelay: 500,
  });

  // api to get category list
  const { dataList: categoryList } = useGetApi({
    apiFunction: getCategories,
  });

  // api to get sub category list
  const { dataList: subCategoryList } = useGetApi({
    apiFunction: getSubCategories,
  });

  // api to get tags list
  const { dataList: tagsList } = useGetApi({
    apiFunction: getTags,
  });

  // api to get rm list
  const { dataList: rmList } = useGetApi({
    apiFunction: getUsers,
    body: { role: "staff" },
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
              multiple
              disableCloseOnSelect
              limitTags={1}
              options={categoryList || []}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Category" size="small" />
              )}
              renderOption={(props, option, { selected }) => (
                <Tooltip title={option?.name || ""} arrow placement="right">
                  <li {...props}>
                    <Checkbox
                      size="small"
                      icon={<CheckBoxOutlineBlank fontSize="small" />}
                      checkedIcon={<CheckBox fontSize="small" />}
                      checked={selected}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                      }}
                    >
                      {option?.name || ""}
                    </span>
                  </li>
                </Tooltip>
              )}
              renderTags={(selected) => [
                selected[0] && (
                  <Chip
                    key={selected[0]?.id}
                    label={
                      <>
                        {selected[0]?.name}
                        {selected.length > 1 && (
                          <span
                            style={{ fontWeight: "bold", marginLeft: "5px" }}
                          >
                            {" "}
                            +{selected.length - 1}
                          </span>
                        )}
                      </>
                    }
                    size="small"
                  />
                ),
              ]}
              value={filter?.category || []}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "category", value: newValue } })
              }
              sx={{ minWidth: "200px" }}
            />
            <Autocomplete
              multiple
              disableCloseOnSelect
              limitTags={1}
              options={subCategoryList || []}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Sub-Category" size="small" />
              )}
              renderOption={(props, option, { selected }) => (
                <Tooltip title={option?.name || ""} arrow placement="right">
                  <li {...props}>
                    <Checkbox
                      size="small"
                      icon={<CheckBoxOutlineBlank fontSize="small" />}
                      checkedIcon={<CheckBox fontSize="small" />}
                      checked={selected}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                      }}
                    >
                      {option?.name || ""}
                    </span>
                  </li>
                </Tooltip>
              )}
              renderTags={(selected) => [
                selected[0] && (
                  <Chip
                    key={selected[0]?.id}
                    label={
                      <>
                        {selected[0]?.name}
                        {selected.length > 1 && (
                          <span
                            style={{ fontWeight: "bold", marginLeft: "5px" }}
                          >
                            {" "}
                            +{selected.length - 1}
                          </span>
                        )}
                      </>
                    }
                    size="small"
                  />
                ),
              ]}
              value={filter?.sub_category || []}
              onChange={(_, newValue) =>
                handleChange({
                  target: { name: "sub_category", value: newValue },
                })
              }
              sx={{ minWidth: "200px" }}
            />
            <Autocomplete
              multiple
              disableCloseOnSelect
              limitTags={1}
              options={rmList || []}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="RM" size="small" />
              )}
              renderOption={(props, option, { selected }) => (
                <Tooltip title={option?.name || ""} arrow placement="right">
                  <li {...props}>
                    <Checkbox
                      size="small"
                      icon={<CheckBoxOutlineBlank fontSize="small" />}
                      checkedIcon={<CheckBox fontSize="small" />}
                      checked={selected}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                      }}
                    >
                      {option?.name || ""}
                    </span>
                  </li>
                </Tooltip>
              )}
              renderTags={(selected) => [
                selected[0] && (
                  <Chip
                    key={selected[0]?.id}
                    label={
                      <>
                        {selected[0]?.name}
                        {selected.length > 1 && (
                          <span
                            style={{ fontWeight: "bold", marginLeft: "5px" }}
                          >
                            {" "}
                            +{selected.length - 1}
                          </span>
                        )}
                      </>
                    }
                    size="small"
                  />
                ),
              ]}
              value={filter?.rm || []}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "rm", value: newValue } })
              }
              sx={{ minWidth: "200px" }}
            />
            <Autocomplete
              multiple
              disableCloseOnSelect
              limitTags={1}
              options={tagsList || []}
              getOptionLabel={(option) => option?.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Tags" size="small" />
              )}
              renderOption={(props, option, { selected }) => (
                <Tooltip title={option?.name || ""} arrow placement="right">
                  <li {...props}>
                    <Checkbox
                      size="small"
                      icon={<CheckBoxOutlineBlank fontSize="small" />}
                      checkedIcon={<CheckBox fontSize="small" />}
                      checked={selected}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                      }}
                    >
                      {option?.name || ""}
                    </span>
                  </li>
                </Tooltip>
              )}
              renderTags={(selected) => [
                selected[0] && (
                  <Chip
                    key={selected[0]?.id}
                    label={
                      <>
                        {selected[0]?.name}
                        {selected.length > 1 && (
                          <span
                            style={{ fontWeight: "bold", marginLeft: "5px" }}
                          >
                            {" "}
                            +{selected.length - 1}
                          </span>
                        )}
                      </>
                    }
                    size="small"
                  />
                ),
              ]}
              value={filter?.tags || []}
              onChange={(_, newValue) =>
                handleChange({ target: { name: "tags", value: newValue } })
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
            categoryList={categoryList}
            subCategoryList={subCategoryList}
            tagsList={tagsList}
            rmList={rmList}
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
                    categoryList={categoryList}
                    subCategoryList={subCategoryList}
                    tagsList={tagsList}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, clientsCount)}
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
