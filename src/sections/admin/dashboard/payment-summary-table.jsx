import PropTypes from "prop-types";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MessageBox from "../../../components/error/message-box";
import Loader from "../../../components/loader/loader";
import PaymentSummaryTableRow from "./payment-summary-table-row";
import { useGetApi } from "../../../hooks/useGetApi";
import useAuth from "../../../hooks/useAuth";
import { getFeeStats } from "../../../services/admin/dashboard.service";
import { REMOVE_UNDERSCORE } from "../../../utils/constants";

const HEAD_LABEL = [
  {
    id: "sn",
    label: "SN",
    width: "50px",
  },
  {
    id: "month",
    label: "Month",
    width: "150px",
  },
  {
    id: "totalAmount",
    label: "Total Amount",
    width: "150px",
  },
  {
    id: "amountDue",
    label: "Amount Due",
    width: "150px",
  },
  {
    id: "lateFeeCollected",
    label: "Late Fee Collected",
    width: "180px",
  },
];

const PaymentSummaryTable = ({ academicYear }) => {
  const { userInfo } = useAuth();

  const { dataList, isLoading, isError, errorMessage } = useGetApi({
    apiFunction: getFeeStats,
    body: {
      ay_id: Number(academicYear?.ay_id) || userInfo?.ay_id,
    },
    dependencies: [academicYear?.ay_id],
  });

  const feeStats = dataList
    ? Object.keys(dataList)?.flatMap((key) => {
        const value = dataList[key];
        if (Array.isArray(value)) {
          // Flatten monthly fees array
          return value.map((item) => ({
            category: key,
            ...item,
          }));
        } else {
          // Transform other fees into an object
          return {
            category: REMOVE_UNDERSCORE(key),
            ...value,
          };
        }
      })
    : [];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Table */}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <MessageBox errorMessage={errorMessage} />
      ) : (
        <Card sx={{ width: "100%", mt: 3 }} elevation={10}>
          <TableContainer sx={{ overflowY: "unset", bgcolor: "white" }}>
            <Table sx={{ minWidth: 800 }}>
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
                      {headCell?.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {feeStats?.map((row, index) => (
                  <PaymentSummaryTableRow
                    key={index}
                    sn={index + 1}
                    row={row}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
};

PaymentSummaryTable.propTypes = {
  academicYear: PropTypes.object,
};

export default PaymentSummaryTable;
