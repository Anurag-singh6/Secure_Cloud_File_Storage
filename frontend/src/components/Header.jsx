import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcFolder } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, isLogin, role, setRole } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = () => {
    switch (role) {
      case "Faculty": {
        setRole("Faculty");
        navigate("/faculty-dashboard");
        break;
      }
      case "Student": {
        setRole("Student");
        navigate("/student-dashboard");
        break;
      }
      default: {
        navigate("/");
        break;
      }
    }
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <div className="bg-[var(--background)] shadow-xl px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 sticky top-0 z-50 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="flex-shrink-0">
          <h1 className="text-xl text-[var(--text-primary)] font-bold font-serif flex items-center">
            <FcFolder className="w-15 h-10" />
            secure<span className="text-[var(--text-secondary)]">Zilla</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          <Link
            to={"/"}
            className="no-underline font-bold text-[var(--text-primary)] text-sm md:text-base lg:text-lg hover:text-[var(--secondary-hover)] transition duration-300"
          >
            Home
          </Link>
          <Link
            to={"/about"}
            className="no-underline font-bold text-[var(--text-primary)] text-sm md:text-base lg:text-lg hover:text-[var(--secondary-hover)] transition duration-300"
          >
            About
          </Link>
          <Link
            to={"/contact"}
            className="no-underline font-bold text-[var(--text-primary)] text-sm md:text-base lg:text-lg hover:text-[var(--secondary-hover)] transition duration-300"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {isLogin ? (
            <div
              className="text-[var(--text-primary)] font-bold text-sm md:text-base lg:text-lg hover:text-[var(--secondary-hover)] cursor-pointer transition duration-300"
              onClick={handleNavigate}
            >
              {user.name}
            </div>
          ) : (
            <>
              <button
                className="bg-[var(--secondary)] cursor-pointer text-[var(--text-primary)] py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-5 lg:px-6 font-bold text-xs sm:text-sm md:text-base hover:bg-[var(--secondary-hover)] rounded transition duration-300"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="bg-[var(--secondary)] cursor-pointer text-[var(--text-primary)] py-1.5 sm:py-2 md:py-2.5 px-3 sm:px-4 md:px-5 lg:px-6 font-bold text-xs sm:text-sm md:text-base hover:bg-[var(--secondary-hover)] rounded transition duration-300"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Buttons */}
        <button
          onClick={handleMenuClick}
          className="md:hidden p-2 flex flex-col gap-1.5"
          aria-label="Toggle menu"
        >
          <span
            className={`bg-white h-1 w-6 transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-3" : ""
            }`}
          ></span>
          <span
            className={`bg-white h-1 w-6 transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`bg-white h-1 w-6 transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--background)] shadow-lg px-4 sm:px-6 py-4 sm:py-6 space-y-3">
          {/* Mobile Navigation Links*/}
          <Link
            to={"/"}
            onClick={closeMenu}
            className="no-underline font-bold text-[var(--text-primary)] text-base sm:text-lg hover:text-[var(--text-secondary)] transition duration-300 block py-2"
          >
            Home
          </Link>
          <Link
            to={"/about"}
            onClick={closeMenu}
            className="no-underline font-bold text-[var(--text-primary)] text-base sm:text-lg hover:text-[var(--text-secondary)] transition duration-300 block py-2"
          >
            About
          </Link>
          <Link
            to={"/contact"}
            onClick={closeMenu}
            className="no-underline font-bold text-[var(--text-primary)] text-base sm:text-lg hover:text-[var(--text-secondary)] transition duration-300 block py-2"
          >
            Contact
          </Link>

          {/* Mobile Auth Section */}
          <div className="border-t border-white pt-3 mt-3 space-y-2">
            {isLogin ? (
              <div
                className="text-[var(--text-primary)] font-bold text-base sm:text-lg hover:text-[var(--secondary-hover)] cursor-pointer transition duration-300 py-2"
                onClick={() => {
                  handleNavigate();
                  closeMenu();
                }}
              >
                {user.name}
              </div>
            ) : (
              <>
                <button
                  className="w-full bg-[var(--secondary)] cursor-pointer text-[var(--text-primary)] py-2 sm:py-2.5 px-4 font-bold text-sm sm:text-base hover:bg-[var(--secondary-hover)] rounded transition duration-300"
                  onClick={() => {
                    navigate("/login");
                    closeMenu();
                  }}
                >
                  Login
                </button>
                <button
                  className="w-full bg-[var(--secondary)] cursor-pointer text-[var(--text-primary)] py-2 sm:py-2.5 px-4 font-bold text-sm sm:text-base hover:bg-[var(--secondary-hover)] rounded transition duration-300"
                  onClick={() => {
                    navigate("/register");
                    closeMenu();
                  }}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
