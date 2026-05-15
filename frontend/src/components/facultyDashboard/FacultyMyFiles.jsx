import React, { useEffect, useState } from "react";
import { FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../config/Api";
import { useAuth } from "../../context/AuthContext";
import CryptoJS from "crypto-js";

const FacultyMyFiles = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState(null);
  const [storageLoading, setStorageLoading] = useState(false);

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  // Fetch user files on component mount
  useEffect(() => {
    fetchUserFiles();
    fetchStorageInfo();
  }, []);

  const fetchUserFiles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/files");
      if (res.data.data) {
        setUploadedFiles(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      setStorageLoading(true);
      const res = await api.get("/files/storage/info");
      if (res.data.data) {
        setStorageInfo(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching storage info:", err);
    } finally {
      setStorageLoading(false);
    }
  };

  const isStorageFull = storageInfo && storageInfo.availableStorage <= 0;

  // AES-256 Encryption utilities
  const generateEncryptionKey = () => {
    return CryptoJS.lib.WordArray.random(32).toString(); // 256-bit key
  };

  const generateIV = () => {
    return CryptoJS.lib.WordArray.random(16).toString(); // 128-bit IV
  };

  const encryptFile = (fileBuffer, key, iv) => {
    const wordArray = CryptoJS.lib.WordArray.create(fileBuffer);
    const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  };

  const decryptFile = (encryptedData, key, iv) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Latin1);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const oversized = selectedFiles.filter((file) => file.size > MAX_SIZE);

    if (oversized.length > 0) {
      toast.error(
        `Some files exceed 10MB: ${oversized.map((f) => f.name).join(", ")}`
      );
      return;
    }

    setFiles([...files, ...selectedFiles]);
    toast.success(`${selectedFiles.length} file(s) added`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const oversized = droppedFiles.filter((file) => file.size > MAX_SIZE);

    if (oversized.length > 0) {
      toast.error(
        `Some files exceed 10MB: ${oversized.map((f) => f.name).join(", ")}`
      );
      return;
    }

    setFiles([...files, ...droppedFiles]);
    toast.success(`${droppedFiles.length} file(s) added`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    if (isStorageFull) {
      toast.error(
        "Your storage is full. Delete some files to upload new ones."
      );
      return;
    }

    const uploaded = [];

    for (let file of files) {
      try {
        // Generate encryption key and IV for this file
        const encryptionKey = generateEncryptionKey();
        const encryptionIV = generateIV();

        // Read file as ArrayBuffer
        const fileBuffer = await file.arrayBuffer();

        // Encrypt the file data
        const encryptedData = encryptFile(
          fileBuffer,
          encryptionKey,
          encryptionIV
        );

        // Convert encrypted data back to Blob
        const encryptedBlob = new Blob([encryptedData], { type: file.type });

        // Create FormData with encrypted file
        const formData = new FormData();
        formData.append("file", encryptedBlob, file.name);
        formData.append("filename", file.name);
        formData.append("fileType", file.type);
        formData.append("encryptionKey", encryptionKey);
        formData.append("encryptionIV", encryptionIV);

        const res = await api.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress((prev) => ({ ...prev, [file.name]: percent }));
          },
        });

        if (res.data.data) {
          uploaded.push(res.data.data);
          toast.success(`${file.name} uploaded and encrypted successfully`);
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || `Upload failed for ${file.name}`;
        toast.error(errorMsg);
        console.error("Upload error:", err);
        setError(errorMsg);
      }
    }

    if (uploaded.length > 0) {
      setUploadedFiles([...uploadedFiles, ...uploaded]);
      setFiles([]);
      setProgress({});
      // Refresh storage info
      fetchStorageInfo();
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      // Get download URL and encryption keys from backend
      const res = await api.get(`/files/download/${fileId}`);
      const { url, encryptionKey, encryptionIV } = res.data.data;

      // Fetch the encrypted file
      const response = await fetch(url);
      const encryptedData = await response.text();

      // Decrypt the file
      const decryptedData = decryptFile(
        encryptedData,
        encryptionKey,
        encryptionIV
      );

      // Convert decrypted data back to blob
      const blob = new Blob([decryptedData], {
        type: "application/octet-stream",
      });

      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      toast.success(`${filename} downloaded and decrypted successfully`);
    } catch (err) {
      toast.error("Failed to download file");
      console.error("Download error:", err);
    }
  };

  const renderFilePreview = (file) => {
    const fileType = file.fileType || file.type || "";
    if (fileType.includes("image")) {
      return (
        <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
          <div className="text-center">
            <FaFileAlt className="text-4xl mx-auto mb-2" />
            <p>Encrypted Image</p>
            <p className="text-xs">Preview disabled for security</p>
          </div>
        </div>
      );
    } else if (fileType.includes("pdf")) {
      return <FaFilePdf className="text-red-600 text-6xl mx-auto my-6" />;
    } else if (
      fileType.includes("word") ||
      file.filename?.endsWith(".doc") ||
      file.filename?.endsWith(".docx")
    ) {
      return <FaFileWord className="text-blue-600 text-6xl mx-auto my-6" />;
    } else {
      return <FaFileAlt className="text-gray-600 text-6xl mx-auto my-6" />;
    }
  };

  const filteredFiles = uploadedFiles.filter(
    (file) =>
      (file.filename || file.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (file.fileType || file.type || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-gray-900">
          Dashboard File Upload
        </h1>

        {/* Security Notice */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start sm:items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1L3 4v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V4l-7-3zM9 13l-4-4 1.5-1.5L9 10.5 14.5 5 16 6.5 9 13z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm sm:text-base font-medium text-blue-800">
                End-to-End Encryption
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-blue-700">
                All files are encrypted with AES-256 before upload. Your files
                are secure and can only be decrypted by you.
              </p>
            </div>
          </div>
        </div>

        {/* Storage Info */}
        {storageInfo && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Storage Usage
              </h2>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                {storageInfo.usagePercentage}% Used
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all ${
                  isStorageFull ? "bg-red-600" : "bg-blue-600"
                }`}
                style={{ width: `${storageInfo.usagePercentage}%` }}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-600 mt-2 gap-1">
              <span>
                {storageInfo.usedStorageGB} GB / {storageInfo.totalStorageGB} GB
                used
              </span>
              <span>{storageInfo.availableStorageGB} GB available</span>
            </div>
            {isStorageFull && (
              <p className="text-xs text-red-600 mt-2 font-semibold">
                ⚠️ Storage is full. Please delete files to upload new ones.
              </p>
            )}
          </div>
        )}

        {/* Drag-and-drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`mb-6 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            dragActive
              ? "border-blue-600 bg-blue-50"
              : "border-gray-400 bg-white"
          }`}
        >
          <p className="text-sm sm:text-base text-gray-600">
            Drag & drop files here, or use the file picker below
          </p>
        </div>

        {/* File picker + upload button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100"
          />
          <button
            onClick={handleUpload}
            disabled={isStorageFull}
            className={`px-4 py-2 text-white rounded text-sm sm:text-base ${
              isStorageFull
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isStorageFull ? "Storage Full" : "Upload"}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-600 font-semibold text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Progress bars */}
        {files.length > 0 && (
          <div className="mb-6">
            {files.map((file) => (
              <div key={file.name} className="mb-2">
                <p className="text-xs sm:text-sm">{file.name}</p>
                <div className="w-full bg-gray-300 rounded h-2">
                  <div
                    className="bg-blue-600 h-2 rounded"
                    style={{ width: `${progress[file.name] || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {progress[file.name] || 0}% uploaded
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Search input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search uploaded files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
        </div>

        {/* Uploaded files */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading files...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No files uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file._id}
                className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col"
              >
                {renderFilePreview(file)}
                <p className="text-xs sm:text-sm p-2 break-all">
                  {file.filename || file.name}
                </p>
                <p className="text-xs sm:text-sm px-2 text-gray-500">
                  {(file.fileSize / 1024).toFixed(2)} KB
                </p>
                <div className="flex flex-col sm:flex-row justify-between gap-2 px-2 pb-2">
                  <button
                    onClick={() => handleDownload(file._id, file.filename)}
                    className="flex-1 px-3 py-1 text-xs sm:text-sm text-center bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="flex-1 px-3 py-1 text-xs sm:text-sm text-center bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FacultyMyFiles;
