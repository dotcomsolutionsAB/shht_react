import PropTypes from "prop-types";
import { memo } from "react";
import { Box, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { CancelOutlined, Launch } from "@mui/icons-material";
import dayjs from "dayjs";

const PreviewModal = ({ open, onClose, detail }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box
        id="preview-dialog-title"
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <Typography variant="h5">Order Details</Typography>
        <CancelOutlined
          sx={{
            cursor: "pointer",
          }}
          onClick={onClose}
        />
      </Box>

      <DialogContent>
        <Grid container>
          {/* first row */}
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Client</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>{detail?.client?.name || "-"}</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">SO No</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>{detail?.so_no || "-"}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* second row */}
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Contact</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>
                  {detail?.client_contact_person?.mobile || "-"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">SO Date</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>
                  {detail?.so_date
                    ? dayjs(detail?.so_date).format("DD-MM-YYYY")
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* third row */}
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Email</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>
                  {detail?.client_contact_person?.email || "-"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Order No</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>{detail?.order_no || "-"}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* fourth row */}
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Status</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>{detail?.status || "-"}</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Order Date</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>
                  {detail?.order_date
                    ? dayjs(detail?.order_date).format("DD-MM-YYYY")
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* fifth row */}
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Checked By</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>{detail?.checked_by?.name || "-"}</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Dispatched By</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>{detail?.dispatched_by?.name || "-"}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* sixth row */}
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Photos Link</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>
                  {detail?.drive_link ? (
                    <Launch
                      sx={{
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                      onClick={() =>
                        window.open(
                          detail.drive_link,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    />
                  ) : (
                    "-"
                  )}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Dispatched Date</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>
                  {detail?.dispatched_date
                    ? dayjs(detail?.dispatched_date).format("DD-MM-YYYY")
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* seventh row */}
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Invoice No</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>
                  {detail?.invoice?.invoice_number || "-"}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Invoice Date</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>
                  {detail?.invoice?.invoice_date
                    ? dayjs(detail?.invoice?.invoice_date).format("DD-MM-YYYY")
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* eighth row */}
          <Grid item xs={12}>
            <Grid
              container
              sx={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">Billed By</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              >
                <Typography>{detail?.initiated_by?.name || "-"}</Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ bgcolor: "grey.200", p: 1, textAlign: "center" }}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                sx={{ p: 1, textAlign: "center" }}
              ></Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

PreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  detail: PropTypes.object,
};

export default memo(PreviewModal);
