import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/Api"

const MFASetup = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Setup, 2: Verify
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetupMFA = async () => {
    try {
      setLoading(true);
      const response = await api.post("/mfa/setup");

      if (response.data.data) {
        setQrCode(response.data.data.qrCode);
        setSecret(response.data.data.secret);
        setBackupCodes(response.data.data.backupCodes);
        setStep(2);
        toast.success("MFA setup initiated");
      }
    } catch (error) {
      toast.error("Failed to setup MFA");
      console.error("MFA setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!token.trim()) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/mfa/verify-setup", { token });

      if (response.data.data) {
        toast.success("MFA enabled successfully!");
        onSuccess && onSuccess();
        onClose && onClose();
      }
    } catch (error) {
      toast.error("Invalid MFA code. Please try again.");
      console.error("MFA verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 1 ? "Setup Multi-Factor Authentication" : "Verify Setup"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Multi-Factor Authentication (MFA)</strong> adds an extra layer of security to your account.
              </p>
              <p>You'll need an authenticator app like:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Google Authenticator</li>
                <li>Microsoft Authenticator</li>
                <li>Authy</li>
                <li>1Password</li>
              </ul>
            </div>

            <button
              onClick={handleSetupMFA}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Setup MFA"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app:
              </p>
              {qrCode && (
                <img
                  src={qrCode}
                  alt="MFA QR Code"
                  className="mx-auto border rounded"
                />
              )}
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">Or manually enter this code:</p>
              <div className="bg-gray-100 p-2 rounded font-mono text-xs break-all">
                {secret}
                <button
                  onClick={() => copyToClipboard(secret)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  📋
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the 6-digit code from your app:
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleVerifyMFA}
              disabled={loading || token.length !== 6}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Enable MFA"}
            </button>

            {backupCodes.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  ⚠️ Save your backup codes!
                </h3>
                <p className="text-xs text-yellow-700 mb-2">
                  These codes can be used if you lose access to your authenticator app.
                  Store them securely and don't share them.
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white p-1 rounded text-center">
                      {code}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(backupCodes.join("\n"))}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy all codes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MFASetup;