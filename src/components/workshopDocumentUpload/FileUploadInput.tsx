import React, { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import FilePreview from "./FilePreview";

interface FileUploadInputProps {
  index: number;
  setFiles: React.Dispatch<React.SetStateAction<File[][]>>;
  filesArray: File[][];
  label: string;
  errors?: string[];
  onDrop?: (index: number, files: File[]) => void;
}

interface UploadedFileCardProps {
  fileName: string;
  fileSize?: string;
  progress?: number;
  status?: "success" | "error" | "uploading";
  onRemove: () => void;
  file: File | { name: string; url: string; type?: string };
  onView: (file: any) => void;
}

const UploadedFileCard: React.FC<UploadedFileCardProps> = ({
  fileName,
  fileSize,
  progress,
  status,
  onRemove,
  file,
  onView,
}) => {
  // build preview object for FilePreview
  const previewFile = {
    name: fileName,
    url: file instanceof File ? URL.createObjectURL(file) : "",
    type: file.type || "",
  };

  return (
    <div className="border border-[#DBDADE] rounded-md p-3 relative mt-2 bg-[#F8FAFC]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium text-gray-700 truncate max-w-[160px]">{fileName}</p>
            <p className="text-xs text-gray-500">{fileSize}</p>
          </div>
        </div>
        {status === "success" && (
          <img src="/assets/tick-circle.svg" alt="tick-circle" className="w-6 h-6 my-2" />
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
            onView(file);
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

const FileUploadInput: React.FC<FileUploadInputProps> = ({ 
  index, 
  setFiles, 
  filesArray, 
  label, 
  errors = [], 
  onDrop 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'success' | 'error' | 'uploading'}>({});
  const [showPreviewError, setShowPreviewError] = useState(false);

  const validateFile = (file: File): string | null => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.some(type => file.type.includes(type))) {
      return 'Only PDF, JPEG, PNG, GIF, and WebP files are allowed';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      processFiles(newFiles);
      e.target.value = '';
    }
  };

  const processFiles = (files: File[]) => {
    files.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        return;
      }

      setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
        }
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
      }, 200);
    });

    const validFiles = files.filter(file => !validateFile(file));
    if (validFiles.length > 0) {
      const newFileArray = [...filesArray];
      newFileArray[index] = [...(newFileArray[index] || []), ...validFiles];
      setFiles(newFileArray);
    }
  };

  const handleRemoveFile = (fileIndex: number) => {
    const newFileArray = [...filesArray];
    const removedFile = newFileArray[index].splice(fileIndex, 1)[0];
    setFiles(newFileArray);
    
    if (removedFile) {
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[removedFile.name];
        return newProgress;
      });
      setUploadStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[removedFile.name];
        return newStatus;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (onDrop) {
        onDrop(index, newFiles);
      } else {
        processFiles(newFiles);
      }
    }
  };

  const handleViewFile = (file: File) => {
    if (file.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write(`
            <html>
              <head>
                <title>${file.name}</title>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5; }
                  img { max-width: 100%; max-height: 100%; object-fit: contain; }
                </style>
              </head>
              <body>
                <img src="${imageUrl}" alt="${file.name}" />
              </body>
            </html>
          `);
          previewWindow.document.close();
        }
      };
      reader.readAsDataURL(file);
    } else if (file.type.includes('pdf')) {
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, '_blank');
    } else {
      setShowPreviewError(true);
    }
  };

  const handleClosePreviewError = () => {
    setShowPreviewError(false);
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      
      {(!filesArray[index] || filesArray[index].length === 0) ? (
        <label 
          className={`cursor-pointer flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed rounded-md transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-green-400'
          } ${errors[index] ? 'border-red-500' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <img src="/assets/uploadIcon.png" alt="upload" className="w-6 h-6 my-2" />
            <span>
          <span className="text-[#828282] text-[10px]">Click to upload </span>
          {/* <span className="mb-2 text-[#3F3F46] text-[14px]">or Drag and Drop</span> */}
        </span>
        <span className="text-[10px] text-[#828282]">Upload Doc or PDF (MAX 5 MB)</span>
        <span className="text-[8px] text-[#828282] text-center">Or</span>
        <span className="text-[10px] text-[#1E1E1E] text-center">Upload from Camera</span>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            // capture="environment"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
            multiple
          />
        </label>
      ) : (
        <div className="mt-2 space-y-2"> 
          {filesArray[index].map((file, fileIndex) => (
            <UploadedFileCard
              key={fileIndex}
              fileName={file.name}
              fileSize={getFileSize(file.size)}
              progress={uploadProgress[file.name]}
              status={uploadStatus[file.name]}
              onRemove={() => handleRemoveFile(fileIndex)}
              file={file}
              onView={(f) => {
                if (f instanceof File) {
                  window.open(URL.createObjectURL(f));
                } else if (f && typeof f === "object" && "url" in f) {
                  window.open(f.url, "_blank");
                }
              }}
            />
          ))}
        </div>
      )}

      {errors[index] && (
        <p className="text-red-500 text-xs mt-1 flex gap-2"><img src='/assets/errorIIcon.svg' alt='errorIIcon'/>{errors[index]}</p>
      )}

      {/* Error Alert Snackbar */}
      <Snackbar
        open={showPreviewError}
        autoHideDuration={3000}
        onClose={handleClosePreviewError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClosePreviewError}
          severity="warning"
          variant="filled"
          className="shadow-lg"
        >
          This file type cannot be previewed
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FileUploadInput;