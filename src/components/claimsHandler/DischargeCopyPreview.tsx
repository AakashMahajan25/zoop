'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface Photo {
    id: number;
    src: string;
    captureDate: string;
    location: string;
    device: string;
}

const DischargeCopyPreview: React.FC = () => {
        const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
        const [zoom, setZoom] = useState<number>(1);
    
        const photos: Photo[] = [
        {
            id: 1,
            src: '/assets/testImg.svg',
            captureDate: '15 Feb 2020',
            location: 'Highway 101',
            device: 'iPhone 12',
        },
        {
            id: 2,
            src: '/assets/testImg.svg',
            captureDate: '16 Feb 2020',
            location: 'Downtown Garage',
            device: 'Samsung Galaxy S21',
        },
        {
            id: 3,
            src: '/assets/testImg.svg',
            captureDate: '17 Feb 2020',
            location: 'Service Center',
            device: 'Canon EOS',
        },
    ];

   const handleReset = () => {
    setZoom(1);
  };
    
    const handleEdit = () => {
        console.log('Editing photo:', photos[selectedPhotoIndex]);
    };
  return (
    <div className="space-y-6">
      <h2 className="text-[20px] font-bold text-[#484848]">Discharge Copy Preview & Details</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 bg-gray-50 rounded-lg">
          <div className="w-full flex flex-col">
          
                                  <div className="bg-[#F3F3F3] p-4 sm:p-6 flex flex-col flex-1 rounded-md">
                                                              <div
                                  className="w-full rounded-md mb-4 overflow-hidden"
                                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
                                  >
                                  <Image
                                      src={photos[selectedPhotoIndex].src}
                                      alt="Selected Photo"
                                      width={800}
                                      height={800} 
                                      className="w-full h-auto object-contain"
                                  />
                                  </div>
          
                                      {/* Zoom & Navigation Controls */}
                                      <div className="flex flex-col sm:flex-row justify-between items-center w-full my-4 gap-2">
                                          <div className="flex gap-2">
                                              <button
                                                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                                                  aria-label="Zoom Out"
                                                  className="px-2 bg-white border border-[#DBDADE] py-1 rounded cursor-pointer transition"
                                              >
                                                  <Image src="/assets/zoomOutIcon.svg" alt="Zoom Out" width={24} height={24} />
                                              </button>
                                              <button
                                                  onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                                                  aria-label="Zoom In"
                                                  className="px-2 bg-white border border-[#DBDADE] py-1 rounded cursor-pointer transition"
                                              >
                                                  <Image src="/assets/zoominIcon.svg" alt="Zoom In" width={24} height={24} />
                                              </button>
                                              <button
                                                  onClick={handleReset}
                                                  className="px-2 bg-white border border-[#DBDADE] py-1 rounded cursor-pointer transition"
                                              >
                                                  <Image src="/assets/refresIcon.svg" alt="Refresh" width={24} height={24} />
                                              </button>
                                              <button
                                                  onClick={handleEdit}
                                                  className="px-2 bg-white border border-[#DBDADE] py-1 rounded cursor-pointer transition"
                                              >
                                                  <Image src="/assets/penIcon.svg" alt="Pen" width={24} height={24} />
                                              </button>
                                          </div>
                                      </div>
          
                                      {/* Metadata & Submission */}
                                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                          <div className='flex flex-col gap-2 my-4'>
                                              <p className="text-[#787C82] text-sm">Capture Date: <span>{photos[selectedPhotoIndex].captureDate}</span></p>
                                              <p className="text-[#787C82] text-sm">Location: <span>{photos[selectedPhotoIndex].location}</span></p>
                                              <p className="text-[#787C82] text-sm">Device: <span>{photos[selectedPhotoIndex].device}</span></p>
                                          </div>
                                      </div>
                                  </div>
                              </div>    
        </div>

        {/* Right - Details */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className='flex justify-between'>
            <div className="flex flex-col gap-2">
            <p className='text-sm text-[#787C82]'>Vehicle Number:</p>
            <p>KA01MJ2022</p>
            <p className='text-sm text-[#787C82]'>Date of Discharge</p>
            <p> 5/03/2022</p>
          </div>
          <div>
            <button
              className="px-4 py-2 bg-green-100 text-[#0BB064] rounded flex items-center gap-2"
            >
              <img src='/assets/matchIcon.svg' alt='matchIcon'/> Match
            </button>
          </div>
          </div>

          {/* Signature Box */}
          <div>
            <label className="block text-sm font-medium mb-1">Signature Present</label>
            <div className="border border-gray-200 rounded-md h-32 p-2 bg-white flex justify-center">
              <img src="/assets/signature.svg" alt="Signature" className="h-full object-contain " />
            </div>
          </div>

          {/* Comments Box */}
          <div>
            <label className="block text-sm font-medium mb-1">Add Comments</label>
            <textarea
            disabled={true}
              className="w-full border border-gray-200 text-gray-500 rounded-md p-2 h-20 resize-none text-sm"
              placeholder="Signature missing"
              defaultValue="Signature missing"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeCopyPreview;
