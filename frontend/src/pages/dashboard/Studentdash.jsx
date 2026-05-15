import React, { useEffect, useState } from "react";
import StudentSlider from "../../components/studentDashboard/StudentSlider";
import Myfiles from "../../components/studentDashboard/Myfiles";
import StudentProfile from "../../components/studentDashboard/StudentProfile";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Studentdash = () => {
  const { role, isLogin } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("myfiles");
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  });

  if (role !== "Student") {
    return (
      <>
        <div className="p-4 sm:p-6">
          <div className="border-2 border-(--secondary) rounded-xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto text-center bg-(--accent) animate-fadeIn">
            {/* Icon */}
            <div className="text-6xl mb-4 text-(--primary) animate-bounce">
              🚫
            </div>

            {/* Message */}
            <div className="text-lg sm:text-xl md:text-2xl font-semibold text-(--text-dark)">
              You are not logged in as{" "}
              <span className="text-(--secondary)">Student</span>.
            </div>
            <p className="mt-3 text-sm sm:text-base text-(--text-secondary)">
              Please login again to continue.
            </p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex w-full h-full z-30">
        <div
          className={`bg-(--background) duration-300 ${
            isOpen ? "w-10" : "w-25 md:w-50"
          }`}
        >
          <StudentSlider
            active={active}
            setActive={setActive}
            isOpen={isOpen}
            setOpen={setOpen}
          />
        </div>
        <div className={`${isOpen ? "w-58/60" : "w-48/60"} duration-300`}>
          {active === "myfiles" && <Myfiles />}
          {active === "profile" && <StudentProfile />}
        </div>
      </div>
    </>
  );
};

export default Studentdash;
