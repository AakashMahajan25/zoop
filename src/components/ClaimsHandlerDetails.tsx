import React, { useState } from 'react';
import Image from 'next/image';
import ClaimsHandlerPhotosSection from './ClaimsHandlerPhotosSection';
import ClaimsHandlerFinance from './ClaimsHandlerFinance';

interface Document {
  id: number;
  docName: string;
  collectionStatus: 'received' | 'pending';
  verificationStatus: 'verified' | 'pending' | 'error';
  uploadedBy: string;
  dueDate: string;
}

interface Surveyor {
  name: string;
  pincode: string;
  caseload: number;
  status: 'green' | 'yellow' | 'red';
}

const ClaimsHandlerDetails: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'documents' | 'photos' | 'finance'>('documents');
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isSendReminderModalOpen, setIsSendReminderModalOpen] = useState(false);
  const [isRequestDocumentModalOpen, setIsRequestDocumentModalOpen] = useState(false);
  const [assignSurveyor, setAssignSurveyor] = useState(false);
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [reminderOptions, setReminderOptions] = useState({
    customer: false,
    garage: false,
    email: false,
    whatsapp: false,
  });
  const [requestReason, setRequestReason] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [activeActionDropdown, setActiveActionDropdown] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Surveyor; direction: 'asc' | 'desc' }>({ 
    key: 'name', 
    direction: 'asc' 
  });
  const [note, setNote] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split("-");
    const updatedDate = new Date(selectedDate);
    updatedDate.setFullYear(parseInt(year), parseInt(month) - 1, parseInt(day));
    setSelectedDate(updatedDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":");
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(parseInt(hours));
    updatedDate.setMinutes(parseInt(minutes));
    setSelectedDate(updatedDate);
  };

  const surveyors: Surveyor[] = [
    { name: "John Doe", pincode: "400001", caseload: 5, status: "green" },
    { name: "Ravi Sharma", pincode: "400002", caseload: 3, status: "yellow" },
    { name: "Aisha Khan", pincode: "400003", caseload: 2, status: "red" },
    { name: "Karan Patel", pincode: "400004", caseload: 4, status: "green" },
    { name: "Sneha Roy", pincode: "400005", caseload: 6, status: "yellow" },
    { name: "Manoj Verma", pincode: "400006", caseload: 1, status: "red" },
    { name: "Pooja Nair", pincode: "400007", caseload: 8, status: "green" },
    { name: "Rahul Das", pincode: "400008", caseload: 2, status: "yellow" },
    { name: "Fatima Sheikh", pincode: "400009", caseload: 7, status: "green" },
    { name: "Amit Singh", pincode: "400010", caseload: 0, status: "red" },
  ];

  const sortedSurveyors = [...surveyors].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    
    if (typeof valA === "number") {
      //@ts-ignore
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    } else {
      return sortConfig.direction === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    }
  });

  const requestSort = (key: keyof Surveyor) => {
    let direction: 'asc' | 'desc' = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const documents: Document[] = [
    {
      id: 1,
      docName: 'Claim Form',
      collectionStatus: 'received',
      verificationStatus: 'verified',
      uploadedBy: 'Admin',
      dueDate: '21 Feb 2020',
    },
    {
      id: 2,
      docName: 'ID Proof',
      collectionStatus: 'pending',
      verificationStatus: 'pending',
      uploadedBy: 'User',
      dueDate: '21 Feb 2020',
    },
    {
      id: 3,
      docName: 'Policy Doc',
      collectionStatus: 'received',
      verificationStatus: 'error',
      uploadedBy: 'Admin',
      dueDate: '21 Feb 2020',
    },
  ];

  const claimDetails = {
    claimsNumber: 'CLM12345',
    policyNumber: 'POL67890',
    insuredName: 'John Doe',
    insuredAddress: '123 Main St, City, Country',
    mobile: '9876543210',
    stdCode: 'STD-123',
    landline: '0123456789',
    email: 'john.doe@example.com',
    registernNo: 'REG789',
    chassisNo: 'CHS123456',
    engineNo: 'ENG654321',
    make: 'Toyota',
    model: 'Camry',
    claimsServiceOffice: 'Downtown Branch',
    placeOfIncident: 'Highway 101',
    policyReport: 'RPT456',
    stationDiaryEntryNumber: 'SDN789',
    policeStationName: 'Central Station',
  };

  // Handlers
  const handleCheckboxChange = (id: number) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const handleSendReminder = () => {
    if (selectedDocs.length > 0) {
      console.log('Calling collectionStatus API with:', {
        docIds: selectedDocs,
        reminderOptions,
      });
      setIsSendReminderModalOpen(false);
      setSelectedDocs([]);
    }
  };

  const handleRequestDocument = () => {
    console.log('Requesting document with reason:', requestReason);
    setIsRequestDocumentModalOpen(false);
    setRequestReason('');
  };

  const handleUploadDocument = () => {
    if (uploadedFile) {
      console.log('Uploading document:', uploadedFile);
      setIsUploadDocumentModalOpen(false);
      setUploadedFile(null);
    }
  };

  const handleAssignSurveyor = () => {
    console.log('Assigning surveyor with date:', selectedDate);
    setAssignSurveyor(false);
  };

  const toggleActionDropdown = (id: number) => {
    setActiveActionDropdown(activeActionDropdown === id ? null : id);
  };

  const handleFullscreen = () => {
    const img = document.getElementById("docImage");
    if (img && img.requestFullscreen) {
      img.requestFullscreen();
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Breadcrumb and Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          <a href="#" className="text-[15px] text-[#999999] hover:text-blue-600 hover:underline">New Claims</a> 
          <span className="mx-2">/</span> 
          <span className='text-[#333333] text-[15px]'>Claim Details</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setAssignSurveyor(true)} className="text-[#000000] px-3 py-1 rounded-md border boder-[#000000] transition">Assign Surveyor</button>
          <button className="bg-[#000000] text-[#FFFFFF] px-3 py-1 rounded-md transition">Submit</button>
        </div>
      </div>

      {/* Claim Info */}
      <div className="border border-[#EFEFEFE5] p-6 rounded-lg mb-6">
        <h2 className="text-[20px] font-bold text-[#484848] mb-4">Claim Details</h2>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <div className="min-w-[150px]">
            <p className="text-[14px] text-[#858585]">Name of the insured</p>
            <p className='text-[14px] text-[#484848]'>{claimDetails.insuredName}</p>
          </div>
          <div className="min-w-[150px]">
            <p className="text-[14px] text-[#858585]">Mobile No</p>
            <p className="text-[14px] text-[#484848]">{claimDetails.mobile}</p>
          </div>
          <div className="min-w-[150px]">
            <p className="text-[14px] text-[#858585]">Policy Issue Office</p>
            <p className="text-[14px] text-[#484848]">{claimDetails.claimsServiceOffice}</p>
          </div>
          <div className="min-w-[150px]">
            <p className="text-[14px] text-[#858585]">Policy Period</p>
            <div className="text-[14px] text-[#484848] flex gap-2">
              <div>
                <p>From:</p>
                <p>To:</p>
              </div>
              <div>
                <p>01 Jan 2024</p>
                <p>31 Dec 2024</p>
              </div>
            </div>
          </div>

          <div className="min-w-[150px]">
            <p className="text-[14px] text-[#858585]">Policy Number</p>
            <p className="text-[14px] text-[#484848]">{claimDetails.policyNumber}</p>
          </div>
          <div className="min-w-[150px]">
            <p className="text-[14px] text-[#858585]">Date of Loss</p>
            <p className="text-[14px] text-[#484848]">15 Feb 2020</p>
          </div>
          <div className="min-w-[100px]">
            <p className="text-[14px] text-[#858585]">Time</p>
            <p className="text-[14px] text-[#484848]">04:30[24Hrs]</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 border-b border-[#F3F3F3]">
        <button
          className={`px-5 py-2 font-medium transition ${
            activeTab === 'documents' ? 'text-[#3A6048] border-b-2 border-[#21FF91]' : 'text-[#858585] hover:text-gray-400 cursor-pointer'
          }`}
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
        <button
          className={`px-5 py-2 font-medium transition ${
            activeTab === 'photos' ? 'text-[#3A6048] border-b-2 border-[#21FF91]' : 'text-[#858585] hover:text-gray-400 cursor-pointer'
          }`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button
          className={`px-5 py-2 font-medium transition ${
            activeTab === 'finance' ? 'text-[#3A6048] border-b-2 border-[#21FF91]' : 'text-[#858585] hover:text-gray-400 cursor-pointer'
          }`}
          onClick={() => setActiveTab('finance')}
        >
          Finance
        </button>
      </div>

      {/* Tab Content */}
      <div className="py-2 rounded-lg">
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[20px] font-bold text-[#484848]">Document Checklist</h3>
              <button
                className="bg-[#000000] text-[#FFFFFF] px-3 py-2 rounded-md disabled:bg-gray-400"
                onClick={() => setIsSendReminderModalOpen(true)}
                disabled={selectedDocs.length === 0}
              >
                Send Reminder 
              </button>
            </div>
            <table className="w-full text-[14px] text-gray-700">
              <thead>
                <tr className="font-normal bg-gray-100 text-left text-[#858585] ">
                  <th className="py-3"></th>
                  <th className="py-3">Doc Name</th>
                  <th className="p-3">Collection Status</th>
                  <th className="p-3">Verification Status</th>
                  <th className="p-3">Uploaded By</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-t text-[16px] text-[#5C5C5C] border-gray-200 hover:bg-[#93FFCA1A]">
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleCheckboxChange(doc.id)}
                        className="h-4 w-4 accent-[#333333] bg-[#21FF91] rounded-md"
                      />
                    </td>
                    <td className="py-3">{doc.docName}</td>
                    <td className="p-3">
                      <span
                        className={`flex items-center gap-1 px-2 py-1 rounded ${
                          doc.collectionStatus === 'received'
                            ? 'text-[#0AA7DC] capitalize'
                            : 'text-gray-400 capitalize'
                        }`}
                      >
                        <span className='text-2xl'>•</span>{doc.collectionStatus}
                      </span>
                    </td>
                    <td className="p-3 flex items-center items-center gap-2 capitalize">
                      {doc.verificationStatus !== 'error' && (
                        <img src='/assets/checkIcon.svg' alt='checkIcon' className='h-3'/>
                      )}
                      {doc.verificationStatus === 'error' && (
                        <img src='/assets/errorIcon.svg' className="w-5 h-5 text-gray-500" />
                      )}
                      <span>{doc.verificationStatus}</span>
                    </td>
                    <td className="p-3">{doc.uploadedBy}</td>
                    <td className="p-3">{doc.dueDate}</td>
                    <td className="p-3 relative">
                      <button
                        className="text-blue-600 hover:underline font-medium"
                        onClick={() => toggleActionDropdown(doc.id)}
                      >
                        <img src='/assets/actionDots.svg' className="w-5 h-5 text-gray-500" />
                      </button>
                      {activeActionDropdown === doc.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                          <button
                            className="flex items-center gap-2 w-full text-left py-2 px-3 hover:bg-gray-100 text-[#3C434A] text-[14px]"
                            onClick={() => {
                              setIsViewDetailsModalOpen(true);
                              toggleActionDropdown(doc.id);
                            }}
                          >
                            <img src="/assets/viewIcon.svg" className="h-4" alt="View" />
                            View Details
                          </button>

                          <button
                            className="flex items-center gap-2 w-full text-left py-2 px-3 hover:bg-gray-100 text-[#3C434A] text-[14px]"
                            onClick={() => {
                              setIsSendReminderModalOpen(true);
                              toggleActionDropdown(doc.id);
                            }}
                          >
                            <img src="/assets/bellIcon.svg" className="h-5" alt="Reminder" />
                            Send Reminder
                          </button>

                          <button
                            className="flex items-center gap-2 w-full text-left py-2 px-3 hover:bg-gray-100 text-[#3C434A] text-[14px]"
                            onClick={() => {
                              setIsRequestDocumentModalOpen(true);
                              toggleActionDropdown(doc.id);
                            }}
                          >
                            <img src="/assets/noteIcon.svg" className="h-5" alt="Request" />
                            Request Document
                          </button>

                          <button
                            className="flex items-center gap-2 w-full text-left py-2 px-3 hover:bg-gray-100 text-[#3C434A] text-[14px]"
                            onClick={() => {
                              setIsUploadDocumentModalOpen(true);
                              toggleActionDropdown(doc.id);
                            }}
                          >
                            <img src="/assets/uploadIcon.svg" className="h-5" alt="Upload" />
                            Upload Document
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'photos' && (
          <ClaimsHandlerPhotosSection />
        )}
        {activeTab === 'finance' && (
          <ClaimsHandlerFinance />
        )}
      </div>

      {/* View Details Modal */}
      {isViewDetailsModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-3/4 max-w-2xl h-[700px] overflow-x-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-[20px] font-bold text-[#484848]">Document Review</h3>
              <button
                className="text-[#858585] text-[36px] px-4 py-1 rounded-md transition cursor-pointer"
                onClick={() => setIsViewDetailsModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <select className="w-58 p-2 mb-3 border border-[#E5E5E5] text-[#646970] text-[16px] rounded-md ">
              <option>Registration Certificate</option>
              <option>Document 2</option>
            </select>
            <div className="">
              <div className="overflow-auto text-center bg-[#EFEFEF] mb-8">
                <Image
                  id="docImage"
                  src='/assets/docImg.svg'
                  alt={activeTab}
                  width={800}
                  height={800}
                  style={{
                    transform: `scale(${zoom})`,
                    transition: "transform 0.3s ease",
                    paddingInline: 80
                  }}
                />
                <div className="flex justify-center my-2 gap-2">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                    aria-label="Zoom Out"
                    className="px-2 bg-white border border-[#DBDADE] py-1 rounded hover:bg-gray-100 transition"
                  >
                    <Image
                      src="/assets/zoomOutIcon.svg"
                      alt="Zoom Out"
                      width={24}
                      height={24}
                    />
                  </button>

                  <button
                    onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                    aria-label="Zoom In"
                    className="px-2 bg-white border border-[#DBDADE] py-1 rounded hover:bg-gray-100 transition"
                  >
                    <Image
                      src="/assets/zoominIcon.svg"
                      alt="Zoom In"
                      width={24}
                      height={24}
                    />
                  </button>

                  <button
                    onClick={handleFullscreen}
                    aria-label="Fullscreen"
                    className="px-2 bg-white border border-[#DBDADE] py-1 rounded hover:bg-gray-100 transition"
                  >
                    <Image
                      src="/assets/fullScreenZoomIcon.svg"
                      alt="Fullscreen"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h1 className="text-[20px] font-bold text-[#484848] my-2">Registration Details</h1>

              {!isEditing ? (
                <button
                  className="text-[#000000] px-4 py-2 rounded-md transition flex items-center gap-1 cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                  <img src="/assets/editIcon.svg" alt="editIcon" className="h-4 w-4" />
                </button>
              ) : (
                <button
                  className="text-[#000000] px-4 py-2 rounded-md border border-[#000000] cursor-pointer transition"
                  onClick={() => setIsEditing(false)}
                >
                  Save
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Object.entries(claimDetails).map(([key, value]) => (
                <div key={key} className="min-w-[150px]">
                  <p className="text-[14px] text-[#858585] capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </p>
                  <input
                    type="text"
                    value={value as string}
                    readOnly={!isEditing}
                    className={`text-[14px] text-[#484848] w-full p-1 rounded-md ${
                      isEditing
                        ? 'border border-gray-300 focus:ring-2 focus:ring-blue-500'
                        : 'border-none bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>  
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {isSendReminderModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/2 max-w-md">
            <h3 className="text-[20px] font-bold text-[#484848] mb-4">Send Reminder To</h3>
            <div className="mb-4 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reminderOptions.customer}
                  onChange={() => setReminderOptions({ ...reminderOptions, customer: !reminderOptions.customer })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-[#000000] text-[14px]">Customer</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reminderOptions.garage}
                  onChange={() => setReminderOptions({ ...reminderOptions, garage: !reminderOptions.garage })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-[#000000] text-[14px]">Garage</span>
              </label>
            </div>
            <p className="text-[20px] font-bold text-[#484848] mb-4">Send Via</p>

            <div className="mb-4 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reminderOptions.email}
                  onChange={() => setReminderOptions({ ...reminderOptions, email: !reminderOptions.email })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-[#000000] text-[14px]">Email</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reminderOptions.whatsapp}
                  onChange={() => setReminderOptions({ ...reminderOptions, whatsapp: !reminderOptions.whatsapp })}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-[#000000] text-[14px]">WhatsApp</span>
              </label>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="text-[#000000] px-4 py-2 rounded-md cursor-pointer"
                onClick={() => setIsSendReminderModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#000000] text-white px-4 py-1 rounded-md cursor-pointer"
                onClick={handleSendReminder}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Document Modal */}
      {isRequestDocumentModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-1/2 max-w-md">
            <h3 className="text-[20px] font-bold text-[#484848] mb-4">Request Recollection of Driving License</h3>
            <p className='text-[#333333] text-[14px] mb-2'>Reason</p>
            <div className="mb-4 grid grid-cols-2">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="reason"
                  value="blurry"
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">Blurry Image</span>
              </label>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="reason"
                  value="wrong"
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">Wrong Image</span>
              </label>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="reason"
                value="duplicate"
                onChange={(e) => setRequestReason(e.target.value)}
                className="h-4 w-4 text-blue-600"
              />
              <span className="text-gray-700">Duplicate Copy Received</span>
            </label>

            <div className="mb-4">
              <p className="font-bold text-[20px] text-[#484848] my-4">Add Custom Note</p>
              <textarea 
                className="w-full p-2 border border-[#DBDADE] rounded-md focus:ring-2 focus:ring-blue-500" 
                rows={3} 
                placeholder='Type here..'
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="text-[#000000] px-4 py-2 rounded-md cursor-pointer"
                onClick={() => setIsRequestDocumentModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#000000] text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={handleRequestDocument}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadDocumentModalOpen && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-[20px] font-semibold text-[#484848] mb-4">
              Upload Driving license
            </h3>

            {/* Drag & Drop Area */}
            <label
              htmlFor="fileUpload"
              className="cursor-pointer flex flex-col items-center justify-center gap-1 border-2 border-dashed border-[#D9D9D9] p-6 rounded-lg text-center text-[#4A4A4A] text-sm"
            >
              <img src="/assets/uploadIcon.png" alt="upload icon" className="w-6 h-6 mb-1" />
              <p>Click to upload or Drag & Drop</p>
              <p className="text-xs">Upload Doc or PDF (MAX 5 MB)</p>
              <span className="text-sm font-medium text-black mt-1">or</span>
              <span className="underline text-black font-semibold text-sm">Browse Image</span>
              <input
                id="fileUpload"
                type="file"
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>

            {/* Buttons */}
            <div className="flex justify-end items-center gap-6 mt-6">
              <button
                onClick={() => setIsUploadDocumentModalOpen(false)}
                className="text-black text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDocument}
                className="bg-black text-[#FFFFFF] px-6 py-2 text-sm rounded-md"
                disabled={!uploadedFile}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )} 

      {assignSurveyor && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl space-y-6">
            {/* Title */}
            <h2 className="text-xl font-semibold text-[#484848]">Assign Surveyor</h2>

            {/* Table */}
            <div className="relative max-h-64 overflow-y-auto border border-gray-200 rounded-md">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="sticky top-0 z-10 bg-gray-100 text-xs text-gray-600 uppercase">
                  <tr>
                    <th 
                      className="px-4 py-3 cursor-pointer" 
                      onClick={() => requestSort("name")}
                    >
                      Surveyor
                      <span className="ml-1 text-xs text-gray-400">↑↓</span>
                    </th>
                    <th 
                      className="px-4 py-3 cursor-pointer" 
                      onClick={() => requestSort("pincode")}
                    >
                      Pincode
                      <span className="ml-1 text-xs text-gray-400">↑↓</span>
                    </th>
                    <th 
                      className="px-4 py-3 cursor-pointer" 
                      onClick={() => requestSort("caseload")}
                    >
                      Caseload
                      <span className="ml-1 text-xs text-gray-400">↑↓</span>
                    </th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedSurveyors.map((surveyor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{surveyor.name}</td>
                      <td className="px-4 py-3">{surveyor.pincode}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              surveyor.status === "green"
                                ? "bg-green-500"
                                : surveyor.status === "yellow"
                                ? "bg-yellow-400"
                                : "bg-red-500"
                            }`}
                          />
                          {surveyor.caseload} Cases
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => alert(`Assigned to ${surveyor.name}`)}
                          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition text-sm"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#858585] mb-1">Select Date</label>
                <input
                  type="date"
                  value={selectedDate.toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  onChange={handleDateChange}
                />
              </div>

              <div>
                <label className="block text-sm text-[#858585] mb-1">Select Time</label>
                <input
                  type="time"
                  value={selectedDate.toTimeString().slice(0, 5)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  onChange={handleTimeChange}
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm text-[#858585] mb-1">Note</label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
                placeholder="Write your note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setAssignSurveyor(false)}
                className="text-sm px-4 py-2 text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSurveyor}
                className="text-sm px-6 py-2 bg-black text-[#21FF91] rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsHandlerDetails;