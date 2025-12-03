export default function Autocomplete(theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root.Mui-disabled": {
            backgroundColor: theme.palette.grey[200], // Full field disabled look
            color: theme.palette.text.disabled,
          },
        },
      },
    },
  };
}
