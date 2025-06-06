import React from "react";
import {useDispatch} from "react-redux";
import appwriteService from "../../appwrite/auth";
import {logout} from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    appwriteService
      .logout()
      .then(() => {
        dispatch(logout());
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };
  return (
    <button
      className="inline-bock px-6 py-2 duration-200 hover:bg-[#d6ccfa] rounded-full"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
