import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbLogout } from "react-icons/tb";
import { FaEnvelope } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/Api";
import toast from "react-hot-toast";

const StudentSlider = ({ active, setActive, isOpen, setOpen }) => {
  const { setUser, setLogin } = useAuth();
  const menuitems = [
    { key: "myfiles", title: "My Files", icon: <FaEnvelope /> },
    { key: "profile", title: "Profile", icon: <FaCircleUser /> },
  ];

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");
      toast.success(res.data.message);
      setUser("");
      setLogin(false);
      sessionStorage.removeItem("secureZilla_User");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
  };

  return (
    <>
      <div className="ml-2.5">
        <div className="font-bold mt-2.5 p-2 flex gap-1 items-center">
          <button
            className="bg-(--primary) p-3 md:p-2 md:text-sm rounded hover:bg-(--primary-hover) text-(--text-primary) cursor-pointer"
            onClick={() => setOpen(!isOpen)}
          >
            <GiHamburgerMenu/>
          </button>
          {""}
          {!isOpen && (
            <span className="text-nowrap lg:text-sm md:text-[10px] text-[8px] text-(--text-primary) overflow-hidden">
              Student Dashboard
            </span>
          )}
        </div>

        <div className="py-6 space-y-5 w-fit text-(--text-primary) lg:text-sm md:text-sm font-semibold">
          {menuitems.map((item, idx) => (
            <button
              className={`flex gap-3 items-center hover:bg-gray-400 p-2 rounded-xl ${
                active === item.key
                  ? "bg-(--primary)"
                  : "hover:bg-(--primary-hover)"
              }`}
              onClick={() => setActive(item.key)}
              key={idx}
            >
              {" "}
              {item.icon}
              {!isOpen && item.title}
            </button>
          ))}
        </div>
      </div>
      <div>
        <button
          className="flex gap-3 items-center lg:text-lg md:text-sm lg:ps-2 md:ps-3 rounded-xl h-10 text-nowrap overflow-hidden text-white duration-300 hover:bg-(--secondary) font-semibold"
          onClick={handleLogout}
        >
          {" "}
          <TbLogout />
          {!isOpen && "Logout"}
        </button>
      </div>
    </>
  );
};

export default StudentSlider;
