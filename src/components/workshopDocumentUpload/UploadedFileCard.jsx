import React from "react";
import FilePreview from "./FilePreview"; //

const UploadedFileCard = ({
  fileName,
  fileSize,
  progress,
  status,
  onRemove,
  file,
}) => {
  // build a preview-friendly object for FilePreview
  let previewFile = { name: fileName, url: "", type: "" };

  if (file instanceof File) {
    previewFile = {
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    };
  } else if (file && typeof file === "object" && "url" in file) {
    previewFile = {
      name: fileName,
      url: file.url, // 
      type: file.type || "",
    };
  }

  const handleView = () => {
    if (file instanceof File) {
      window.open(URL.createObjectURL(file));
    } else if (file && typeof file === "object" && "url" in file) {
      window.open(file.url, "_blank");
    }
  };

  return (
    <div className="border border-[#DBDADE] rounded-md p-3 relative mt-2 bg-[#F8FAFC]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* ✅ Thumbnail here */}
          <FilePreview file={previewFile} />

          <div>
            <p className="text-sm font-medium text-gray-700 truncate max-w-[160px]">
              {fileName}
            </p>
            {fileSize && <p className="text-xs text-gray-500">{fileSize}</p>}
          </div>
        </div>
        {status === "success" && (
          <img
            src="/assets/tick-circle.svg"
            alt="tick-circle"
            className="w-6 h-6 my-2"
          />
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              status === "error" ? "bg-red-500" : "bg-[#21FF91]"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.preventDefault();
            handleView();
          }}
          className="text-[#0BEB7C] font-medium text-sm cursor-pointer"
        >
          Click to view
        </button>
        <button
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <img src="/assets/trash.svg" alt="trash" className="w-6 h-6 my-2" />
        </button>
      </div>
    </div>
  );
};

export default UploadedFileCard;