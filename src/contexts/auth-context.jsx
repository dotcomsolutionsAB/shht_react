import { createContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import useSessionStorage from "../hooks/useSessionStorage";
import { loginApi } from "../services/auth.service";
import { toast } from "react-toastify";
import { IS_LOGGED_IN, USER_INFO } from "../utils/constants";

// Create an Auth Context
const AuthContext = createContext();

// Create a provider component
const AuthProvider = ({ children }) => {
  const count = useRef(0);

  const [isLoggedIn, setIsLoggedIn, removeLoggedIn] = useSessionStorage(
    IS_LOGGED_IN,
    false
  );
  const [userInfo, setUserInfo, removeUserInfo] = useSessionStorage(
    USER_INFO,
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Derive accessTo array from userInfo.access_to
  const accessTo = userInfo?.access_to?.split(",") || [];

  const login = async (formData) => {
    setIsLoading(true);
    const response = await loginApi(formData);
    setIsLoading(false);

    if (response?.code == 200 && response?.success) {
      setIsLoggedIn(true);
      setUserInfo({ ...response?.data, access_to: "all" });
      toast.success(response?.message || "Login Success");
      count.current = 0;
    } else {
      toast.error(response?.message);
    }
  };

  const logout = (response = null) => {
    removeLoggedIn();
    removeUserInfo();
    setIsLoggedIn(false);
    if (response && count.current === 0) {
      toast.error(response?.message || "Unauthorized");
      count.current = count.current + 1;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLoggedIn,
        setIsLoggedIn,
        login,
        logout,
        isLoading,
        accessTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext };

export default AuthProvider;
