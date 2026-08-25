"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  currentUrl: string;
  onUploaded: (url: string) => void;
}

export default function ImageUpload({ currentUrl, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPreview(currentUrl); }, [currentUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large. Maximum 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setPreview(data.url);
      onUploaded(data.url);
    } catch {
      alert("Failed to upload image. Check console for details.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
      {preview && (
        <div className="w-40 h-24 relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
          <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && <span className="text-sm text-blue-600">Uploading...</span>}
      </div>
      <p className="text-xs text-slate-400">Upload JPG, PNG, GIF, WebP, or SVG (max 5MB).</p>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Or enter image URL</label>
        <input
          type="url"
          value={currentUrl}
          onChange={(e) => { setPreview(e.target.value); onUploaded(e.target.value); }}
          placeholder="https://example.com/image.png"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
      </div>
    </div>
  );
}