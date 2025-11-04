import ThemeProvider from "./theme";
import Router from "./routes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LayoutProvider from "./contexts/layout-context";
import AuthProvider from "./contexts/auth-context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-image-crop/dist/ReactCrop.css";

function App() {
  return (
    <>
      <HelmetProvider>
        <LayoutProvider>
          <ThemeProvider>
            <AuthProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <BrowserRouter>
                  <Router />
                  <ToastContainer />
                </BrowserRouter>
              </LocalizationProvider>
            </AuthProvider>
          </ThemeProvider>
        </LayoutProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
