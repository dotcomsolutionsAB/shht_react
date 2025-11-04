import { CloseRounded, DoneRounded } from "@mui/icons-material";
import { Dialog, useTheme, IconButton, Typography, Box } from "@mui/material";

import PropTypes from "prop-types";

const SuccessMessageDialog = ({ open, title, onCancel }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          minWidth: "none",
          maxWidth: "250px",
          maxHeight: "200px",
          width: "100%",
          height: "100%",
          borderTop: `5px solid ${theme.palette.success.main}`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      {/* close icon */}
      <IconButton
        sx={{ p: 0.2, position: "absolute", right: 5, top: 5 }}
        onClick={onCancel}
      >
        <CloseRounded
          sx={{
            fontSize: "18px",
          }}
        />
      </IconButton>

      <Box
        sx={{
          height: "40px",
          width: "40px",
          borderRadius: "50%",
          position: "relative",
          bgcolor: "success.main",
          color: "success.contrastText",
          overflow: "hidden", // Ensure the child doesn't go outside
        }}
      >
        {/* Icon in the center */}
        <DoneRounded
          sx={{
            fontSize: "34px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            zIndex: 2,
          }}
        />
      </Box>
      <Typography variant="h6">Success</Typography>
      <Typography
        sx={{ color: "#8A8A8A" }}
      >{`${title} added successfully !`}</Typography>
    </Dialog>
  );
};

SuccessMessageDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default SuccessMessageDialog;
