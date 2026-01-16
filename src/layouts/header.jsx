import {
  AppBar,
  Box,
  Avatar,
  Divider,
  IconButton,
  Typography,
  MenuItem,
  Popover,
  Tooltip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import useLayout from "../hooks/uesLayout";
import useAuth from "../hooks/useAuth";
import {
  ArrowDropDownRounded,
  LockRounded,
  LogoutRounded,
  MenuOpenRounded,
  MenuRounded,
} from "@mui/icons-material";
import { useState } from "react";
import SHHT_Logo from "../assets/logos/SHHT_Logo.png";
import { useNavigate } from "react-router-dom";
import { usePathname } from "../hooks/usePathname";

const MENU_OPTIONS = [
  // {
  //   label: "Home",
  //   icon: <HomeRounded />,
  // },
  {
    label: "Change Password",
    icon: <LockRounded />,
  },
  // {
  //   label: "Settings",
  //   icon: <SettingsRounded />,
  // },
];

const Header = () => {
  const theme = useTheme();
  const { userInfo, logout } = useAuth();
  const pathname = usePathname();
  const navigate = useNavigate();
  const { layout, handleDrawerOpen, isSidebarExpanded, toggleSidebar } =
    useLayout();

  const [isImageError, setIsImageError] = useState(false);
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMenuClick = (option) => {
    handleClose();
    if (option.label === "Home") {
      navigate("/");
    }
    if (option.label === "Change Password") {
      navigate("/change-password");
    }
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar
      elevation={0}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bgcolor: "background.paper",
        color: "text.primary",
        zIndex: 10,
        height: layout?.headerHeight,
        width: "100%",
        overflow: "hidden",
        borderBottom: `1px solid ${alpha(theme.palette.grey[400], 0.3)}`,
        boxShadow: `0 8px 20px ${alpha(theme.palette.common.black, 0.06)}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* left side above sidebar */}

        {!layout?.isLessThanMedium && (
          <Box
            sx={{
              p: "10px",
              bgcolor: alpha(theme.palette.primary.main, 0.06),
              width: layout?.sidebarWidth,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: isSidebarExpanded ? "space-between" : "center",
              transition: "all 0.5s ease",
              borderRight: `1px solid ${alpha(theme.palette.grey[400], 0.3)}`,
            }}
          >
            {/* SHHT Logo */}
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                width: isSidebarExpanded ? "auto" : 0,
                opacity: isSidebarExpanded ? 1 : 0,
                visibility: isSidebarExpanded ? "visible" : "hidden",
                transition: "all 0.5s ease",
                overflow: "hidden",
              }}
            >
              {!isImageError ? (
                <Box
                  component="img"
                  src={SHHT_Logo}
                  alt="SHHT Logo"
                  sx={{
                    height: "75%",
                    objectFit: "contain",
                  }}
                  loading="lazy"
                  onError={handleImageError} // Handles image loading errors
                />
              ) : (
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  noWrap
                >
                  SHHT
                </Typography>
              )}
            </Box>

            {/* Icon Button */}
            <IconButton
              onClick={toggleSidebar}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.18),
                },
              }}
            >
              {isSidebarExpanded ? <MenuOpenRounded /> : <MenuRounded />}
            </IconButton>
          </Box>
        )}

        {/* right side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            width: layout?.isLessThanMedium
              ? "100%"
              : `calc(100% - ${layout?.sidebarWidth})`,
            flex: 1,
            px: 2,
            overflow: "hidden",
          }}
        >
          {layout?.isLessThanMedium && (
            <IconButton
              onClick={handleDrawerOpen}
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.18),
                },
              }}
            >
              <MenuRounded />
            </IconButton>
          )}

          {/* Path Name */}
          <Box
            sx={{
              height: "100%",
              width: `calc(100% - ${
                layout?.isLessThanMedium ? "110px" : "250px"
              })`,
              display: "flex",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Typography
              noWrap
              sx={{
                textTransform: "capitalize",
                fontSize: { xs: "16px", sm: "20px", md: "22px" },
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              {pathname === "/" ? "Dashboard" : pathname.replace("/", "")}
            </Typography>
          </Box>

          {/* User Profile Avatar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
              width: layout?.isLessThanMedium ? "110px" : "250px",
              cursor: "pointer",
            }}
            onClick={handleOpen}
          >
            {!layout?.isLessThanMedium && (
              <Tooltip title={userInfo?.name || ""} placement="bottom">
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                  noWrap
                >
                  Welcome {userInfo?.name?.split(" ")?.[0] || ""}
                </Typography>
              </Tooltip>
            )}
            <Divider
              orientation="vertical"
              sx={{
                width: "3px",
                height: "45%",
                bgcolor: alpha(theme.palette.primary.main, 0.4),
                mx: 1,
              }}
            />
            <Avatar
              variant="circle"
              src={userInfo?.avatarUrl || ""}
              sx={{
                width: "40px",
                height: "40px",
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
            <ArrowDropDownRounded sx={{ color: "text.secondary" }} />
          </Box>

          {/* Popover */}
          <Popover
            open={!!open}
            anchorEl={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{
              paper: {
                sx: {
                  p: 0,
                  mt: 1,
                  ml: 0.75,
                  width: 220,
                },
              },
            }}
          >
            {layout?.isLessThanMedium && (
              <>
                <Box sx={{ my: 1, px: 2 }}>
                  <Tooltip title={userInfo?.name || ""} placement="left">
                    <Typography variant="subtitle2" noWrap>
                      Welcome {userInfo?.name?.split(" ")?.[0] || ""}
                    </Typography>
                  </Tooltip>
                </Box>

                <Divider sx={{ borderStyle: "dashed" }} />
              </>
            )}

            {MENU_OPTIONS.map((option) => (
              <MenuItem
                key={option.label}
                onClick={() => handleMenuClick(option)}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <IconButton
                  sx={{
                    "& > svg": {
                      fontSize: "18px",
                    },
                    color: "primary.main",
                  }}
                >
                  {option?.icon}
                </IconButton>
                {option.label}
              </MenuItem>
            ))}

            <Divider
              sx={{
                borderStyle: "dashed",
                "&.MuiDivider-root": {
                  m: 0,
                },
              }}
            />

            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1,
                color: "error.main",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <LogoutRounded fontSize="small" />
              Logout
            </MenuItem>
          </Popover>
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header;
