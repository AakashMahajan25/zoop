'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';

type Props = {
  url?: string | null;
  alt?: string;
  className?: string;
  previewImg?: string;
  height?: number | string;
  width?: number | string;
};

const DEFAULT_DOC_ICON = '/assets/fileIcon.svg';
const PDF_ICON = '/assets/pdfIcon.svg';
const IMAGE_ICON = '/assets/photoGroup.svg';

const FilePreview: React.FC<Props> = ({
  url,
  alt = 'View file',
  className = '',
  previewImg,
  height = 100,
  width = 100,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfData, setPdfData] = useState<string | null>(null);

  if (!url) return null;

  // Determine file type
  const fileType = useMemo(() => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    } else if (['doc', 'docx'].includes(extension || '')) {
      return 'word';
    } else if (['xls', 'xlsx'].includes(extension || '')) {
      return 'excel';
    } else if (['ppt', 'pptx'].includes(extension || '')) {
      return 'powerpoint';
    } else {
      return 'document';
    }
  }, [url]);

  const getFileIcon = () => {
    if (previewImg) return previewImg;
    
    switch (fileType) {
      case 'image':
        return IMAGE_ICON;
      case 'pdf':
        return PDF_ICON;
      default:
        return DEFAULT_DOC_ICON;
    }
  };

  const getFileTypeLabel = () => {
    switch (fileType) {
      case 'image':
        return 'Image';
      case 'pdf':
        return 'PDF Document';
      case 'word':
        return 'Word Document';
      case 'excel':
        return 'Excel Document';
      case 'powerpoint':
        return 'PowerPoint Document';
      default:
        return 'Document';
    }
  };

  // Fetch PDF as blob and convert to data URL for iframe embedding
  const fetchPdfAsDataUrl = useCallback(async (pdfUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf,*/*',
        },
        // Use no-cors if CORS is the issue, but this limits what we can do with the response
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      if (blob.type !== 'application/pdf' && !blob.type.includes('pdf')) {
        console.warn('Response is not a PDF, got:', blob.type);
      }

      const dataUrl = URL.createObjectURL(blob);
      setPdfData(dataUrl);
      setIsLoading(false);
      
    } catch (err) {
      console.error('Failed to fetch PDF:', err);
      setIsLoading(false);
      setError('Cannot preview this document due to server restrictions. Please download or open in new tab.');
      setPdfData(null);
    }
  }, []);

  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsLoading(true);
    setError(null);
    setPdfData(null);

    // For PDFs, try to fetch as blob first
    if (fileType === 'pdf' && url) {
      fetchPdfAsDataUrl(url);
    } else {
      setIsLoading(false);
    }
  }, [fileType, url, fetchPdfAsDataUrl]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsLoading(false);
    setError(null);
    if (pdfData) {
      URL.revokeObjectURL(pdfData);
      setPdfData(null);
    }
  }, [pdfData]);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, closeModal]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfData) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [pdfData]);

  const handleModalBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  const handleDownload = useCallback(() => {
    if (!url) return;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'document';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [url]);

  const handleViewInNewTab = useCallback(() => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, [url]);

  const handleImageError = useCallback(() => {
    setError('Unable to load image. Please download or open in new tab.');
  }, []);

  const renderFileContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="mb-4">
            <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Preview Restricted
          </h3>
          <p className="text-gray-500 mb-6 max-w-md text-sm leading-relaxed">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download File
            </button>
            <button
              onClick={handleViewInNewTab}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open in New Tab
            </button>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Tip:</strong> Opening in a new tab will work since the file is publicly accessible.
            </p>
          </div>
        </div>
      );
    }

    if (fileType === 'image') {
      return (
        <div className="flex justify-center items-center h-full">
          <img
            src={url}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            onError={handleImageError}
            style={{ maxHeight: '70vh' }}
          />
        </div>
      );
    }

    if (fileType === 'pdf') {
      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading PDF...</p>
              <p className="text-sm text-gray-500 mt-1">Fetching document data</p>
            </div>
          </div>
        );
      }

      if (pdfData) {
        return (
          <div className="w-full h-full">
            <iframe
              src={pdfData}
              className="w-full h-full border-0 rounded-lg"
              title={alt || 'PDF Preview'}
            />
          </div>
        );
      }

      // If no PDF data and no error yet, show message
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="mb-4">
            <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">PDF Document</h3>
          <p className="text-gray-500 mb-6">Click the buttons below to view this document.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => url && fetchPdfAsDataUrl(url)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Preview Again
            </button>
            <button
              onClick={handleViewInNewTab}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      );
    }

    // Other file types
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="mb-6">
          <img
            src={getFileIcon()}
            alt="File icon"
            className="w-20 h-20 opacity-60 mx-auto"
          />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          {getFileTypeLabel()}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          This file type cannot be previewed online. Please download or open in a new tab to view.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Download File
          </button>
          <button
            onClick={handleViewInNewTab}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Open in New Tab
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Preview Thumbnail */}
      <div
        onClick={handlePreviewClick}
        className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${className}`}
        style={{ display: 'inline-block' }}
        title={`Click to view ${getFileTypeLabel()}`}
      >
        <div className="relative">
          <img
            src={getFileIcon()}
            alt={alt}
            style={{
              height,
              width,
              objectFit: 'contain',
              border: '2px solid #e2e8f0',
              borderRadius: 12,
              padding: 12,
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
          {/* Accessibility indicator */}
          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            🔗
          </div>
        </div>
        <div className="text-center mt-2 text-xs text-gray-600 font-medium">
          {getFileTypeLabel()}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
          onClick={handleModalBackdropClick}
        >
          <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl max-h-[95vh] w-full mx-4 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <img
                  src={getFileIcon()}
                  alt="File icon"
                  className="w-7 h-7"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {alt || 'Document Preview'}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                      {getFileTypeLabel()}
                    </span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      🔗 Publicly Accessible
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
                  title="Download file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={handleViewInNewTab}
                  className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1"
                  title="Open in new tab"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title="Close modal (ESC)"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-4 min-h-[500px] max-h-[calc(95vh-120px)] overflow-hidden">
              {renderFileContent()}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="text-sm text-gray-500 flex-1 min-w-0">
                {url && (
                  <div className="truncate">
                    <span className="font-medium">Source:</span>{' '}
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {url.length > 60 ? `${url.substring(0, 60)}...` : url}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Press ESC to close</span>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilePreview;