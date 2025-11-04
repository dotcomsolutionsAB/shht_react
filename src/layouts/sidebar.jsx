import { useState } from "react";
import Box from "@mui/material/Box";
import { NavLink } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { AvTimerRounded, CloseRounded, Groups } from "@mui/icons-material";
import { ADMIN_SIDEBAR_ITEMS } from "../utils/constants";
import { usePathname } from "../hooks/usePathname";
import { StudentsManagementIcon } from "../theme/overrides/CustomIcons";
import useLayout from "../hooks/uesLayout";
import SHHT_Logo from "../assets/logos/SHHT_Logo.png";
import useAuth from "../hooks/useAuth";

const getIcon = (iconName) => {
  switch (iconName) {
    case "dashboard":
      return <AvTimerRounded />;
    case "students":
      return <StudentsManagementIcon />;
    case "users":
      return <Groups />;
    default:
      return null;
  }
};

const Sidebar = () => {
  const pathname = usePathname();
  const theme = useTheme();
  const { userInfo, accessTo } = useAuth();

  const { layout, handleDrawerClose, isSidebarExpanded } = useLayout();
  const [isImageError, setIsImageError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const filterTopLevelItems = (items, accessTo = []) => {
    // If accessTo includes "all", return all items
    if (accessTo?.includes("all")) return items;

    return items?.filter((item) => {
      // If no accessKey is defined, include by default (like Dashboard)
      if (!item?.accessKey) return true;
      return accessTo?.includes(item.accessKey);
    });
  };

  const MAIN_SIDEBAR_ITEMS =
    userInfo?.role === "admin"
      ? filterTopLevelItems(ADMIN_SIDEBAR_ITEMS, accessTo)
      : [];

  const handleMenuOpen = (event, item) => {
    if (!item?.children || isSidebarExpanded) return;
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {layout?.isLessThanMedium && (
        <Box
          sx={{
            p: "10px",
            bgcolor: "primary.light",
            color: "primary.main",
            height: layout?.headerHeight,
            width: layout?.sidebarWidth,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* SHHT Logo */}
          <Box
            sx={{
              width: "calc(100% - 50px)",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {!isImageError ? (
              <Box
                component="img"
                src={SHHT_Logo}
                alt="SHHT Logo"
                sx={{
                  width: "70px",
                  height: "80%",
                  objectFit: "contain",
                }}
                loading="lazy"
                onError={handleImageError}
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
          <IconButton
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.mainHover",
                color: "primary.contrastText",
              },
            }}
            onClick={handleDrawerClose}
          >
            <CloseRounded />
          </IconButton>
        </Box>
      )}
      {MAIN_SIDEBAR_ITEMS.map((item) => {
        const isActive =
          item?.linkName === pathname ||
          item?.children?.some((child) => pathname.startsWith(child?.linkName));

        return (
          <Box
            key={item?._id}
            component={item?.linkName ? NavLink : "div"}
            to={item?.linkName || ""}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px:
                isSidebarExpanded || layout?.isLessThanMedium ? layout?.px : 0,
              width: "100%",
              minHeight: "50px",
              borderBottom: `2px solid ${theme.palette.primary.contrastText}`,
              textDecoration: "none",
              color: "primary.contrastText",
              bgcolor: isActive ? "primary.mainActive" : "transparent",
              "&:hover": {
                bgcolor: "primary.mainHover",
              },
            }}
          >
            {/* Icon Container */}
            <Tooltip
              title={!isSidebarExpanded ? item?.displayName : ""}
              placement="right"
            >
              <Box
                sx={{
                  width: "40px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={(e) => handleMenuOpen(e, item)}
              >
                <IconButton
                  sx={{
                    p: 0.4,
                    color: "inherit",
                    "& > svg": { fontSize: "23px" },
                  }}
                >
                  {getIcon(item?.iconName)}
                </IconButton>
              </Box>
            </Tooltip>

            {/* Text Container */}
            <Box
              sx={{
                flex: 1,
                maxWidth:
                  isSidebarExpanded || layout.isLessThanMedium
                    ? layout?.sidebarWidth
                    : 0,
                opacity: isSidebarExpanded || layout.isLessThanMedium ? 1 : 0,
                transition: "max-width 0.5s ease, opacity 0.5s ease",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <Typography sx={{ fontWeight: isActive ? 600 : 400 }}>
                {item?.displayName}
              </Typography>
            </Box>
          </Box>
        );
      })}

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: 58,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: 1,
            },
          },
          onMouseEnter: (e) => e.stopPropagation(), // Prevents accidental closure
          onMouseLeave: handleMenuClose, // Closes when the user leaves the menu
        }}
      >
        {selectedItem?.children?.map((child) => (
          <MenuItem
            key={child?._id}
            component={NavLink}
            to={child?.linkName}
            sx={{
              px: 1,
              py: 0.4,
              mt: 0.2,
              fontSize: "14px",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.mainHover",
              },
            }}
            onClick={() => handleMenuClose()}
          >
            {child?.displayName}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Sidebar;
