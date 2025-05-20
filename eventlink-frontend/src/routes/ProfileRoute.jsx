import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProfileRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  return user && user.id === userId ? children : <Navigate to="/" />;
};

export default ProfileRoute;
