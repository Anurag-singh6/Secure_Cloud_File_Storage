import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api"

const MFAVerification = ({ email, onSuccess, onCancel }) => {
  const [token, setToken] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const code = useBackupCode ? backupCode : token;

    if (!code.trim()) {
      toast.error(`Please enter ${useBackupCode ? "backup code" : "6-digit code"}`);
      return;
    }

    if (!useBackupCode && code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/mfa/verify", {
        email,
        [useBackupCode ? "backupCode" : "token"]: code
      });

      if (response.data.data) {
        toast.success("Login successful!");
        onSuccess && onSuccess(response.data.data);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Verification failed";
      toast.error(errorMsg);
      console.error("MFA verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Multi-Factor Authentication
          </h2>
          <p className="text-sm text-gray-600">
            Enter the code from your authenticator app
          </p>
        </div>

        <div className="space-y-4">
          {!useBackupCode ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                6-digit code:
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                maxLength={6}
                autoFocus
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup code:
              </label>
              <input
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                placeholder="ABCD1234"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono"
                maxLength={8}
              />
            </div>
          )}

          <div className="flex items-center justify-center">
            <button
              onClick={() => setUseBackupCode(!useBackupCode)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {useBackupCode ? "Use authenticator code instead" : "Use backup code instead"}
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={loading || (!useBackupCode && token.length !== 6) || (useBackupCode && !backupCode.trim())}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MFAVerification;