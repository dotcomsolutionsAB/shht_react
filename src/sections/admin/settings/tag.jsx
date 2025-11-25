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
import { getTags } from "../../../services/admin/tags.service";
import AddNewTagModal from "./modals/add-new-tag-modal";
import TagTableRow from "./tag-table-row";

const HEAD_LABEL = [
  { id: "name", label: "Name" },
  { id: "action", label: "Action", align: "center" },
];

const Tag = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  // api to get Tag list
  const {
    dataCount: tagsCount,
    dataList: tagsList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getTags,
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
  const notFound = !tagsCount;
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
        <Typography variant="h5">Tags</Typography>
        <Button variant="contained" onClick={handleModalOpen}>
          + Add New
        </Button>
        {/* Modal */}
        <AddNewTagModal
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
              {tagsList?.map((row, index) => (
                <TagTableRow
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

export default Tag;
