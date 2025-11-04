import { useContext } from "react";
import { LayoutContext } from "../contexts/layout-context";
// ----------------------------------------------------------------------

const useLayout = () => useContext(LayoutContext);

export default useLayout;
