import { Box, Card, Grid, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useState } from "react";
import SvgColor from "../components/svg-color/svg-color";
import { fCurrencyINR, fShortenNumber } from "../utils/format-number";
import accountsIcon from "../assets/icons/accounts.svg";
import feeManagementIcon from "../assets/icons/fee_management.svg";
import reportCardIcon from "../assets/icons/report_card.svg";
import studentsIcon from "../assets/icons/students.svg";
import Loader from "../components/loader/loader";
import MessageBox from "../components/error/message-box";
import { Helmet } from "react-helmet-async";
import { useGetApi } from "../hooks/useGetApi";
import { getDashboardStats } from "../services/admin/dashboard.service";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const cardHeight = "132px";
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));

  const statCards = [
    {
      key: "total_orders",
      label: "Total Orders",
      icon: reportCardIcon,
      color: "primary",
      countKey: "total_orders",
      valueKey: "total_order_value",
    },
    {
      key: "total_pending_orders",
      label: "Pending Orders",
      icon: feeManagementIcon,
      color: "warning",
      countKey: "total_pending_orders",
      valuePath: ["order_values", "pending"],
    },
    {
      key: "total_completed_orders",
      label: "Completed Orders",
      icon: reportCardIcon,
      color: "success",
      countKey: "total_completed_orders",
      valuePath: ["order_values", "completed"],
    },
    {
      key: "total_short_closed",
      label: "Short Closed",
      icon: reportCardIcon,
      color: "error",
      countKey: "total_short_closed",
      valuePath: ["order_values", "short_closed"],
    },
    {
      key: "total_cancelled",
      label: "Cancelled Orders",
      icon: reportCardIcon,
      color: "error",
      countKey: "total_cancelled",
      valuePath: ["order_values", "cancelled"],
    },
    {
      key: "total_clients",
      label: "Total Clients",
      icon: accountsIcon,
      color: "info",
      countKey: "total_clients",
    },
    {
      key: "total_users",
      label: "Total Users",
      icon: studentsIcon,
      color: "secondary",
      countKey: "total_users",
    },
  ];

  const getNestedValue = (source, path) =>
    path?.reduce((acc, key) => acc?.[key], source);

  const startParam = startDate?.format("YYYY-MM-DD");
  const endParam = endDate?.format("YYYY-MM-DD");
  const shouldSkip = !startParam || !endParam;

  const {
    dataList: dashboardStats,
    isLoading,
    isError,
    errorMessage,
  } = useGetApi({
    apiFunction: getDashboardStats,
    body: shouldSkip
      ? {}
      : {
          start_date: startParam,
          end_date: endParam,
        },
    dependencies: [startParam, endParam],
    skip: shouldSkip,
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
          gap: 2,
          py: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >
          <DatePicker
            label="Start date"
            value={startDate}
            maxDate={endDate}
            onChange={(newValue) => setStartDate(newValue)}
            format="YYYY-MM-DD"
            slotProps={{ textField: { size: "small" } }}
          />
          <DatePicker
            label="End date"
            value={endDate}
            minDate={startDate}
            onChange={(newValue) => setEndDate(newValue)}
            format="YYYY-MM-DD"
            slotProps={{ textField: { size: "small" } }}
          />
        </Box>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <Grid container spacing={2}>
            {statCards.map((item, index) => {
              const stats = dashboardStats || {};
              const color = theme.palette[item.color]?.main || theme.palette.primary.main;
              const softBg = alpha(color, 0.12);
              const border = alpha(color, 0.22);
              const countValue = stats[item.countKey] ?? 0;
              const rawValue =
                item.valueKey || item.valuePath
                  ? item.valueKey
                    ? stats[item.valueKey]
                    : getNestedValue(stats, item.valuePath)
                  : null;
              const hasValue = rawValue !== null && rawValue !== undefined;

              return (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: cardHeight,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 1,
                      p: 1.5,
                      cursor: "pointer",
                      borderRadius: 1.5,
                      border: `1px solid ${border}`,
                      background: `linear-gradient(145deg, ${alpha(
                        color,
                        0.14
                      )} 0%, ${alpha(color, 0.02)} 100%)`,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                    onClick={() => handleCardClick(item.key)}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                        bgcolor: softBg,
                        color,
                      }}
                    >
                      <SvgColor src={item.icon} sx={{ width: 18, height: 18 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                      {item.label}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: "text.disabled" }}>
                          Count
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {fShortenNumber(countValue)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" sx={{ color: "text.disabled" }}>
                          Value
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, color: hasValue ? "text.primary" : "text.disabled" }}
                        >
                          {hasValue ? fCurrencyINR(rawValue) : "—"}
                        </Typography>
                      </Box>
                    </Box>
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
