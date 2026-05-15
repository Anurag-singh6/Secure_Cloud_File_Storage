import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ImCamera } from "react-icons/im";
import api from "../../config/Api";
import toast from "react-hot-toast";
import ResetFacultypass from "../facultyDashboard/facultyModels/modals/ResetFacultypass";
import MFASetup from "../MFASetup";

const FacultyProfile = () => {
  const { user, setUser } = useAuth();

  const [isResetModal, setResetModel] = useState(false);
  const [preview, setpreview] = useState("");
  const [showMFASetup, setShowMFASetup] = useState(false);

  const changephoto = async (photo) => {
    const form_data = new FormData();

    form_data.append("image", photo);

    try {
      const res = await api.patch("/user/changePhoto", form_data);

      toast.success(res.data.message);
      setUser(res.data.data);
      sessionStorage.setItem("secureZilla_User", JSON.stringify(res.data.data));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unknown Error");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const newPhotoURL = URL.createObjectURL(file);
    console.log(newPhotoURL);
    setpreview(newPhotoURL);
    changephoto(file);
  };

  const handleDisableMFA = async () => {
    const token = prompt("Enter your MFA code to disable 2FA:");
    if (!token) return;

    try {
      const response = await api.post("/mfa/disable", { token });
      if (response.data.data) {
        toast.success("MFA disabled successfully");
        setUser({ ...user, mfaEnabled: false });
        sessionStorage.setItem(
          "secureZilla_User",
          JSON.stringify({ ...user, mfaEnabled: false })
        );
      }
    } catch (error) {
      toast.error("Failed to disable MFA");
      console.error("MFA disable error:", error);
    }
  };

  const handleMFASetupSuccess = () => {
    setUser({ ...user, mfaEnabled: true });
    sessionStorage.setItem(
      "secureZilla_User",
      JSON.stringify({ ...user, mfaEnabled: true })
    );
  };
  return (
    <>
      <div className="bg-[var(--accent)]/10 rounded-lg shadow-md p-6 sm:p-8 min-h-[90vh]">
        <div className="flex flex-col lg:flex-row justify-between gap-6 border p-4 sm:p-6 rounded-3xl items-center lg:items-start border-[var(--secondary)] bg-white">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start w-full lg:w-1/2">
            {/* Profile Image */}
            <div className="relative">
              <div className="border-4 border-[var(--primary)] rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 overflow-hidden shadow-md">
                <img
                  src={preview || user?.photo?.url}
                  alt="profile-image"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 border bg-white p-2 rounded-full group cursor-pointer hover:shadow-md">
                <label
                  htmlFor="imageUpload"
                  className="text-[var(--secondary)] group-hover:text-[var(--text-dark)] transition-colors"
                >
                  <ImCamera />
                </label>
                <input
                  type="file"
                  name="imageUpload"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <div className="text-xl sm:text-2xl md:text-3xl text-[var(--primary)] font-bold">
                {user.name}
              </div>
              <div className="text-[var(--text-dark)] text-sm sm:text-base md:text-lg font-semibold">
                {user.email}
              </div>
              <div className="text-[var(--text-dark)] text-sm sm:text-base md:text-lg font-semibold">
                {user.phoneno}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="flex flex-col gap-4 w-full lg:w-1/2">
            {/* Reset Password */}
            <button
              className="px-4 py-2 rounded-lg font-semibold bg-[var(--primary)] text-[var(--text-primary)] cursor-pointer transition duration-300 ease-in-out hover:bg-[var(--primary-hover)] shadow-md"
              onClick={() => setResetModel(true)}
            >
              Reset Password
            </button>

            {/* MFA Section */}
            <div className="border-t pt-3 mt-3">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--primary)] mb-2">
                Security Settings
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-[var(--text-dark)]">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.mfaEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                {user?.mfaEnabled ? (
                  <button
                    onClick={handleDisableMFA}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => setShowMFASetup(true)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isResetModal && (
        <ResetFacultypass onclose={() => setResetModel(false)} />
      )}
      {showMFASetup && (
        <MFASetup
          onClose={() => setShowMFASetup(false)}
          onSuccess={handleMFASetupSuccess}
        />
      )}
    </>
  );
};

export default FacultyProfile;
