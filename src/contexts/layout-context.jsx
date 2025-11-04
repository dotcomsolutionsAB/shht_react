import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
  const isLargeScreen = window.innerWidth > 900;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(isLargeScreen);
  const [openItems, setOpenItems] = useState({}); // for sidebar

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setOpenItems({});
  };

  const calculateLayout = (width) => {
    const isExtraSmall = width < 600;
    const isLessThanMedium = width < 900;

    if (isLessThanMedium) {
      handleDrawerClose();
    } else {
      setOpenItems({});
    }

    return {
      headerHeight: "64px",
      sidebarWidth: isSidebarExpanded || isLessThanMedium ? "300px" : "64px",
      px: isExtraSmall || isLessThanMedium ? "10px" : "20px",
      isLessThanMedium,
    };
  };

  const [layout, setLayout] = useState(() =>
    calculateLayout(window.innerWidth)
  );

  const toggleSidebar = () => {
    setIsSidebarExpanded((preValue) => !preValue);
    setOpenItems({});
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setLayout(calculateLayout(width));
    });

    resizeObserver.observe(document.documentElement);

    return () => resizeObserver.disconnect();
  }, [isSidebarExpanded]);

  return (
    <LayoutContext.Provider
      value={{
        layout,
        drawerOpen,
        handleDrawerOpen,
        handleDrawerClose,
        isSidebarExpanded,
        toggleSidebar,
        openItems,
        setOpenItems,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

LayoutProvider.propTypes = {
  children: PropTypes.node,
};

export { LayoutContext };
export default LayoutProvider;
