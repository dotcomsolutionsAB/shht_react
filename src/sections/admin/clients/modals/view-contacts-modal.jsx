import PropTypes from "prop-types";
import { memo } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import ViewContactsModalTableRow from "./view-contacts-modal-table-row";
import TableNoData from "../../../../components/table/table-no-data";

const HEAD_LABEL = [
  { id: "name", label: "Name" },
  { id: "mobile", label: "Mobile" },
  { id: "email", label: "Email" },
  { id: "rm", label: "RM" },
  { id: "action", label: "Action", align: "center" },
];

const ViewContactsModal = ({
  open,
  onClose,
  client_id,
  rmList,
  contactPersonList,
  contactPersonsCount,
  isContactPersonsLoading,
  isContactPersonsError,
  refetchContactPersons,
  errorContactPersonsMessage,
}) => {
  // if no search result is found
  const notFound = !contactPersonsCount;

  return (
    <Dialog
      open={open}
      onClose={!isContactPersonsLoading ? onClose : null}
      slotProps={{
        paper: {
          sx: {
            minWidth: { xs: "95vw", sm: "550px", md: "800px", lg: "1100px" },
          },
        },
      }}
    >
      <Box
        id="view-contacts-dialog-title"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <Typography variant="h5">View Contacts</Typography>
        <CancelOutlined
          sx={{
            cursor: "pointer",
          }}
          onClick={!isContactPersonsLoading ? onClose : null}
        />
      </Box>

      <DialogContent>
        {/* Table */}
        {isContactPersonsLoading ? (
          <Loader />
        ) : isContactPersonsError ? (
          <MessageBox errorMessage={errorContactPersonsMessage} />
        ) : (
          <TableContainer sx={{ overflowY: "unset" }}>
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
                      <TableSortLabel hideSortIcon>
                        {headCell?.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {contactPersonList?.map((row, index) => (
                  <ViewContactsModalTableRow
                    key={row?.id}
                    index={index}
                    refetch={refetchContactPersons}
                    dataCount={contactPersonsCount}
                    row={row}
                    rmList={rmList}
                    client_id={client_id}
                  />
                ))}

                {notFound && <TableNoData query="" />}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

ViewContactsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  client_id: PropTypes.number.isRequired,
  rmList: PropTypes.array.isRequired,
  contactPersonList: PropTypes.array.isRequired,
  contactPersonsCount: PropTypes.number.isRequired,
  isContactPersonsLoading: PropTypes.bool.isRequired,
  isContactPersonsError: PropTypes.bool.isRequired,
  refetchContactPersons: PropTypes.func.isRequired,
  errorContactPersonsMessage: PropTypes.string.isRequired,
};

export default memo(ViewContactsModal);
