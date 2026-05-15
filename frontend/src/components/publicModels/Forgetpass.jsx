import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../config/Api";

const Forgetpass = ({ onclose }) => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newpassword: "",
    confirmpass: "",
  });

  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setOtpVerified] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(formData);
      let res;
      if (isOtpSent) {
        if (isOtpVerified) {
          res = await api.post("/auth/forgetPassword", formData);
          toast.success(res.data.message);
          onclose();
        } else {
          res = await api.post("/auth/verifyOtp", formData);
          toast.success(res.data.message);
          setIsOtpSent(true);
          setOtpVerified(true);
        }
      } else {
        res = await api.post("/auth/genOtp", formData);
        toast.success(res.data.message);
        setIsOtpSent(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Unknown Error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100">
        <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
          <div className="flex justify-between px-6 py-4 border-b border-gray-300 items-center sticky top-0 bg-white">
            <h1 className="text-xl font-semibold text-gray-800">
              Forget Password
            </h1>
            <button
              onClick={() => onclose()}
              className="text-gray-600 hover:text-red-900 text-2xl transition"
            >
              ⊗
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-md shadow-sm p-2 disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your registered email"
                  disabled={isOtpSent}
                />
              </div>

              {isOtpSent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP *
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full border rounded-md shadow-sm p-2 disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter OTP recived in email"
                    disabled={isOtpVerified}
                  />
                </div>
              )}

              {isOtpSent && isOtpVerified && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newpassword"
                      value={formData.newpassword}
                      onChange={handleInputChange}
                      className="w-full border rounded-md shadow-sm p-2 disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      name="confirmpass"
                      value={formData.confirmpass}
                      onChange={handleInputChange}
                      className="w-full border rounded-md shadow-sm p-2 disabled:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex justify-center mt-5">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin"></span> Loading...
                  </>
                ) : isOtpSent ? (
                  isOtpVerified ? (
                    "Update Password"
                  ) : (
                    "Verify OTP"
                  )
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Forgetpass;