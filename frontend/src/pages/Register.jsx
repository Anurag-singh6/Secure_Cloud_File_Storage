import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../config/Api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    password: "",
    confirmpassword: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      email: "",
      phoneno: "",
      password: "",
      confirmpassword: "",
      role: "",
    });
  };

  const validate = () => {
    let Error = {};

    if (formData.name.length < 3) {
      Error.name = "Name should be more than 3 character.";
    } else {
      if (!/^[A-Za-z ]+$/.test(formData.name)) {
        Error.name = "Only Contain A-Z, a-z and space";
      }
    }

    if (
      !/^[\w\.]+@(gmail|outlook|yahoo)\.(com|in|co.in)$/.test(formData.email)
    ) {
      Error.email = "Use Proper Email Format";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phoneno)) {
      Error.phoneno = "Only Indian Mobile Number allowed";
    }

    if (formData.confirmpassword != formData.password) {
      Error.confirmpassword = "Reconfirm Password you type.";
    }

    if (!formData.role) {
      Error.role = "Role is required";
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
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message);
      handleClearForm();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-700 to-[var(--background)] py-6 px-4 flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-8 animate-slideUp">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-2">
              Registration
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-secondary)]">
              You are 1 step away to secure your Documents
            </p>
          </div>

          {/* Form Container */}
          <div className="flex justify-center">
            <div className="bg-[var(--accent)] w-full rounded-xl shadow-2xl shadow-[var(--secondary)] overflow-hidden transform transition duration-500 hover:scale-[1.02]">
              <form
                onSubmit={handleSubmit}
                onReset={handleClearForm}
                className="p-6 sm:p-8 space-y-6"
              >
                {/* Personal Info */}
                <div className="space-y-4">
                  {/* Role Selection */}
                  <div>
                    <div className="flex flex-wrap gap-4 mb-2 items-center">
                      <label className="text-[var(--text-dark)] font-semibold">
                        I am
                      </label>
                      {["Faculty", "Student"].map((role) => (
                        <div key={role} className="flex items-center gap-1">
                          <input
                            type="radio"
                            name="role"
                            id={role}
                            checked={formData.role === role}
                            value={role}
                            onChange={handleChange}
                            className="accent-[var(--primary)]"
                          />
                          <label
                            htmlFor={role}
                            className="text-[var(--text-dark)]"
                          >
                            {role}
                          </label>
                        </div>
                      ))}
                    </div>
                    {validationError.role && (
                      <span className="text-xs text-red-500">
                        {validationError.role}
                      </span>
                    )}
                  </div>

                  {/* Inputs */}
                  {[
                    { type: "text", name: "name", placeholder: "Full Name" },
                    {
                      type: "email",
                      name: "email",
                      placeholder: "Email Address",
                    },
                    {
                      type: "tel",
                      name: "phoneno",
                      placeholder: "Mobile Number",
                      maxLength: "10",
                    },
                    {
                      type: "password",
                      name: "password",
                      placeholder: "Create Password",
                    },
                    {
                      type: "password",
                      name: "confirmpassword",
                      placeholder: "Confirm Password",
                    },
                  ].map((field) => (
                    <div key={field.name} className="animate-fadeIn delay-200">
                      <input
                        {...field}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 border-2 border-[var(--secondary)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition disabled:cursor-not-allowed disabled:bg-gray-200"
                      />
                      {validationError[field.name] && (
                        <span className="text-xs text-red-500">
                          {validationError[field.name]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-[var(--text-primary)] font-bold py-3 px-6 rounded-lg hover:from-[var(--secondary)] hover:to-[var(--secondary-hover)] transition duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:bg-gray-200"
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    type="reset"
                    disabled={isLoading}
                    className="flex-1 bg-[var(--accent)] text-[var(--text-dark)] font-bold py-3 px-6 rounded-lg hover:bg-[var(--secondary)] hover:text-[var(--text-primary)] transition duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-200"
                  >
                    Clear Form
                  </button>
                </div>

                <p className="mt-8 text-center text-sm text-[var(--secondary)] font-bold">
                  Already a member?
                  <Link
                    to={"/login"}
                    className="font-semibold ml-1 text-[var(--primary)] hover:text-[var(--secondary)]"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Note */}
          <p className="text-center text-[var(--text-secondary)] mt-6 text-sm">
            All fields marked are mandatory. We respect your privacy
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
