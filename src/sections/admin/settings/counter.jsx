import { Box, Divider, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useGetApi } from "../../../hooks/useGetApi";
import { getCounters } from "../../../services/admin/counter.service";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";
import CounterRow from "./counter-row";

const Counter = () => {
  const [search, setSearch] = useState("");

  // api to get counter list
  const {
    dataCount: counterCount,
    dataList: counterList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getCounters,
    body: {
      limit: 100,
      offset: 0,
      search,
    },
    dependencies: [search],
    debounceDelay: 500,
  });

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // if no search result is found
  const notFound = !counterCount;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Title */}
      <Typography variant="h5" sx={{ py: 0.5 }}>
        Counter
      </Typography>

      {/* Divider */}
      <Divider sx={{ border: "1px solid", borderColor: "grey.300", my: 0.5 }} />

      {/* Search  */}
      <TextField
        value={search || ""}
        onChange={handleSearch}
        placeholder="Search"
        size="small"
      />

      {/* List */}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <MessageBox errorMessage={errorMessage} />
      ) : (
        <Box>
          <Grid container rowSpacing={4} sx={{ mt: 1 }}>
            {counterList?.map((counter, index) => (
              <CounterRow
                key={counter?.id || index}
                counter={counter}
                refetch={refetch}
              />
            ))}
          </Grid>

          {notFound && !search ? (
            <Typography variant="h6">No results found</Typography>
          ) : notFound && search ? (
            <Typography variant="body2">
              No results found for &nbsp;
              <strong>&quot;{search}&quot;</strong>.
              <br /> Try checking for typos or using complete words.
            </Typography>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default Counter;
