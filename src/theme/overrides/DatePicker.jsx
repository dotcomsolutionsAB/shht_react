export default function DatePicker() {
  return {
    MuiDatePicker: {
      defaultProps: {
        slotProps: {
          field: {
            clearable: true,
            format: "DD-MM-YYYY",
          },
        },
      },
    },
    MuiTimePicker: {
      defaultProps: {
        slotProps: {
          field: {
            clearable: true,
            format: "HH:mm",
          },
        },
      },
    },
  };
}
