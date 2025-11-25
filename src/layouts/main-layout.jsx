import { Outlet } from "react-router-dom";
import { Box, Drawer } from "@mui/material";

import Header from "./header";
import Sidebar from "./sidebar";
import useLayout from "../hooks/uesLayout";
import { usePathname } from "../hooks/usePathname";
import { useEffect } from "react";
import LoginBackground from "../assets/images/Login_Background.jpg";

const MainLayout = () => {
  const pathname = usePathname();
  const { layout, drawerOpen, handleDrawerClose } = useLayout();
  const screenHeight = "100svh";
  const screenWidth = "100vw";

  useEffect(() => {
    if (drawerOpen) {
      handleDrawerClose();
    }
  }, [pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: screenHeight,
        width: screenWidth,
        overflow: "hidden",
      }}
    >
      {/* ----------------------Header-------------------------- */}
      <Box
        sx={{
          width: "100%",
          height: layout?.headerHeight,
        }}
      >
        <Header />
      </Box>

      {/* -------------------------Main------------------------------ */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          height: `calc(100% - ${layout?.headerHeight})`,
          display: "flex",
          bgcolor: "custom.body_color",
          ...(pathname === "/change-password"
            ? {
                background: `url(${LoginBackground}) no-repeat center center`,
                backgroundSize: "cover",
              }
            : null),
        }}
      >
        {/* sidebar */}
        {layout?.isLessThanMedium ? (
          <Drawer
            role="presentation"
            open={drawerOpen}
            onClose={handleDrawerClose}
            slotProps={{
              paper: {
                sx: {
                  width: layout?.sidebarWidth,
                  height: "100%",
                  bgcolor: "#F9FAFB",
                  borderRight: "1px solid",
                  borderRightColor: "#D1D5DB",
                  overflowX: "hidden",
                  overflowY: "auto",
                  transition: "width 0.5s ease",
                  zIndex: 10,
                },
              },
            }}
          >
            <Sidebar />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: layout?.sidebarWidth,
              height: "100%",
              bgcolor: "#F9FAFB",
              overflowX: "hidden",
              overflowY: "auto",
              transition: "width 0.5s ease",
              zIndex: 10,
              borderRight: "1px solid",
              borderRightColor: "#D1D5DB",
            }}
          >
            <Sidebar />
          </Box>
        )}

        {/* maincontent */}

        <Box
          sx={{
            flex: 1,
            height: "100%",
            width: `calc(100% - ${layout?.sidebarWidth})`,
            position: "relative",
            overflowY: "auto",
            p: 2,
          }}
        >
          {/* components */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
