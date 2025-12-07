import { Box, Card, Grid, Typography } from "@mui/material";
import Loader from "../components/loader/loader";
import MessageBox from "../components/error/message-box";
import { Helmet } from "react-helmet-async";
import { useGetApi } from "../hooks/useGetApi";
import { getDashboardStats } from "../services/admin/dashboard.service";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
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

  const handleCardClick = (item) => {
    switch (item) {
      case "total_orders":
        navigate("/orders");
        break;
      case "total_clients":
        navigate("/clients");
        break;
      case "total_users":
        navigate("/users");
        break;
      case "total_pending_orders":
        navigate("/orders", { state: { status: "pending" } });
        break;
      case "total_completed_orders":
        navigate("/orders", { state: { status: "completed" } });
        break;
      case "total_short_closed":
        navigate("/orders", { state: { status: "short_closed" } });
        break;
      case "total_cancelled":
        navigate("/orders", { state: { status: "cancelled" } });
        break;
      default:
        break;
    }
  };

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
            {Object.keys(dashboardStats)?.map((item, index) => {
              return (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: cardHeight,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 2,
                      p: 2,
                      cursor: "pointer",
                    }}
                    onClick={() => handleCardClick(item)}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.disabled",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.replaceAll("_", " ")}
                    </Typography>
                    <Typography variant="h4">
                      {dashboardStats[item] || "0"}
                    </Typography>
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
