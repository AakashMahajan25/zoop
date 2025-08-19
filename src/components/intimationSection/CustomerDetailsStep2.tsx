import React from 'react';
import { TextField, InputAdornment, FormControl, FormHelperText } from '@mui/material';
import DocumentUploadCard from './DocumentUploadCard';

// New schema interface matching the context
interface InsurerInformation {
  insurerName: string;
  mobileNo: string;
  emailAddress: string;
  vehicleNo: string;
  driverName: string;
  alternateNo: string;
  alternateEmail: string;
  drivingLicenseFilePath: string;
  registrationCertificateFilePath: string;
  aadhaarCardFilePath: string;
  panCardFilePath: string;
}

interface UploadedDocuments {
  policyCopy: { file: File | null; url: string | null; documentId: string | null };
  intimationForm: { file: File | null; url: string | null; documentId: string | null };
  claimsForm: { file: File | null; url: string | null; documentId: string | null };
  vehicleRC: { file: File | null; url: string | null; documentId: string | null };
  drivingLicense: { file: File | null; url: string | null; documentId: string | null };
  insuranceCopy: { file: File | null; url: string | null; documentId: string | null };
  workshopEstimate: { file: File | null; url: string | null; documentId: string | null };
  repairPhotos: { file: File | null; url: string | null; documentId: string | null };
  inspectionReport: { file: File | null; url: string | null; documentId: string | null };
  allocationForm: { file: File | null; url: string | null; documentId: string | null };
  surveyorReport: { file: File | null; url: string | null; documentId: string | null };
  aadharCard: { file: File | null; url: string | null; documentId: string | null };
  panCard: { file: File | null; url: string | null; documentId: string | null };
  other: { file: File | null; url: string | null; documentId: string | null };
}

interface Step2Props {
  step2Data: InsurerInformation;
  handleStep2Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { step2: Partial<Record<keyof InsurerInformation, string>> };
  docErrors: Partial<Record<keyof UploadedDocuments, string>>;
  uploadedDocs: UploadedDocuments;
  handleDocUpload: (fieldName: keyof UploadedDocuments) => (file: File | null) => void;
}

export default function CustomerDetailsStep2({ step2Data, handleStep2Change, errors, docErrors,  uploadedDocs, handleDocUpload }: Step2Props) {
  return (
    <div className="border border-[#EFEFEFE5] p-8 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="insurer_name" className="block text-sm font-medium text-[#000000] mb-1">
            Insurer Name <span className='text-red-400'>*</span>
          </label>
          <TextField
            id="insurer_name"
            name="insurerName"
            value={step2Data.insurerName}
            onChange={handleStep2Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter insurer name"
            error={!!errors.step2.insurerName}
            helperText={errors.step2.insurerName}
             sx={{
                // whenever the `.Mui-error` class is present, force the outline back to your normal gray
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                // also handle hover & focus states so it never goes red
                '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
              }}
          />
        </div>

        <div>
          <label htmlFor="mobile_number" className="block text-sm font-medium text-[#000000] mb-1">
            Mobile No.<span className='text-red-400'>*</span>
          </label>
          <TextField
            id="mobile_number"
            name="mobileNo"
            value={step2Data.mobileNo}
            onChange={handleStep2Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter mobile number"
            error={!!errors.step2.mobileNo}
            helperText={errors.step2.mobileNo}
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
            }}
             sx={{
                // whenever the `.Mui-error` class is present, force the outline back to your normal gray
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                // also handle hover & focus states so it never goes red
                '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
              }}
          />
        </div>

        <div>
          <label htmlFor="email_address" className="block text-sm font-medium text-[#000000] mb-1">
            Email Address <span className='text-red-400'>*</span>
          </label>
          <TextField
            id="email_address"
            name="emailAddress"
            type="email"
            value={step2Data.emailAddress}
            onChange={handleStep2Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter email address"
            error={!!errors.step2.emailAddress}
            helperText={errors.step2.emailAddress}
             sx={{
                // whenever the `.Mui-error` class is present, force the outline back to your normal gray
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                // also handle hover & focus states so it never goes red
                '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
              }}
          />
        </div>

        <div>
          <label htmlFor="vehicle_number" className="block text-sm font-medium text-[#000000] mb-1">
            Vehicle Number <span className='text-red-400'>*</span>
          </label>
          <TextField
            id="vehicle_number"
            name="vehicleNo"
            value={step2Data.vehicleNo}
            onChange={handleStep2Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter vehicle number"
            error={!!errors.step2.vehicleNo}
            helperText={errors.step2.vehicleNo}
             sx={{
                // whenever the `.Mui-error` class is present, force the outline back to your normal gray
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                // also handle hover & focus states so it never goes red
                '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
              }}
          />
        </div>

        <div>
          <label htmlFor="driver_name" className="block text-sm font-medium text-[#000000] mb-1">
            Driver Name <span className='text-red-400'>*</span>
          </label>
          <TextField
            id="driver_name"
            name="driverName"
            value={step2Data.driverName}
            onChange={handleStep2Change}
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter driver name"
            error={!!errors.step2.driverName}
            helperText={errors.step2.driverName}
             sx={{
                // whenever the `.Mui-error` class is present, force the outline back to your normal gray
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                // also handle hover & focus states so it never goes red
                '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
              }}
          />
        </div>

        <div>
          <label htmlFor="alternate_mobile_number" className="block text-sm font-medium text-[#000000] mb-1">
            Alternate Mobile No.
          </label>
          <TextField
            id="alternate_mobile_number"
            name="alternateNo"
            value={step2Data.alternateNo}
            onChange={handleStep2Change}
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter alternate number"
            error={!!errors.step2.alternateNo}
            helperText={errors.step2.alternateNo}
            InputProps={{
              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
            }}
             sx={{
                // whenever the `.Mui-error` class is present, force the outline back to your normal gray
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                // also handle hover & focus states so it never goes red
                '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
              }}
          />
        </div>

        <div>
          <label htmlFor="alternate_email" className="block text-sm font-medium text-[#000000] mb-1">
            Alternate Email
          </label>
          <TextField
            id="alternate_email"
            name="alternateEmail"
            type="email"
            value={step2Data.alternateEmail}
            onChange={handleStep2Change}
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter alternate email"
            error={!!errors.step2.alternateEmail}
            helperText={errors.step2.alternateEmail}
             sx={{
                // whenever the `.Mui-error` class is present, force the outline back to your normal gray
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                // also handle hover & focus states so it never goes red
                '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
                '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DB',
                },
              }}
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentUploadCard
            title="Driving License"
            fieldName="drivingLicense"
            file={uploadedDocs.drivingLicense.file}
            uploadedUrl={uploadedDocs.drivingLicense.url}
            onFileChange={handleDocUpload('drivingLicense')}
          />
          <DocumentUploadCard
            title="RC Copy"
            fieldName="allocationForm"
            file={uploadedDocs.allocationForm.file}
            uploadedUrl={uploadedDocs.allocationForm.url}
            onFileChange={handleDocUpload('allocationForm')}
          />
          <DocumentUploadCard
            title="Aadhaar Card"
            fieldName="aadharCard"
            file={uploadedDocs.aadharCard.file}
            uploadedUrl={uploadedDocs.aadharCard.url}
            onFileChange={handleDocUpload('aadharCard')}
          />
          <DocumentUploadCard
            title="PAN Card"
            fieldName="panCard"
            file={uploadedDocs.panCard.file}
            uploadedUrl={uploadedDocs.panCard.url}
            onFileChange={handleDocUpload('panCard')}
          />
        </div>
      </div>
    </div>
  );
}