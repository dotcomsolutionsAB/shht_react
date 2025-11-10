import { Box, Card, Grid, Typography } from "@mui/material";
import Loader from "../components/loader/loader";
import MessageBox from "../components/error/message-box";
import { Helmet } from "react-helmet-async";
import { useGetApi } from "../hooks/useGetApi";
import { getDashboardStats } from "../services/admin/dashboard.service";

const LIST_ITEMS = [
  {
    id: 1,
    label: "Total Orders",
    total: 400,
  },
  {
    id: 2,
    label: "Total Clients",
    total: 270,
  },
  {
    id: 3,
    label: "Total Users",
    total: 15,
  },
  {
    id: 4,
    label: "Total Pending Orders",
    total: 49,
  },
  {
    id: 5,
    label: "Total Completed Orders",
    total: 278,
  },
  {
    id: 6,
    label: "Total Invoiced",
    total: 300,
  },
  {
    id: 7,
    label: "Total Dispatched Orders",
    total: 339,
  },
  {
    id: 8,
    label: "Total Partial Pending",
    total: 56,
  },
  {
    id: 9,
    label: "Total Short Closed",
    total: 31,
  },
  {
    id: 10,
    label: "Total Cancelled",
    total: 20,
  },
];

const AdminDashboard = () => {
  const cardHeight = "150px";

  const {
    dataList: dashboardStats,
    isLoading,
    isError,
    errorMessage,
  } = useGetApi({
    apiFunction: getDashboardStats,
    // skip: true,
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | SHHT</title>
      </Helmet>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <Grid container spacing={2}>
            {LIST_ITEMS?.map((item) => {
              return (
                <Grid key={item.id} item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: cardHeight,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "text.disabled" }}>
                      {item.label || ""}
                    </Typography>
                    <Typography variant="h4">{item?.total || "0"}</Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default AdminDashboard;
