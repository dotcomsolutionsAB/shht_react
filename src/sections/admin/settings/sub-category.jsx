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
import { useCallback, useState } from "react";
import { useGetApi } from "../../../hooks/useGetApi";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";
import TableNoData from "../../../components/table/table-no-data";
import { getSubCategories } from "../../../services/admin/sub-category.service";
import SubCategoryTableRow from "./sub-category-table-row";
import AddNewSubCategoryModal from "./modals/add-new-sub-category-modal";
import { getCategories } from "../../../services/admin/category.service";

const HEAD_LABEL = [
  { id: "name", label: "Name" },
  { id: "category", label: "Category" },
  { id: "action", label: "Action", align: "center" },
];

const SubCategory = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // api to get category list
  const { dataList: categoriesList } = useGetApi({
    apiFunction: getCategories,
  });

  // api to get sub category list
  const {
    dataCount: subCategoriesCount,
    dataList: subCategoriesList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getSubCategories,
    body: {
      search,
      category: categorySearch,
    },
    dependencies: [search, categorySearch],
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
  const handleCategorySearch = (event) => {
    setCategorySearch(event.target.value);
  };

  // if no search result is found
  const notFound = !subCategoriesCount;
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
        <Typography variant="h5">Sub Categories</Typography>
        <Button variant="contained" onClick={handleModalOpen}>
          + Add New
        </Button>
        {/* Modal */}
        <AddNewSubCategoryModal
          open={modalOpen}
          onClose={handleModalClose}
          refetch={refetch}
          categoriesList={categoriesList}
        />
      </Box>

      {/* Divider */}
      <Divider sx={{ border: "1px solid", borderColor: "grey.300", my: 0.5 }} />

      <Box sx={{ display: "flex", gap: 1 }}>
        {/* Search  */}
        <TextField
          value={search || ""}
          onChange={handleSearch}
          placeholder="Search"
          size="small"
        />
        {/* Search Category */}
        <TextField
          value={categorySearch || ""}
          onChange={handleCategorySearch}
          placeholder="Search Category"
          size="small"
        />
      </Box>

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
              {subCategoriesList?.map((row, index) => (
                <SubCategoryTableRow
                  key={row?.id || index}
                  index={index}
                  refetch={refetch}
                  row={row}
                  categoriesList={categoriesList}
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

export default SubCategory;
