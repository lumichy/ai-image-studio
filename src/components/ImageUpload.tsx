'use client';

import { useState } from 'react';

interface ImageUploadProps {
  onUpload: (base64: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        参考图片
      </label>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="参考图预览"
            className="w-full max-h-48 object-contain rounded-lg border border-gray-200"
          />
          <button
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            onClick={() => {
              setPreview(null);
              onUpload('');
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <span className="text-gray-400">点击上传参考图片</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
