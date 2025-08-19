import React from 'react';
import RenderUploadedFiles  from '@/components/workshopDocumentUpload/RenderUploadedFiles';
import { step2TopFileNames, step2LeftFileNames, step2RightFileNames } from './types';
import { validatePersonalInfo } from './validation';

interface Step3Props {
  selectedRole: 'customer' | 'workshop';
  filesStep1: any;
  setFilesStep1: any;
  filesStep2Top: any;
  setFilesStep2Top: any;
  filesStep2Left: any;
  setFilesStep2Left: any;
  filesStep2Right: any;
  setFilesStep2Right: any;
  drivingLicense: any;
  setDrivingLicense: any;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  personalInfoErrors: {
    firstName?: string;
    lastName?: string;
  };
  setPersonalInfoErrors: React.Dispatch<React.SetStateAction<{
    firstName?: string;
    lastName?: string;
  }>>;
  handleEditStep: (step: number) => () => void;
}

const Step3: React.FC<Step3Props> = ({
  selectedRole,
  filesStep1,
  setFilesStep1,
  filesStep2Top,
  setFilesStep2Top,
  filesStep2Left,
  setFilesStep2Left,
  filesStep2Right,
  setFilesStep2Right,
  drivingLicense,
  setDrivingLicense,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  personalInfoErrors,
  setPersonalInfoErrors,
  handleEditStep
}) => {
  const handleDrivingLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setDrivingLicense([...drivingLicense, ...files]);
      e.target.value = '';
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'firstName' | 'lastName') => {
    const value = e.target.value;
    if (field === 'firstName') {
      setFirstName(value);
    } else {
      setLastName(value);
    }

    // Clear error when typing
    if (personalInfoErrors[field]) {
      setPersonalInfoErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      {selectedRole === 'customer' && (
        <div className='max-h-[300px] overflow-y-auto'>
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className={`w-full border ${personalInfoErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => handlePersonalInfoChange(e, 'firstName')}
                />
                {personalInfoErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{personalInfoErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className={`w-full border ${personalInfoErrors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => handlePersonalInfoChange(e, 'lastName')}
                />
                {personalInfoErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{personalInfoErrors.lastName}</p>
                )}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Driving License</h4>
            <label className="cursor-pointer flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-colors">
              <div>
                <img src="/assets/uploadIcon.png" alt="upload" className="w-6 h-6 my-4" />
              </div>
              <span>
                <span className="text-[#18181B] font-semibold text-[14px]">Click to upload </span>
                <span className="mb-2 text-[#3F3F46] text-[14px]">or Drag and Drop</span>
              </span>
              <span className="text-[12px] text-[#828282]">Upload Driving License (MAX 5 MB)</span>
              <input
                type="file"
                onChange={handleDrivingLicenseChange}
                className="hidden"
                accept="image/*,application/pdf"
                multiple
              />
            </label>
            {drivingLicense.length > 0 && (
              <div className="mt-4">
                <h5 className="text-xs font-medium text-gray-500 mb-2">Uploaded Driving License:</h5>
                <RenderUploadedFiles
                  files={drivingLicense}
                  fieldIndex={0}
                  setFiles={setDrivingLicense}
                  filesArray={drivingLicense}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {selectedRole === 'workshop' && (
        <div className="max-h-[80vh] overflow-y-auto px-4 py-4">
  {/* Step 1: Personal & Vehicle Documents */}
  <div className="mb-40">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-[20px] font-semibold text-[#474747]">
        Documents: Personal & Vehicle
      </h4>
      <button
        onClick={handleEditStep(1)}
        className="text-blue-500 hover:underline"
      >
        Edit
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {['Estimate Document'].map((name, index) =>
        filesStep1[index]?.length > 0 && (
          <div key={index}>
            <h5 className="text-[16px] font-medium text-[#3B3B3B] mb-2">
              {name}:
            </h5>
            <RenderUploadedFiles
              files={filesStep1[index]}
              fieldIndex={index}
              setFiles={setFilesStep1}
              filesArray={filesStep1}
            />
          </div>
        )
      )}
    </div>
  </div>

  {/* Step 2: Vehicle Photo Upload */}
  <div className="mb-10">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-[20px] font-semibold text-[#474747]">
        Vehicle Photo Upload: Private Vehicle
      </h4>
      <button
        onClick={handleEditStep(2)}
        className="text-blue-500 hover:underline"
      >
        Edit
      </button>
    </div>

    {/* Top General Documents */}
    <div className="mb-6">
      <h5 className="text-sm font-medium text-gray-500 mb-2">General Documents:</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {step2TopFileNames.map((item, index) =>
          filesStep2Top[index]?.length > 0 && (
            <div key={index}>
              <h5 className="text-sm font-medium text-gray-600 mb-2">{item.label}:</h5>
              <RenderUploadedFiles
                files={filesStep2Top[index]}
                fieldIndex={index}
                setFiles={setFilesStep2Top}
                filesArray={filesStep2Top}
              />
            </div>
          )
        )}
      </div>
    </div>

    {/* Left & Right Sections */}
    <div className="flex flex-col sm:flex-row gap-6">
      {/* Left - Damage Assessment */}
      <div className="w-full sm:w-1/2">
        <h5 className="text-sm font-medium text-gray-500 mb-2">Damage Assessment:</h5>
        {step2LeftFileNames.map((item, index) =>
          filesStep2Left[index]?.length > 0 && (
            <div key={index} className="mb-4">
              <h5 className="text-sm font-medium text-gray-600 mb-2">{item.label}:</h5>
              <RenderUploadedFiles
                files={filesStep2Left[index]}
                fieldIndex={index}
                setFiles={setFilesStep2Left}
                filesArray={filesStep2Left}
              />
            </div>
          )
        )}
      </div>

      {/* Right - Insurance Documents */}
      <div className="w-full sm:w-1/2">
        <h5 className="text-sm font-medium text-gray-500 mb-2">Insurance Documents:</h5>
        {step2RightFileNames.map((item, index) =>
          filesStep2Right[index]?.length > 0 && (
            <div key={index} className="mb-4">
              <h5 className="text-sm font-medium text-gray-600 mb-2">{item.label}:</h5>
              <RenderUploadedFiles
                files={filesStep2Right[index]}
                fieldIndex={index}
                setFiles={setFilesStep2Right}
                filesArray={filesStep2Right}
              />
            </div>
          )
        )}
      </div>
    </div>
  </div>
</div>

      )}
    </>
  );
};

export default Step3;