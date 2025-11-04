import { useEffect, Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../hooks/useAuth";
import MainLayout from "../layouts/main-layout";

import { IS_LOGGED_IN, USER_INFO, WEBSITE_NAME } from "../utils/constants";
import { Box, Typography } from "@mui/material";
import SHHT_Logo from "../assets/logos/SHHT_Logo.png";
import Settings from "../pages/settings";

// Error Pages
const Page404 = lazy(() => import("../pages/Page404"));
const Login = lazy(() => import("../pages/login"));
const ChangePassword = lazy(() => import("../pages/change-password"));

// Dashboards
const AdminDashboard = lazy(() => import("../pages/admin-dashboard"));

const Users = lazy(() => import("../sections/admin/users/users"));

function withAccess(accessTo = [], routeKey, route) {
  if (accessTo?.[0] === "all") {
    return [route]; // ✅ allow all routes
  }
  return accessTo?.includes(routeKey) ? [route] : [];
}

export default function Router() {
  const { isLoggedIn, logout, userInfo, accessTo } = useAuth();

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key === IS_LOGGED_IN ||
        event.key === USER_INFO ||
        event.newValue === null
      ) {
        logout();
        toast.error("Session storage changed.");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const ADMIN_ROUTES = [
    { index: true, element: <AdminDashboard /> },
    ...withAccess(accessTo, "orders", {
      path: "orders",
      element: <Users />,
    }),
    ...withAccess(accessTo, "invoices", {
      path: "invoices",
      element: <Users />,
    }),
    ...withAccess(accessTo, "clients", {
      path: "clients",
      element: <Users />,
    }),
    ...withAccess(accessTo, "users", {
      path: "users",
      element: <Users />,
    }),
    ...withAccess(accessTo, "settings", {
      path: "settings",
      element: <Settings />,
    }),
    { path: "change-password", element: <ChangePassword /> },
  ].filter(Boolean);

  const routes = useRoutes([
    {
      path: "/",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/login" replace />,
      children:
        userInfo?.role === "admin"
          ? ADMIN_ROUTES
          : [{ path: "*", element: <Navigate to="/404" replace /> }],
    },
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/" replace /> : <Login />,
    },
    { path: "404", element: <Page404 /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            flexDirection: "column",
            gap: 1,
            textAlign: "center",
          }}
        >
          {/* Background */}
          <Box
            component="img"
            src={SHHT_Logo}
            sx={{
              width: { xs: "80vw" },
              maxWidth: "250px",
              objectFit: "cover",
            }}
          ></Box>
          <Typography variant="h3">{WEBSITE_NAME}</Typography>
        </Box>
      }
    >
      {routes}
    </Suspense>
  );
}
