// DocumentUploadCard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import { Modal, Box, IconButton, Alert, Snackbar } from '@mui/material';

interface DocumentUploadCardProps {
  title: string;
  fieldName: string;
  className?: string;
  file: File | null;
  uploadedUrl?: string | null;
  onFileChange: (file: File | null) => void;
  initialFile?: File | null;
}

const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  title,
  fieldName,
  className = '',
  file: propFile,
  uploadedUrl,
  onFileChange,
  initialFile = null,
}) => {
  const [file, setFile] = useState<File | null>(propFile || initialFile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(uploadedUrl || null);
  const [openPreview, setOpenPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setFile(propFile);
  }, [propFile]);

  useEffect(() => {
    // If we have an uploaded URL, use it (document is already uploaded)
    if (uploadedUrl) {
      setPreviewUrl(uploadedUrl);
      return;
    }

    // Otherwise, if we have a file, create a preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }

    // No file and no uploaded URL
    setPreviewUrl(null);
  }, [file, uploadedUrl]);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const handleCloseError = () => {
    setShowError(false);
    setErrorMessage(null);
  };

  // Dropzone setup
  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    // Handle rejected files (validation failures)
    if (rejected.length > 0) {
      const rejectedFile = rejected[0];
      const errors = rejectedFile.errors;
      
      if (errors.some((error: any) => error.code === 'file-too-large')) {
        showErrorMessage('File size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }
      
      if (errors.some((error: any) => error.code === 'file-invalid-type')) {
        showErrorMessage('Invalid file type. Please upload only images (JPG, PNG) or PDF files.');
        return;
      }
      
      // Generic error message for other validation failures
      showErrorMessage('File upload failed. Please check the file and try again.');
      return;
    }

    // Handle accepted files
    const f = accepted[0] || null;
    if (f) {
      // Double-check file size (additional validation)
      if (f.size > 5 * 1024 * 1024) {
        showErrorMessage('File size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }
      
      setFile(f);
      onFileChange(f);
    }
  }, [onFileChange]);
 
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': [], 'application/pdf': [] },
    maxSize: 5 * 1024 * 1024,
  });

  const hasUploadedContent = file || uploadedUrl;
  const isImage = file?.type.startsWith('image/') || uploadedUrl?.includes('.jpg') || uploadedUrl?.includes('.png') || uploadedUrl?.includes('.jpeg');
  const isPdf = file?.type === 'application/pdf' || uploadedUrl?.includes('.pdf');

  return (
    <>
      <div className={`${className} relative group`}>
        <p className="font-medium mb-2">{title}</p>

        {!hasUploadedContent ? (
          <div
            {...getRootProps()}
            className={`
              cursor-pointer flex flex-col items-center justify-center h-40
              border-2 border-dashed rounded-md text-gray-400 transition-colors
              ${isDragActive
                ? 'border-green-600 bg-green-50'
                : 'border-gray-300 hover:border-green-600'}
            `}
          >
            <input {...getInputProps()} name={fieldName} />
            <img
              src="/assets/uploadIcon.png"
              alt="upload"
              className="w-6 h-6 my-4"
            />
            <span>
              <span className="text-[#18181B] font-semibold text-[14px]">
                Click to upload{' '}
              </span>
              <span className="mb-2 text-[#3F3F46] text-[14px]">
                or Drag and Drop
              </span>
            </span>
            <span className="text-[12px] text-[#828282]">
              Upload Doc or PDF (MAX 5 MB)
            </span>
          </div>
        ) : (
          <div className="relative h-40 overflow-hidden rounded-md border border-gray-300 transition-colors group-hover:border-[#EFEFEFE5]">
            {isImage && previewUrl && (
              <img
                src={previewUrl}
                alt={title}
                className="w-full h-full object-contain"
              />
            )}
            {isPdf && previewUrl && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center p-4">
                  <p className="font-medium">{file?.name || 'PDF Document'}</p>
                  <p className="text-sm text-gray-500">PDF Document</p>
                </div>
              </div>
            )}

            {/* hover overlay */}
            <div
              className="
                absolute inset-0
                bg-[#D5FFEA33]
                flex items-center justify-center gap-4
                opacity-0 transition-opacity duration-200
                group-hover:opacity-100
              "
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPreview(true);
                }}
                className="bg-white p-2 rounded-md shadow-md"
                title="View"
              >
                <VisibilityIcon className="text-gray-700" fontSize="small" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreviewUrl(null);
                  onFileChange(null);
                }}
                className="bg-white p-2 rounded-md shadow-md"
                title="Delete"
              >
                <DeleteIcon className="text-gray-700" fontSize="small" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          icon={<ErrorIcon />}
          className="shadow-lg"
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Full-page preview modal */}
      <Modal open={openPreview} onClose={() => setOpenPreview(false)}>
        <Box
          className="
            fixed inset-0 flex items-center justify-center
            bg-grey-400 bg-opacity-10 p-4
          "
        >
          <Box
            className="
              relative bg-white rounded-md overflow-auto
              max-w-[90vw] max-h-[90vh]
            "
          >
            <IconButton
              size="small"
              onClick={() => setOpenPreview(false)}
              className="absolute top-2 right-2"
            >
              <CloseIcon />
            </IconButton>

            {isImage && previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="max-w-[90vw] max-h-[90vh] mx-auto"
              />
            )}
            {isPdf && previewUrl && (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                className="w-[80vw] h-[80vh] block mx-auto"
              />
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DocumentUploadCard;
