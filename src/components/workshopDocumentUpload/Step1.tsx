import React from 'react';
import FileUploadInput from './FileUploadInput';
import { step1FileNames } from './types';
import { validateFile, validateStep1 } from './validation';

interface Step1Props {
  selectedRole: 'customer' | 'workshop';
  filesStep1: any;
  setFilesStep1: any;
  errors: string[];
  setErrors: React.Dispatch<React.SetStateAction<string[]>>;
}

const Step1: React.FC<Step1Props> = ({ 
  selectedRole, 
  filesStep1, 
  setFilesStep1, 
  errors,
  setErrors
}) => {
  const handleFileChange = (index: number, files: File[]) => {
    const validFiles = files.filter(file => !validateFile(file));
    if (validFiles.length > 0) {
      const newFiles = [...filesStep1];
      newFiles[index] = [...newFiles[index], ...validFiles];
      setFilesStep1(newFiles);
      
      // Clear error if files are added
      if (newFiles[index].length > 0 && errors[index]) {
        const newErrors = [...errors];
        newErrors[index] = '';
        setErrors(newErrors);
      }
    }
  };

  return (
    <>
      {selectedRole === 'customer' && (
        <div className='max-h-[400px] overflow-y-auto'>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-24">
          {step1FileNames.map((name, index) => (
            <FileUploadInput
              key={index}
              index={index}
              setFiles={setFilesStep1}
              filesArray={filesStep1}
              label={name}
              errors={errors}
              onDrop={handleFileChange}
            />
          ))}
        </div>
        </div>
      )}
      {selectedRole === 'workshop' && (
        <div className='max-h-[300px] overflow-y-auto'>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Mobile No"
            className="border border-gray-200 px-2 py-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="GST No"
            className="border border-gray-200 px-2 py-1 rounded w-full"
          />
          <input
            type="text"
            placeholder="CIN No"
            className="border border-gray-200 px-2 py-1 rounded w-full"
          />
          <div className="col-span-1 sm:col-span-3">
            <FileUploadInput
              index={0}
              setFiles={setFilesStep1}
              filesArray={filesStep1}
              label="Estimate Document"
              errors={errors}
              onDrop={handleFileChange}
            />
          </div>
        </div>
        </div>
      )}
    </>
  );
};

export default Step1;