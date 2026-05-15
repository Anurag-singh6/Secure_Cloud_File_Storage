import React, { useState } from "react";
import axios from "axios";
import secure from "../assets/logo/secure.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../config/Api";
import { useAuth } from "../context/AuthContext";
import MFAVerification from "../components/MFAVerification";
import Forgetpass from "../components/publicModels/Forgetpass";
import Loading from "../components/Loading";

const Login = () => {
  const { setUser, setLogin, setRole } = useAuth();

  const navigate = useNavigate();

  const [isForgetModal, setForgetModal] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [mfaEmail, setMfaEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMFASuccess = (userData) => {
    const role = userData.role;

    switch (role) {
      case "Faculty": {
        setUser(userData);
        setLogin(true);
        setRole("Faculty");
        sessionStorage.setItem("secureZilla_User", JSON.stringify(userData));
        handleClearForm();
        setShowMFA(false);
        navigate("/faculty-dashboard");
        break;
      }
      case "Student": {
        setUser(userData);
        setLogin(true);
        setRole("Student");
        sessionStorage.setItem("secureZilla_User", JSON.stringify(userData));
        handleClearForm();
        setShowMFA(false);
        navigate("/student-dashboard");
        break;
      }
      default: {
        setShowMFA(false);
        toast.error("Unsupported user role. Please contact support.");
        break;
      }
    }
  };

  const handleMFACancel = () => {
    setShowMFA(false);
    setMfaEmail("");
  };

  const handleClearForm = () => {
    setFormData({
      email: "",
      password: "",
    });
  };

  const validate = () => {
    let Error = {};
    if (
      !/^[\w\.]+@(gmail|outlook|yahoo)\.(com|in|co.in)$/.test(formData.email)
    ) {
      Error.email = "Use Proper Email Format";
    }
    setValidationError(Error);

    return Object.keys(Error).length > 0 ? false : true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      toast.error("Fill the Form Correctly");
      return;
    }

    try {
      const res = await api.post("/auth/login", formData);

      // Check if MFA is required
      if (res.data.data && res.data.data.requiresMFA) {
        setMfaEmail(res.data.data.email);
        setShowMFA(true);
        toast.success("Password verified. Please complete MFA verification.");
        return;
      }

      const userData = res.data.data;
      const role = userData.role;

      switch (role) {
        case "Faculty": {
          toast.success(res.data.message);
          setUser(userData);
          setLogin(true);
          setRole("Faculty");
          sessionStorage.setItem("secureZilla_User", JSON.stringify(userData));
          handleClearForm();
          navigate("/faculty-dashboard");
          break;
        }
        case "Student": {
          toast.success(res.data.message);
          setUser(userData);
          setLogin(true);
          setRole("Student");
          sessionStorage.setItem("secureZilla_User", JSON.stringify(userData));
          handleClearForm();
          navigate("/student-dashboard");
          break;
        }
        default: {
          toast.error("Unsupported user role. Please contact support.");
          break;
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      let message = "Unknown Error";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          message =
            error.response.data?.message ||
            `Login failed with status ${error.response.status}`;
        } else if (error.request) {
          message = "Network error: unable to reach the authentication server.";
        } else {
          message = error.message || "Network error during login";
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="logo"
            src={secure}
            className="mx-auto h-24 w-auto rounded-full bg-[var(--background)] p-2"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            onReset={handleClearForm}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-200"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <button
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                    onClick={(e) => {
                      e.preventDefault();
                      setForgetModal(true);
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  required
                  disabled={isLoading}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 disabled:cursor-not-allowed disabled:bg-gray-200"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? "Logging" : "Login"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?
            <Link
              to={"/register"}
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>

      {showMFA && (
        <MFAVerification
          email={mfaEmail}
          onSuccess={handleMFASuccess}
          onCancel={handleMFACancel}
        />
      )}
      {isForgetModal && <Forgetpass onclose={() => setForgetModal(false)} />}
    </>
  );
};

export default Login;
