import PropTypes from "prop-types";
import { Box, TableCell, TableRow } from "@mui/material";
import { FORMAT_INDIAN_CURRENCY } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const PaymentSummaryTableRow = ({ sn, row }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (row?.month_name === "Total") {
      return;
    }
    navigate("/fees-management/fees", { state: row });
  };
  return (
    <>
      <TableRow
        // hover
        tabIndex={-1}
        sx={{
          bgcolor:
            row?.month_name === "Total" ? "primary.lightHover" : "inherit",
        }}
      >
        <TableCell>{sn || "-"}</TableCell>

        <TableCell sx={{ fontWeight: row?.month_name === "Total" && 800 }}>
          {row?.category === "monthly_fees"
            ? row?.month_name || row?.month_no || "0"
            : row?.category || "-"}
        </TableCell>

        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.total_amount) || "0"}
        </TableCell>

        <TableCell>
          <Box
            sx={{
              color: row?.month_name === "Total" ? "inherit" : "primary.main",
              textDecoration:
                row?.month_name === "Total" ? "none" : "underline",
              cursor: row?.month_name === "Total" ? "inherit" : "pointer",
              fontWeight: 600,
              textUnderlineOffset: "3px",
            }}
            onClick={handleClick}
          >
            ₹ {FORMAT_INDIAN_CURRENCY(row?.fee_due) || "0"}
          </Box>
        </TableCell>
        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.late_fee_collected) || "0"}
        </TableCell>
      </TableRow>
    </>
  );
};

PaymentSummaryTableRow.propTypes = {
  row: PropTypes.object,
  sn: PropTypes.number,
};

export default PaymentSummaryTableRow;
