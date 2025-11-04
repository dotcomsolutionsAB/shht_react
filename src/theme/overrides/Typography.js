import { pxToRem } from "../../utils/getFontValue";

export default function Typography(theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: pxToRem(16), // Set default font size to 16px
        },
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
        article: {
          fontWeight: 700,
        },
      },
    },
  };
}
