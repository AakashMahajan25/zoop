import React from 'react';
import FileUploadInput from './FileUploadInput';
import { step2TopFileNames, step2LeftFileNames, step2RightFileNames } from './types';

interface Step2Props {
  filesStep2Top: any;
  setFilesStep2Top: any;
  filesStep2Left: any;
  setFilesStep2Left: any;
  filesStep2Right: any;
  setFilesStep2Right: any;
}

const Step2: React.FC<Step2Props> = ({
  filesStep2Top,
  setFilesStep2Top,
  filesStep2Left,
  setFilesStep2Left,
  filesStep2Right,
  setFilesStep2Right,
}) => {
  return (
    <div className='max-h-[300px] overflow-y-auto'>
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {step2TopFileNames.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className='flex items-center justify-between mb-2'>
                <label className="text-sm text-gray-600">{item.label}</label>
                {item.imgSrc && <img src={item.imgSrc} alt='icon' className='h-8'/>}
              </div>
              <FileUploadInput
                index={index}
                setFiles={setFilesStep2Top}
                filesArray={filesStep2Top}
                label={''}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-full sm:w-1/2">
          {step2LeftFileNames.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className='flex items-center justify-between mb-2'>
                <label className="text-sm text-gray-600">{item.label}</label>
                {item.imgSrc && <img src={item.imgSrc} alt='icon' className='h-8'/>}
              </div>
              <FileUploadInput
                index={index}
                setFiles={setFilesStep2Left}
                filesArray={filesStep2Left}
                label={''}
              />
            </div>
          ))}
        </div>
        <div className="w-full sm:w-1/2">
          {step2RightFileNames.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className='flex items-center justify-between mb-2'>
                <label className="text-sm text-gray-600">{item.label}</label>
                {item.imgSrc && <img src={item.imgSrc} alt='icon' className='h-8'/>}
              </div>
              <FileUploadInput
                index={index}
                setFiles={setFilesStep2Right}
                filesArray={filesStep2Right}
                label={''}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2;