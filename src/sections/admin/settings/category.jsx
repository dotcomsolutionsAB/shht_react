import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import AddNewCategoryModal from "./modals/add-new-category-modal";
import { useCallback, useState } from "react";
import { useGetApi } from "../../../hooks/useGetApi";
import { getCategories } from "../../../services/admin/category.service";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";
import CategoryTableRow from "./category-table-row";
import TableNoData from "../../../components/table/table-no-data";

const HEAD_LABEL = [
  { id: "name", label: "Name" },
  { id: "action", label: "Action", align: "center" },
];

const Category = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // api to get category list
  const {
    dataCount: categoriesCount,
    dataList: categoriesList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getCategories,
    body: {
      search,
    },
    dependencies: [search],
    debounceDelay: 500,
  });

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // if no search result is found
  const notFound = !categoriesCount;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="h5">Categories</Typography>
        <Button variant="contained" onClick={handleModalOpen}>
          + Add New
        </Button>
        {/* Modal */}
        <AddNewCategoryModal
          open={modalOpen}
          onClose={handleModalClose}
          refetch={refetch}
        />
      </Box>

      {/* Divider */}
      <Divider sx={{ border: "1px solid", borderColor: "grey.300", my: 0.5 }} />

      {/* Search  */}
      <TextField
        value={search || ""}
        onChange={handleSearch}
        placeholder="Search"
        size="small"
      />

      {/* Table */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <MessageBox errorMessage={errorMessage} />
      ) : (
        <TableContainer sx={{ overflowY: "auto", height: "410px" }}>
          <Table stickyHeader sx={{ minWidth: 350 }}>
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
              {categoriesList?.map((row, index) => (
                <CategoryTableRow
                  key={row?.id || index}
                  index={index}
                  refetch={refetch}
                  row={row}
                />
              ))}

              {notFound && <TableNoData query="" />}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Category;
