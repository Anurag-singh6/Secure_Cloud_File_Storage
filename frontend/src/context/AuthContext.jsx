import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

const AuthContext = React.createContext();

export const Authprovider = (props) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("secureZilla")) || ""
  );
  const [isLogin, setLogin] = useState(!!user);
  const [role, setRole] = useState(user?.role || "");

  //hook variable dependencies
  useEffect(() => {
    setLogin(!!user);
    setRole(user?.role || "");
  }, [user]);

  const value = { user, setUser, isLogin, setLogin, role, setRole };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
