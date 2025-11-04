export default function Table(theme) {
  return {
    MuiTable: {
      styleOverrides: {
        root: {
          border: `1px solid #DDDEEE`,
        },
      },
    },
    // MuiTableRow: {
    //   styleOverrides: {
    //     root: {
    //       "&.Mui-selected": {
    //         backgroundColor: theme.palette.action.selected,
    //         "&:hover": {
    //           backgroundColor: theme.palette.action.hover,
    //         },
    //       },
    //     },
    //   },
    // },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #DDDEEE",
        },
        head: {
          background: theme.palette.primary.light,
          color: theme.palette.primary.main,
          fontWeight: theme.typography.fontWeightBold,
          "&:first-of-type": {
            paddingLeft: theme.spacing(2),
          },
          "&:last-of-type": {
            paddingRight: theme.spacing(2),
          },
        },
        stickyHeader: {
          background: theme.palette.primary.light,
          color: theme.palette.primary.main,
          fontWeight: theme.typography.fontWeightBold,
          "&:first-of-type": {
            paddingLeft: theme.spacing(2),
          },
          "&:last-of-type": {
            paddingRight: theme.spacing(2),
          },
        },
        body: {
          fontWeight: 600,
          "&:first-of-type": {
            paddingLeft: theme.spacing(2),
          },
          "&:last-of-type": {
            paddingRight: theme.spacing(2),
          },
        },
      },
    },
    // MuiTablePagination: {
    //   styleOverrides: {
    //     root: {
    //       borderTop: "none",
    //       fontSize: "12px",
    //     },
    //     toolbar: {
    //       height: "40px",
    //       fontSize: "12px",
    //       overflowX: "auto", // Allow horizontal scrolling
    //       "&::-webkit-scrollbar": {
    //         height: "6px", // Set the scrollbar height
    //       },
    //     },
    //     select: {
    //       fontSize: "12px",
    //       "&:focus": {
    //         borderRadius: theme.shape.borderRadius,
    //       },
    //     },
    //     selectIcon: {
    //       width: 20,
    //       height: 20,
    //       marginTop: -4,
    //     },
    //     displayedRows: {
    //       fontSize: "12px", // Set text size for displayed rows
    //     },
    //     actions: {
    //       fontSize: "12px", // Set text size for actions
    //     },
    //     selectLabel: {
    //       fontSize: "12px", // Change font size for "Rows per page"
    //     },
    //   },
    // },
    // MuiMenuItem: {
    //   styleOverrides: {
    //     root: {
    //       fontSize: "12px", // Change text size for dropdown menu items
    //     },
    //   },
    // },
    // MuiTableContainer: {
    //   styleOverrides: {
    //     root: {
    //       overflow: "auto",
    //       "&::-webkit-scrollbar": {
    //         height: "6px", // For horizontal scrollbar
    //       },
    //     },
    //   },
    // },
  };
}
