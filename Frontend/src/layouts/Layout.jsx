import React, { useState } from "react";
import { dataSideBar } from "../constants/Links";
import { Outlet, useNavigate } from "react-router-dom";
import { SingleLink } from "../components/UI/SingleLink";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { CircularProgress } from "@mui/material";
import { useAppContext } from "../context/AppContext";
import { logout } from "../services/authServices";

export const Layout = () => {
  const navigate = useNavigate();
  const { user, isMenuOpen, setIsMenuOpen } = useAppContext();
  const [loading, setLoading] = useState(false);

  const newdataSideBar = dataSideBar.filter(
    (element) => element.ROLE == user.role
  );

  const LOGOUT = async () => {
    setLoading(true);
    const response = await logout(localStorage.getItem("token"));
    setLoading(false);
    if (response.status === 200) {
      navigate("/sign_in");
    }
  };

  return (
    <div
      onClick={() => {
        setIsMenuOpen(false);
      }}
      className="w-[100%] h-[100vh] flex flex-col sm:flex-row"
    >
      <div className="w-full h-[45px] relative flex items-center sm:hidden shadow-[0_0_1px_rgba(0,0,0,0.5)] ">
        <Bars3Icon
          className={`w-[25px] h-[25px] ml-3 ${isMenuOpen && "hidden"}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(true);
          }}
        />
      </div>
      {newdataSideBar && newdataSideBar.length > 0 && (
        <div
          className={`z-40 bg-dark [#011a41]) font-[500] bg-gray-200 shadow-lg font-[Poppins,sans-serif] w-[80%] 2xl:w-[14%] md:w-[250px] flex flex-col pl-1 absolute sm:translate-x-0 duration-500 ${
            !isMenuOpen && "-translate-x-full"
          } sm:fixed sm:h-[100%] sm:justify-evenly`}
        >
          {newdataSideBar.map((item) => {
            return (
              <div
                className={user.role === "admin" ? "m-3" : "mx-3"}
                key={item.TEXT}
                onClick={() => {
                  navigate(item.LINK);
                }}
              >
                <SingleLink link={item.LINK} svg={item.SVG} text={item.TEXT} />
              </div>
            );
          })}
          <div
            className={`flex justify-baseline gap-1.5 items-center cursor-pointer hover:text-blue-500 duration-200 rounded-lg ${
              user.role === "admin" ? "m-3" : "mx-3"
            }`}
          >
            {!loading ? (
              <div onClick={() => LOGOUT()} className="flex gap-2 items-center">
                <div>
                  {
                    <ArrowRightOnRectangleIcon
                      className="w-6 h-6"
                      strokeWidth="1"
                    />
                  }
                </div>
                <div>
                  <span className="text-lg font-normal">{"Logout"}</span>
                </div>
              </div>
            ) : (
              <div className="flex) justify-cente)r items-center) h-full w-full">
                <CircularProgress
                  style={{ marginLeft: "18%" }}
                  size={"20px"}
                  className="text-blue-700"
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="sm:relative md:left-[300px] w-[86%]">
        <Outlet />
      </div>
    </div>
  );
};