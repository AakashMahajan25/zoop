import React from 'react';
import RenderUploadedFiles from './RenderUploadedFiles';
import { step1FileNames, step2TopFileNames, step2LeftFileNames, step2RightFileNames } from './types';

interface Step4Props {
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
  lastName: string;
  handleEditStep: (step: number) => () => void;
}

const Step4: React.FC<Step4Props> = ({
  filesStep1,
  setFilesStep1,
  filesStep2Top,
  setFilesStep2Top,
  filesStep2Left,
  setFilesStep2Left,
  filesStep2Right,
  setFilesStep2Right,
  drivingLicense,
  firstName,
  lastName,
  setDrivingLicense,
  handleEditStep,
}) => {
  return (
    <div className="max-h-[80vh] overflow-y-auto pb-48">
  <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-[16px] text-[#000000]">Documents: Personal & Vehicle</h4>
      <button
        onClick={handleEditStep(1)}
        className="flex items-center gap-2 hover:underline"
      >
        Edit
        <img src="/assets/editIcon.svg" alt="editIcon" className="w-4 h-4" />
      </button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {step1FileNames.map((name, index) =>
        filesStep1[index].length > 0 && (
          <div key={index}>
            <h5 className="text-[14px] font-medium text-[#3B3B3B] mb-2">{name}:</h5>
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

  <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-[16px] text-[#000000]">Vehicle Photo Upload: Private Vehicle</h4>
      <button
        onClick={handleEditStep(2)}
        className="flex items-center gap-2 hover:underline"
      >
        Edit
        <img src="/assets/editIcon.svg" alt="editIcon" className="w-4 h-4" />
      </button>
    </div>

    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {step2TopFileNames.map((item, index) =>
          filesStep2Top[index].length > 0 && (
            <div key={index}>
              <h5 className="text-xs font-medium text-gray-500 mb-2">{item.label}:</h5>
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

    <div className="flex flex-col sm:flex-row gap-6">
      <div className="w-full sm:w-1/2">
        {step2LeftFileNames.map((item, index) =>
          filesStep2Left[index].length > 0 && (
            <div key={index}>
              <h5 className="text-xs font-medium text-gray-500 mb-2">{item.label}:</h5>
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
      <div className="w-full sm:w-1/2">
        {step2RightFileNames.map((item, index) =>
          filesStep2Right[index].length > 0 && (
            <div key={index}>
              <h5 className="text-xs font-medium text-gray-500 mb-2">{item.label}:</h5>
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

  <div className="mb-8">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-[16px] text-[#000000]">Driver Details: Someone Else</h4>
      <button
        onClick={handleEditStep(3)}
        className="flex items-center gap-2 hover:underline"
      >
        Edit
        <img src="/assets/editIcon.svg" alt="editIcon" className="w-4 h-4" />
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">
          First Name: {firstName || 'Not provided'}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">
          Last Name: {lastName || 'Not provided'}
        </p>
      </div>
    </div>

    {drivingLicense.length > 0 && (
      <div className="mt-4">
        <h5 className="text-xs font-medium text-gray-500 mb-2">Driving License:</h5>
        <RenderUploadedFiles
          files={drivingLicense}
          fieldIndex={0}
          //@ts-ignore
          setFiles={setDrivingLicense}
          filesArray={drivingLicense}
        />
      </div>
    )}
  </div>
</div>

  );
};

export default Step4;