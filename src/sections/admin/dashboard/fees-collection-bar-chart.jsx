import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { Box, Card, CardContent, Typography } from "@mui/material";

const FeesCollectionBarChart = ({ transactionStats }) => {
  // Handle null, undefined, or 0 values with default of 0
  const dates = transactionStats?.dates ?? 0;
  const sums = transactionStats?.sums ?? 0;

  // Data for the chart
  const series = [
    {
      name: "Collection",
      data: sums,
    },
  ];

  // Check if both counts are 0 or invalid to avoid rendering an empty chart
  const hasValidData = dates?.length > 0 && sums?.length > 0;

  // Chart configuration options
  const options = {
    chart: {
      type: "bar",
      background: "#fff",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        horizontal: false,
        color: "green",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: dates,
    },
    // colors: ["#4CAF50"],
    title: {
      text: "Fees Collection",
      align: "left",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#000",
      },
    },
  };

  return (
    <Card elevation={10} sx={{ height: "350px" }}>
      <CardContent>
        {/* Fees Collection Bar Chart */}
        {hasValidData ? (
          <Chart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="300px"
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              position: "relative",
            }}
          >
            <Typography
              variant="h4"
              sx={{ position: "absolute", top: 0, left: 0 }}
            >
              Transactions
            </Typography>
            <Typography variant="h4">No data available</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

FeesCollectionBarChart.propTypes = {
  transactionStats: PropTypes.object,
};

export default FeesCollectionBarChart;
