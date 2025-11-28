import PropTypes from "prop-types";
import { memo, useState } from "react";
import {
  Box,
  Button,
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
  TextField,
  Autocomplete,
  IconButton,
} from "@mui/material";
import { CancelOutlined, Cancel } from "@mui/icons-material";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import ViewContactsModalTableRow from "./view-contacts-modal-table-row";
import TableNoData from "../../../../components/table/table-no-data";
import { toast } from "react-toastify";
import { createContactPerson } from "../../../../services/admin/clients.service";
import useAuth from "../../../../hooks/useAuth";

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
  const { logout } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // if no search result is found
  const notFound = !contactPersonsCount && !isAddingNew;

  // Check if the last contact is complete
  const isLastContactComplete = () => {
    if (contacts.length === 0) return false;
    const lastContact = contacts[contacts.length - 1];
    return (
      lastContact.name &&
      lastContact.mobile &&
      lastContact.email &&
      lastContact.rm
    );
  };

  const handleAddNewClick = () => {
    const newContact = {
      id: Date.now(),
      name: "",
      mobile: "",
      email: "",
      rm: null,
    };
    setContacts([newContact, ...contacts]);
    setIsAddingNew(true);
  };

  const handleContactChange = (e, contactId, field = null, value = null) => {
    setContacts((prev) =>
      prev.map((contact) => {
        if (contact.id === contactId) {
          if (field) {
            // For Autocomplete (rm field)
            return { ...contact, [field]: value };
          } else {
            // For TextField
            const { name, value: val } = e.target;
            return { ...contact, [name]: val };
          }
        }
        return contact;
      })
    );
  };

  const handleRemoveContact = (contactId) => {
    const updatedContacts = contacts.filter((c) => c.id !== contactId);
    setContacts(updatedContacts);
    if (updatedContacts.length === 0) {
      setIsAddingNew(false);
    }
  };

  const handleCancelNew = () => {
    setContacts([]);
    setIsAddingNew(false);
  };

  const handleSaveNewContacts = async () => {
    // Validate all contacts
    for (const contact of contacts) {
      if (!contact.name || !contact.mobile || !contact.email) {
        toast.error("Please fill in all required fields for all contacts");
        return;
      }
    }

    setIsSubmitting(true);

    // Prepare payload with client and contacts array
    const payload = {
      client: client_id,
      contacts: contacts.map((contact) => ({
        name: contact.name,
        mobile: contact.mobile,
        email: contact.email,
        rm: contact.rm?.id,
      })),
    };

    // Call API once with all contacts
    const response = await createContactPerson(payload);
    setIsSubmitting(false);

    if (response?.code === 200) {
      toast.success(response?.message || "All contacts created successfully!");
      handleCancelNew();
      refetchContactPersons();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Error creating contacts");
    }
  };

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="h5">Contact Person</Typography>
          {(!isAddingNew || isLastContactComplete()) && (
            <Button
              variant="contained"
              onClick={handleAddNewClick}
              disabled={isSubmitting}
            >
              + Add New
            </Button>
          )}
        </Box>
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
                {/* New Contact Form Rows */}
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell sx={{ padding: "8px" }}>
                      <TextField
                        size="small"
                        fullWidth
                        required
                        label="Name"
                        name="name"
                        value={contact.name}
                        onChange={(e) => handleContactChange(e, contact.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: "8px" }}>
                      <TextField
                        size="small"
                        type="tel"
                        fullWidth
                        required
                        label="Mobile"
                        name="mobile"
                        value={contact.mobile}
                        onChange={(e) => handleContactChange(e, contact.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: "8px" }}>
                      <TextField
                        size="small"
                        type="email"
                        fullWidth
                        required
                        label="Email"
                        name="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange(e, contact.id)}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: "8px" }}>
                      <Autocomplete
                        size="small"
                        options={rmList || []}
                        getOptionLabel={(option) => option?.name || ""}
                        value={contact.rm || null}
                        onChange={(_, value) =>
                          handleContactChange(null, contact.id, "rm", value)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="RM" required />
                        )}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveContact(contact.id)}
                        disabled={isSubmitting}
                      >
                        <Cancel />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

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

      {/* Dialog Actions */}
      {isAddingNew && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            p: 2,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCancelNew}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveNewContacts}
            disabled={isSubmitting || contacts.length === 0}
          >
            Save
          </Button>
        </Box>
      )}
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
