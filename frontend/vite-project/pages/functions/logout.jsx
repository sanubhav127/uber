import React from "react";
import axios from "axios";

export const logout = async () => {
  try {
    await axios.post("http://localhost:3000/user/logout", {}, { withCredentials: true });
    window.location.href = "/user-login";  
  } catch (err) {
    console.error("Logout failed", err);
  }
};
