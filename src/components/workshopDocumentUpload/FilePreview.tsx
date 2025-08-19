import React from "react";

interface FilePreviewProps {
  file: { name: string; url: string; type?: string };
}

const FilePreview: React.FC<FilePreviewProps> = ({ file }) => {
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);
  const isPdf = /\.pdf$/i.test(file.name);

  if (isImage) {
    return (
      <div className="flex flex-col items-center">
        <img
          src={file.url}
          alt={file.name}
          className="w-20 h-20 object-cover border rounded"
        />
        <p className="text-xs mt-1 truncate max-w-[80px]">{file.name}</p>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 flex items-center justify-center bg-red-100 border rounded">
          <img src="/assets/pdf-icon.svg" alt="PDF" className="w-10 h-10" />
        </div>
        <p className="text-xs mt-1 truncate max-w-[80px]">{file.name}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border rounded">
        <span className="text-[10px]">FILE</span>
      </div>
      <p className="text-xs mt-1 truncate max-w-[80px]">{file.name}</p>
    </div>
  );
};

export default FilePreview;
