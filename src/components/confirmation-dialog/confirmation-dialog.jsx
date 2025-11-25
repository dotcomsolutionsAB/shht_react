import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  CircularProgress,
  DialogContent,
  Typography,
} from "@mui/material";

import PropTypes from "prop-types";
import { memo } from "react";

const ConfirmationDialog = ({
  open,
  title,
  content,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      // onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      slotProps={{
        paper: {
          sx: {
            minWidth: { xs: "80vw", sm: "300px" },
          },
        },
      }}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ textAlign: "center" }}>
        {title || "Are you sure you want to proceed?"}
      </DialogTitle>
      {content && (
        <DialogContent sx={{ p: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", color: "warning.main", mt: 2 }}
          >
            {content || "This action cannot be undone."}
          </Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" disabled={isLoading}>
          {cancelButtonText || "No"}
        </Button>
        <Button onClick={onConfirm} variant="contained" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={27} color="inherit" />
          ) : (
            confirmButtonText || "Yes"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  content: PropTypes.string,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
};

export default memo(ConfirmationDialog);
