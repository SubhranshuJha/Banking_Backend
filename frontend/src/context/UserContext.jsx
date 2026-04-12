import React, { createContext, useState, useEffect } from "react";

export const DataContext = createContext();

export const UserProvider = ({ children }) => {
  
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Synchronize localStorage whenever the token state changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <DataContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </DataContext.Provider>
  );
};

export default UserProvider; 