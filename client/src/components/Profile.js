import React, { useContext } from "react";
import AuthContext from "../context/authcontext/authContext";
import Navbar from "./Navbar";

const Profile = () => {
  const authContext = useContext(AuthContext);
  return (
    <div>
      <Navbar />
      <h1>Yash Raj</h1>
    </div>
  );
};

export default Profile;
