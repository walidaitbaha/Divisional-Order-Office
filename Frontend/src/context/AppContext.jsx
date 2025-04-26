import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const AppContextCom = ({ children }) => {
  const [user, setUser] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    setUser,
    isMenuOpen,
    setIsMenuOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

export default AppContextCom;