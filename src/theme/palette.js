import { alpha } from "@mui/material/styles";

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

const PRIMARY = {
  light: "#f1e6e9",
  lightHover: "#ead9de",
  lightActive: "#d4b0ba",
  main: "#0075DB",
  mainHover: "#68011f",
  mainActive: "#5d011b",
  dark: "#1565c0",
  darkHover: "#460114",
  darkActive: "#34000f",
  darker: "#29000c",
};
const SECONDARY = {
  light: "#e8f5f5",
  lightHover: "#f0faf5",
  lightActive: "#b9e0e0",
  main: "#1c9c9b",
  mainHover: "#198c8c",
  mainActive: "#167d7c",
  dark: "#157574",
  darkHover: "#115e5d",
  darkActive: "#0d4646",
  darker: "#0a3736",
};
const INFO = {
  light: "#eaf8fe",
  lightHover: "#dff4fe",
  lightActive: "#bde8fc",
  main: "#29b6f6",
  mainHover: "#25a4dd",
  mainActive: "#2192c5",
  dark: "#1f89b9",
  darkHover: "#196d94",
  darkActive: "#12526f",
  darker: "#0e4056",
};
const SUCCESS = {
  light: "#e6f6ed",
  lightHover: "#daf2e5",
  lightActive: "#b2e3c8",
  main: "#08a64f",
  mainHover: "#079547",
  mainActive: "#06853f",
  dark: "#067d3b",
  darkHover: "#05642f",
  darkActive: "#044b24",
  darker: "#033a1c",
};
const WARNING = {
  light: "#fff6e9",
  lightHover: "#fff2de",
  lightActive: "#ffe4bc",
  main: "#ffa726",
  mainHover: "#e69622",
  mainActive: "#cc861e",
  dark: "#bf7d1d",
  darkHover: "#996417",
  darkActive: "#734b11",
  darker: "#593a0d",
};
const ERROR = {
  light: "#fde9e9",
  lightHover: "#fcdede",
  lightActive: "#f9babc",
  main: "#ed2226",
  mainHover: "#d51f22",
  mainActive: "#be1b1e",
  dark: "#b21a1d",
  darkHover: "#8e1417",
  darkActive: "#6b0f11",
  darker: "#530c0d",
};
const CUSTOM = {
  body_color: "#F0F1F3",
};

const GREY = {
  0: "#FFFFFF",
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#212B36",
  900: "#1C232B",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  secondary: createGradient(SECONDARY.light, SECONDARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const COMMON = {
  custom: { ...CUSTOM, contrastText: "#000" },
  primary: { ...PRIMARY, contrastText: "#fff" },
  secondary: { ...SECONDARY, contrastText: "#fff" },
  info: { ...INFO, contrastText: "#fff" },
  success: { ...SUCCESS, contrastText: "#fff" },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: "#fff" },
  grey: GREY,
  common: { black: "#000", white: "#fff" },
  gradients: GRADIENTS,
  divider: alpha(GREY[500], 0.2),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  light: {
    ...COMMON,
    mode: "light",
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: "#FFFFFF", default: GREY[100], neutral: GREY[200] },
    action: { active: GREY[600], ...COMMON.action },
  },
};

export default palette;
