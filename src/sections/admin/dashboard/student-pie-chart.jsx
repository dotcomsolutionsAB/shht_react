import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { Box, Card, CardContent, Typography } from "@mui/material";

const StudentPieChart = ({ studentStats, hasAccess = false }) => {
  // Handle null, undefined, or 0 values with default of 0
  const maleCount = studentStats?.male_student_count ?? 0;
  const femaleCount = studentStats?.female_student_count ?? 0;

  // Data for the chart
  const series = [maleCount, femaleCount];

  // Check if both counts are 0 or invalid to avoid rendering an empty chart
  const hasValidData = maleCount > 0 || femaleCount > 0;

  // Chart configuration options
  const options = {
    chart: {
      type: "donut",
      background: "#fff",
    },
    labels: ["Male", "Female"],
    colors: ["#ffa726", "#740122"],
    title: {
      text: "Students",
      align: "left",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#000",
      },
    },
    legend: {
      show: true,
    },
    noData: {
      text: "No data available",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#000",
        fontSize: "16px",
        fontFamily: "Roboto, Arial, sans-serif",
        fontWeight: "bold",
      },
    },
  };

  return (
    <Card elevation={10} sx={{ height: hasAccess ? "350px" : "auto" }}>
      <CardContent>
        {/* Donut Chart */}
        {hasValidData ? (
          <Chart
            options={options}
            series={series}
            type="donut"
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
              Students
            </Typography>
            <Typography variant="h4">No data available</Typography>
          </Box>
        )}

        {/* Custom Legend */}
        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: "20px",
                  height: "10px",
                  backgroundColor: "#ffa726",
                  marginRight: "5px",
                }}
              />
              <Typography>Male</Typography>
            </Box>
            <Typography sx={{ fontWeight: "bold" }}>1,249</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: "20px",
                  height: "10px",
                  backgroundColor: "#740122",
                  marginRight: "5px",
                }}
              />
              <Typography>Female</Typography>
            </Box>
            <Typography sx={{ fontWeight: "bold" }}>964</Typography>
          </Box>
        </Box> */}
      </CardContent>
    </Card>
  );
};

StudentPieChart.propTypes = {
  studentStats: PropTypes.object,
  hasAccess: PropTypes.bool,
};

export default StudentPieChart;
