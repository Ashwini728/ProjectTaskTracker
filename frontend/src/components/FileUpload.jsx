// File: FileUpload.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

const FileUpload = ({ userId }) => {
  const [file, setFile] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const resetForm = () => {
    setFile(null);
    setTaskTitle('');
    setUploadedBy('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file || !taskTitle.trim() || !uploadedBy.trim()) {
      alert("❗ Please fill in all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskTitle", taskTitle.trim());
    formData.append("uploadedBy", uploadedBy.trim());
    formData.append("userId", userId || "unknown");

    try {
      setUploading(true);
      await axios.post("http://localhost:4000/api/uploads", formData);
      alert("✅ File uploaded successfully!");
      resetForm();
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-dark text-light rounded shadow-sm border border-secondary">
      <h5 className="mb-3 text-warning"> Upload Task File</h5>

      <input
        className="form-control mb-3 bg-secondary text-light border-0"
        type="text"
        placeholder="Your name"
        value={uploadedBy}
        onChange={(e) => setUploadedBy(e.target.value)}
      />

      <input
        className="form-control mb-3 bg-secondary text-light border-0"
        type="text"
        placeholder="Task title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />

      <input
        className="form-control mb-3 bg-secondary text-light border-0"
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="btn btn-outline-warning"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : '📤 Upload'}
      </button>
    </div>
  );
};

export default FileUpload;
