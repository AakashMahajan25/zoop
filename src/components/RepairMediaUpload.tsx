'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface UploadedFile {
  name: string;
  size: string;
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'pdf';
}

const RepairMediaUpload = () => {
  // State for media uploads
  const [repairPhotos, setRepairPhotos] = useState<UploadedFile[]>([]);
  const [repairVideos, setRepairVideos] = useState<UploadedFile[]>([]);
  const [billUpload, setBillUpload] = useState<UploadedFile[]>([]);
  const [dischargeCopy, setDischargeCopy] = useState<UploadedFile[]>([]);
  
  // UI state
  const [expandedPhotos, setExpandedPhotos] = useState(false);
  const [expandedVideos, setExpandedVideos] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isDragging, setIsDragging] = useState<'photo' | 'video' | null>(null);
  
  // Upload progress and status
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: 'success' | 'error' | 'uploading';
  }>({});
  
  // Validation errors
  const [errors, setErrors] = useState({
    photos: '',
    videos: '',
    billUpload: '',
    dischargeCopy: ''
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const billInputRef = useRef<HTMLInputElement>(null);
  const dischargeInputRef = useRef<HTMLInputElement>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  
  // OTP and routing
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  // File validation
  const validateFile = (file: File, type: 'photo' | 'video' | 'document'): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const validDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (type === 'photo' && !validImageTypes.includes(file.type)) {
      return 'Only JPEG, PNG, GIF, and WebP files are allowed for photos';
    }
    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      return 'Only MP4, WebM, and OGG files are allowed for videos';
    }
    if (type === 'document' && !validDocumentTypes.includes(file.type)) {
      return 'Only PDF, JPEG, and PNG files are allowed';
    }
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  // Process uploaded files
  const processFiles = (
    files: File[],
    type: 'photo' | 'video' | 'document',
    setState: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    errorField: string
  ) => {
    const validFiles: UploadedFile[] = [];
    const newErrors = { ...errors };

    files.forEach((file) => {
      const validationError = validateFile(file, type);
      if (validationError) {
        setUploadStatus((prev) => ({ ...prev, [file.name]: 'error' }));
        newErrors[errorField as keyof typeof errors] = validationError;
        setErrors(newErrors);
        return;
      }

      setUploadStatus((prev) => ({ ...prev, [file.name]: 'uploading' }));
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadStatus((prev) => ({ ...prev, [file.name]: 'success' }));
        }
        setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
      }, 200);

      const preview = type === 'document' && file.type !== 'application/pdf' 
        ? URL.createObjectURL(file) 
        : undefined;
      
      validFiles.push({
        name: file.name,
        size: formatFileSize(file.size),
        file,
        preview,
        type: file.type === 'application/pdf' ? 'pdf' : 
              file.type.startsWith('video/') ? 'video' : 'image'
      });
    });

    if (validFiles.length > 0) {
      setState(validFiles);
      newErrors[errorField as keyof typeof errors] = '';
      setErrors(newErrors);
    }
  };

  // Handle file upload
  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>, 
    type: 'photo' | 'video' | 'document',
    setState: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    errorField: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      processFiles(files, type, setState, errorField);
    }
    e.target.value = '';
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, type: 'photo' | 'video') => {
    e.preventDefault();
    setIsDragging(type);
  };

  const handleDragLeave = () => {
    setIsDragging(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>, 
    type: 'photo' | 'video',
    setState: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    errorField: string
  ) => {
    e.preventDefault();
    setIsDragging(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        type === 'photo'
          ? file.type.startsWith('image/')
          : file.type.startsWith('video/')
      );
      processFiles(files, type, setState, errorField);
    }
  };

  // Trigger file input
  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  // Remove file
  const handleRemove = (
    files: UploadedFile[],
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    index: number
  ) => {
    const newFiles = [...files];
    const removedFile = newFiles[index];
    if (removedFile.preview) {
      URL.revokeObjectURL(removedFile.preview);
    }
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[removedFile.name];
      return newProgress;
    });
    
    setUploadStatus((prev) => {
      const newStatus = { ...prev };
      delete newStatus[removedFile.name];
      return newStatus;
    });
  };

  // View file
  const handleView = (file: UploadedFile) => {
    if (!file.preview && file.type === 'pdf') {
      const fileUrl = URL.createObjectURL(file.file);
      window.open(fileUrl, '_blank');
      return;
    }

    if (file.preview) {
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        if (file.type === 'image') {
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
                <img src="${file.preview}" alt="${file.name}" />
              </body>
            </html>
          `);
        } else if (file.type === 'video') {
          previewWindow.document.write(`
            <html>
              <head>
                <title>${file.name}</title>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f5f5f5; }
                  video { max-width: 100%; max-height: 100%; }
                </style>
              </head>
              <body>
                <video controls>
                  <source src="${file.preview}" type="${file.file.type}">
                  Your browser does not support the video tag.
                </video>
              </body>
            </html>
          `);
        }
        previewWindow.document.close();
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // OTP handling
  const handleGetOtp = () => {
    const newErrors = {
      photos: repairPhotos.length === 0 ? 'At least one repair photo is required' : '',
      videos: '',
      billUpload: billUpload.length === 0 ? 'Bill upload is required' : '',
      dischargeCopy: dischargeCopy.length === 0 ? 'Discharge copy is required' : ''
    };
    setErrors(newErrors);

    if (!newErrors.photos && !newErrors.billUpload && !newErrors.dischargeCopy) {
      setOtpModal(true);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < 3 && inputs.current[index + 1]) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  // Clean up object URLs
  useEffect(() => {
    return () => {
      [...repairPhotos, ...repairVideos, ...billUpload, ...dischargeCopy].forEach((file) => {
        if (file.preview) {
          try {
            URL.revokeObjectURL(file.preview);
          } catch (e) {
            // Silent fail if URL is already revoked
          }
        }
      });
    };
  }, [repairPhotos, repairVideos, billUpload, dischargeCopy]);

  // Countdown for success modal
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (successModal) {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [successModal, router]);

  // File card component
  const UploadedFileCard = ({
    fileName,
    fileSize,
    progress,
    status,
    onRemove,
    file,
    onView,
  }: {
    fileName: string;
    fileSize: string;
    progress?: number;
    status?: 'success' | 'error' | 'uploading';
    onRemove: () => void;
    file: UploadedFile;
    onView: (file: UploadedFile) => void;
  }) => {
    return (
      <div className="border border-[#DBDADE] rounded-md p-3 relative mt-2 bg-[#F8FAFC]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-lg">
              {file.type === 'pdf' ? (
                <img src="/assets/pdfIcon.svg" alt="PDF" className="w-6 h-6 my-2" />
              ) : (
                <img src="/assets/uploadIcon.png" alt="upload" className="w-6 h-6 my-2" />
              )}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-700 truncate max-w-[160px]">
                {fileName}
              </p>
              <p className="text-xs text-gray-500">{fileSize}</p>
            </div>
          </div>
          {status === 'success' && (
            <img src="/assets/tick-circle.svg" alt="tick-circle" className="w-6 h-6 my-2" />
          )}
        </div>
        {progress !== undefined && (
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-[#21FF91]'}`}
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

  // Upload section component
  const UploadSection = ({
    title,
    description,
    accept,
    files,
    setFiles,
    error,
    inputRef,
    type,
    errorField
  }: {
    title: string;
    description: string;
    accept: string;
    files: UploadedFile[];
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
    error: string;
    inputRef: React.RefObject<HTMLInputElement>;
    type: 'photo' | 'video' | 'document';
    errorField: string;
  }) => {
    return (
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1">{title}</label>
        <div
          className={`cursor-pointer flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed rounded-md transition-colors ${
            isDragging === type ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-green-400'
          } ${error ? 'border-red-500' : ''}`}
          onClick={() => triggerFileInput(inputRef)}
          onDragOver={(e) => type !== 'document' ? handleDragOver(e, type) : e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={(e) => type !== 'document' ? handleDrop(e, type, setFiles, errorField) : e.preventDefault()}
        >
          <div className="flex flex-col items-center">
            <img src="/assets/uploadIcon.png" alt="upload" className="w-6 h-6 my-2" />
            <span className="text-[#828282] text-[10px]">Click to upload</span>
            <span className="text-[10px] text-[#828282]">
              {description}
            </span>
            <span className="text-[8px] text-[#828282] text-center">Or</span>
            <span className="text-[10px] text-[#1E1E1E] text-center">
              Upload from Camera
            </span>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1 flex gap-2">
            <img src="/assets/errorIIcon.svg" alt="errorIIcon" />
            {error}
          </p>
        )}
        {files.length > 0 && (
          <div className="mt-2 space-y-2">
            {files.map((file, idx) => (
              <UploadedFileCard
                key={`${type}-${idx}`}
                fileName={file.name}
                fileSize={file.size}
                progress={uploadProgress[file.name]}
                status={uploadStatus[file.name]}
                onRemove={() => handleRemove(files, setFiles, idx)}
                file={file}
                onView={handleView}
              />
            ))}
          </div>
        )}
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => handleFileUpload(e, type, setFiles, errorField)}
          accept={accept}
          multiple={type !== 'document'}
          className="hidden"
        />
      </div>
    );
  };

  return (
<div className="max-w-md sm:max-w-2xl lg:max-w-none w-full mx-auto px-4 py-6 pb-20">
      <div className="text-center mb-6">
        <Image
          src="/assets/logo.svg"
          alt="Zoop Logo"
          width={100}
          height={50}
          className="mx-auto"
        />
        <p className="text-sm text-[#4B465C] my-4">Claim Reference ID #IAR-1234-12345</p>
      </div>

      {!otpModal && (
        <>
        <div className='mx-20'>
          <h2 className="text-lg lg:text-xl font-medium mt-2 text-center lg:text-left">
  Upload Under Repairing Media
</h2>
<p className="text-xs lg:text-sm text-[#726E7D] mt-1 text-center lg:text-left max-w-[350px] lg:max-w-full lg:mx-0 mx-auto">
  Share under repair photos or a short video showing progress.
</p>
        </div>
          <div className='max-h-[700px] lg:max-h-[800px] lg:flex lg:items-center lg:justify-around overflow-auto pb-40 lg:pb-20 mt-6 gap-6'>
            {/* Repair Photos */}
            <UploadSection
              title="Repair Photo"
              description="Upload JPEG, PNG, GIF, or WebP (MAX 5 MB)"
              accept="image/jpeg,image/png,image/gif,image/webp"
              files={repairPhotos}
              setFiles={setRepairPhotos}
              error={errors.photos}
              //@ts-ignore
              inputRef={fileInputRef}
              type="photo"
              errorField="photos"
            />

            {/* Repair Videos */}
            <UploadSection
              title="Repair Video"
              description="Upload MP4, WebM, or OGG (MAX 5 MB)"
              accept="video/mp4,video/webm,video/ogg"
              files={repairVideos}
              setFiles={setRepairVideos}
              error={errors.videos}
              //@ts-ignore
              inputRef={videoInputRef}
              type="video"
              errorField="videos"
            />
<UploadSection
                title="Total Bill"
                description="Upload PDF, JPG, or PNG (MAX 5 MB)"
                accept=".pdf,.jpg,.jpeg,.png"
                files={billUpload}
                setFiles={setBillUpload}
                error={errors.billUpload}
                //@ts-ignore
                inputRef={billInputRef}
                type="document"
                errorField="billUpload"
              />

              {/* Discharge Copy */}
              <UploadSection
                title="Discharge Copy"
                description="Upload PDF, JPG, or PNG (MAX 5 MB)"
                accept=".pdf,.jpg,.jpeg,.png"
                files={dischargeCopy}
                setFiles={setDischargeCopy}
                error={errors.dischargeCopy}
                //@ts-ignore
                inputRef={dischargeInputRef}
                type="document"
                errorField="dischargeCopy"
              />

            <div className="fixed w-full bottom-0 left-0 px-8 py-4 flex flex-row gap-4 bg-white lg:flex-row lg:justify-end lg:items-center">
  <button className="w-full lg:w-auto px-6 py-2 bg-[#E0E0E0] text-[#4B465C] rounded-md hover:bg-[#D0D0D0] transition lg:py-3">
    Cancel
  </button>
  <button
    onClick={handleGetOtp}
    className={`w-full lg:w-auto px-6 py-2 text-white rounded-md transition ${
      repairPhotos.length > 0 && billUpload.length > 0 && dischargeCopy.length > 0
        ? 'bg-black text-[#21FF91] hover:bg-gray-800'
        : 'bg-gray-400 cursor-not-allowed'
    } lg:py-3`}
    disabled={
      repairPhotos.length === 0 || billUpload.length === 0 || dischargeCopy.length === 0
    }
  >
    Submit
  </button>
</div>

          </div>
        </>
      )}

      {otpModal && (
        <div className="max-w-md lg:max-w-lg mx-auto px-6 pt-4 text-center">
          <h2 className="text-lg lg:text-xl font-medium text-[#4B465C]">Enter OTP</h2>
          <p className="text-sm lg:text-base mt-1 text-[#726E7D]">
            We've sent a 4-digit OTP to your registered mobile number <br />
            (+91-XXXXXX1234)
          </p>
          <div className="flex justify-center gap-4 mt-8 lg:mt-12 mb-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                //@ts-ignore
                ref={(el) => (inputs.current[idx] = el)}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="w-12 h-12 lg:w-14 lg:h-14 text-center border border-gray-300 rounded-md text-lg lg:text-xl focus:outline-none focus:ring-2 focus:ring-[#21FF91]"
              />
            ))}
          </div>
          <p className="text-sm lg:text-base text-[#4B465C]">
            Didn't receive it?{' '}
            <span className="text-[#21FF91] underline cursor-pointer">Resend OTP</span>
          </p>
          <div className="fixed bottom-4 left-0 w-full px-6 lg:max-w-lg lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <button
              disabled={!isOtpComplete}
              onClick={() => setSuccessModal(true)}
              className={`w-full py-3 lg:py-4 rounded-md text-sm lg:text-base font-medium transition ${
                isOtpComplete
                  ? 'bg-black text-[#21FF91]'
                  : 'bg-[#00000014] text-gray-400 cursor-not-allowed'
              }`}
            >
              Complete Claim Process
            </button>
          </div>
        </div>
      )}

      {successModal && (
        <div className="fixed inset-0 bg-[#00000033] flex items-center justify-center z-50">
          <div className="flex flex-col justify-center items-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] p-6 bg-white rounded-lg max-w-md lg:max-w-lg text-center space-y-3">
            <div className="flex items-center justify-center">
              <div className="relative w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] rounded-full flex items-center justify-center shadow-[0_0_30px_#CFFCE9]">
                <div className="z-10 w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full flex items-center justify-center">
                  <img src="/assets/otpSuccessIcon.svg" alt="otpSuccessIcon" className="lg:w-16 lg:h-16" />
                </div>
              </div>
            </div>
            <h2 className="text-[#484848] text-lg lg:text-xl font-semibold">Claim Process Completed!</h2>
            <p className="text-sm lg:text-base text-[#4B4B4B]">
              Thank you! Your claim has been submitted successfully. Our team will reach out if anything else is needed.
            </p>
            <p className="text-sm lg:text-base text-[#726E7D] mb-2">
              You'll be redirected in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairMediaUpload;