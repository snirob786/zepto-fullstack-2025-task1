import { useState } from "react";
import { uploadFont } from "../api";

export default function FontUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file.name.endsWith(".ttf")) return alert("Only .ttf allowed");

    const formData = new FormData();
    formData.append("font", file);

    setUploading(true);
    await uploadFont(formData);
    setUploading(false);
    onUpload();
  };

  return (
    <div className="my-4">
      <label className="block mb-1 font-semibold">
        Upload Font (.ttf only)
      </label>
      <input
        type="file"
        accept=".ttf"
        onChange={handleUpload}
        className="p-2 border rounded"
      />
      {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
    </div>
  );
}
