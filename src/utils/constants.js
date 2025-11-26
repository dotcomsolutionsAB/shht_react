export const USER_INFO = "userInfo";
export const IS_LOGGED_IN = "isLoggedIn";

export const WEBSITE_NAME = "SH Hardware & Tools";

export const DEFAULT_LIMIT = 10;

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

export const ADMIN_SIDEBAR_ITEMS = [
  {
    _id: 1,
    displayName: "Dashboard",
    linkName: "/",
    iconName: "dashboard",
  },
  {
    _id: 2,
    displayName: "Orders",
    linkName: "/orders",
    iconName: "orders",
    accessKey: "orders",
  },
  {
    _id: 3,
    displayName: "Invoices",
    linkName: "/invoices",
    iconName: "invoices",
    accessKey: "invoices",
  },
  {
    _id: 4,
    displayName: "Clients",
    linkName: "/clients",
    iconName: "clients",
    accessKey: "clients",
  },
  {
    _id: 5,
    displayName: "Users",
    linkName: "/users",
    iconName: "users",
    accessKey: "users",
  },
  {
    _id: 6,
    displayName: "Settings",
    linkName: "/settings",
    iconName: "settings",
    accessKey: "settings",
  },
];

export const ROLE_LIST = ["admin", "sales", "staff", "dispatch"];

export const REMOVE_UNDERSCORE = (text) => {
  return text
    ?.split(/[_\s]/)
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};

export const FORMAT_INDIAN_CURRENCY = (amount) => {
  const num = Number(amount);
  if (isNaN(num) || num === 0) return "";
  return new Intl.NumberFormat("en-IN").format(num);
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  if (rowsPerPage > 25) return 0;
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

/**
 * Handles numeric input for form fields
 * Ensures only positive numbers are allowed, defaults to 0 for invalid inputs
 * @param {string} value - The input value to process
 * @returns {number} - The processed numeric value
 */
export const handleNumericInput = (value) => {
  // Handle empty string or invalid input
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  // Remove any non-numeric characters except decimal point
  const cleanValue = value.replace(/[^0-9.]/g, "");

  // Convert to number
  const numericValue = parseFloat(cleanValue);

  // Check if it's a valid number and not negative
  if (isNaN(numericValue) || numericValue < 0) {
    return 0;
  }

  // Return the numeric value
  return numericValue;
};

const CREATE_ERROR_RESPONSE = (code, message) => ({
  code,
  data: null,
  status: false,
  message,
});

export const GET_ERROR = (error) => {
  const message = error?.response?.data?.message || error?.message;

  if (!error?.response) {
    if (error?.code === "ERR_NETWORK") {
      if (!navigator.onLine) {
        return CREATE_ERROR_RESPONSE(
          1000,
          "You are offline. Please check your internet connection."
        );
      } else {
        return CREATE_ERROR_RESPONSE(1001, "Some error occurred.");
      }
    }
  }

  return CREATE_ERROR_RESPONSE(error?.response?.status, message);
};
