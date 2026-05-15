import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    message: "",
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
      message: "",
    });
  };

  const validate = () => {
    let Error = {};

    if (formData.name.length < 3) {
      Error.name = "Name should be more than 3 character";
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
      const res = await api.post("/public/contact", formData);
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
      <div className="min-h-screen bg-gradient-to-br from-[var(--accent)] to-[var(--background)] py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6 flex items-center justify-center">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 animate-slideUp">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)]">
              We’ll contact you shortly...!
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-[var(--accent)] rounded-xl shadow-2xl shadow-[var(--secondary)] overflow-hidden transform transition duration-500 hover:scale-[1.02]">
            <form
              onSubmit={handleSubmit}
              onReset={handleClearForm}
              className="p-4 sm:p-6 md:p-8 space-y-6"
            >
              {/* Personal Information */}
              <div className="space-y-4 sm:space-y-6">
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
                ].map((field) => (
                  <div key={field.name} className="animate-fadeIn delay-200">
                    <input
                      {...field}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-[var(--secondary)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition disabled:cursor-not-allowed disabled:bg-gray-200"
                    />
                    {validationError[field.name] && (
                      <span className="text-xs text-red-500">
                        {validationError[field.name]}
                      </span>
                    )}
                  </div>
                ))}

                {/* Message */}
                <div className="animate-fadeIn delay-300">
                  <textarea
                    name="message"
                    id="message"
                    rows="6"
                    onChange={handleChange}
                    required
                    value={formData.message}
                    placeholder="Write a message..."
                    disabled={isLoading}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-[var(--secondary)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition disabled:cursor-not-allowed disabled:bg-gray-200"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-[var(--text-primary)] font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:from-[var(--secondary)] hover:to-[var(--secondary-hover)] transition duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed disabled:bg-gray-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="reset"
                  disabled={isLoading}
                  className="flex-1 bg-[var(--accent)] text-[var(--text-dark)] font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-[var(--secondary)] hover:text-[var(--text-primary)] transition duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-200"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          {/* Footer Note */}
          <p className="text-center text-[var(--text-secondary)] mt-6 sm:mt-8 text-xs sm:text-sm">
            All fields marked are mandatory. We respect your privacy
          </p>
        </div>
      </div>
    </>
  );
};

export default Contact;
