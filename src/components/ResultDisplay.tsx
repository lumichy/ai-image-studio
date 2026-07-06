'use client';

interface ResultDisplayProps {
  imageUrl: string | null;
  error: string | null;
  prompt?: string;
}

export default function ResultDisplay({ imageUrl, error, prompt }: ResultDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {error ? (
        <div className="text-red-500 text-center">
          <p className="font-medium">生成失败</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : imageUrl ? (
        <div className="flex flex-col items-center gap-4 w-full">
          {prompt && (
            <div className="w-full bg-gray-50 rounded-lg p-3 text-sm text-gray-600 max-h-32 overflow-y-auto">
              <span className="font-medium text-gray-700">提示词：</span>
              <span className="ml-1">{prompt}</span>
            </div>
          )}
          <img
            src={imageUrl}
            alt="生成结果"
            className="max-w-full max-h-[500px] rounded-lg shadow-lg"
          />
          <a
            href={imageUrl}
            download="generated-image.png"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            下载图片
          </a>
        </div>
      ) : (
        <div className="text-gray-300 text-center">
          <p className="text-lg">生成的图片将显示在这里</p>
        </div>
      )}
    </div>
  );
}
