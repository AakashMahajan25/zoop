import React from 'react';
import { TextField, InputAdornment, FormHelperText, FormControl } from '@mui/material';
import DocumentUploadCard from './DocumentUploadCard';

// New schema interface matching the context
interface WorkshopDetails {
  workshopName: string;
  mobileNo: string;
  emailAddress: string;
  estimatedCost: number;
  addressLine1: string;
  addressLine2: string;
  state: string;
  pincode: string;
  natureOfLoss: string;
  estimateFilePath: string;
  otherFilePath: string;
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

interface Step3Props {
  step3Data: WorkshopDetails;
  handleStep3Change: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { step3: Partial<Record<keyof WorkshopDetails, string>> };
  docErrors: Partial<Record<keyof UploadedDocuments, string>>;
  uploadedDocs: UploadedDocuments;
  handleDocUpload: (fieldName: keyof UploadedDocuments) => (file: File | null) => void;
}

export default function WorkshopDetailsStep3({ step3Data, handleStep3Change, errors, docErrors,  uploadedDocs, handleDocUpload }: Step3Props) {
  return (
    <div className="border border-[#EFEFEFE5] p-8 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="workShopName" className="block text-sm font-medium text-[#000000] mb-1">
            Workshop Name <span className='text-red-400'>*</span>
          </label>
          <TextField
            id="workShopName"
            name="workshopName"
            value={step3Data.workshopName}
            onChange={handleStep3Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter workshop name"
            error={!!errors.step3.workshopName}
            helperText={errors.step3.workshopName}
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
          <label htmlFor="mobileNo" className="block text-sm font-medium text-[#000000] mb-1">
            Mobile No.<span className='text-red-400'>*</span>
          </label>
          <TextField
            id="mobileNo"
            name="mobileNo"
            value={step3Data.mobileNo}
            onChange={handleStep3Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter mobile number"
            error={!!errors.step3.mobileNo}
            helperText={errors.step3.mobileNo}
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
          <label htmlFor="emailAddress" className="block text-sm font-medium text-[#000000] mb-1">
            Email Address <span className='text-red-400'>*</span>
          </label>
          <TextField
            id="emailAddress"
            name="emailAddress"
            type="email"
            value={step3Data.emailAddress}
            onChange={handleStep3Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter email address"
            error={!!errors.step3.emailAddress}
            helperText={errors.step3.emailAddress}
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
          <label htmlFor="estimatedCost" className="block text-sm font-medium text-[#000000] mb-1">
            Estimated Cost
          </label>
          <TextField
            id="estimatedCost"
            name="estimatedCost"
            type="number"
            value={step3Data.estimatedCost}
            onChange={handleStep3Change}
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter estimated cost"
            error={!!errors.step3.estimatedCost}
            helperText={errors.step3.estimatedCost}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
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
          <label htmlFor="natureOfLoss" className="block text-sm font-medium text-[#000000] mb-1">
            Nature of Loss
          </label>
          <TextField
            id="natureOfLoss"
            name="natureOfLoss"
            value={step3Data.natureOfLoss}
            onChange={handleStep3Change}
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter nature of loss"
            error={!!errors.step3.natureOfLoss}
            helperText={errors.step3.natureOfLoss}
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
          <label htmlFor="addressLine1" className="block text-sm font-medium text-[#000000] mb-1">
            Address Line 1 <span className='text-red-400'>*</span>
          </label>
          <TextField
            id="addressLine1"
            name="addressLine1"
            value={step3Data.addressLine1}
            onChange={handleStep3Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter address line 1"
            error={!!errors.step3.addressLine1}
            helperText={errors.step3.addressLine1}
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
          <label htmlFor="addressLine2" className="block text-sm font-medium text-[#000000] mb-1">
            Address Line 2
          </label>
          <TextField
            id="addressLine2"
            name="addressLine2"
            value={step3Data.addressLine2}
            onChange={handleStep3Change}
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter address line 2"
            error={!!errors.step3.addressLine2}
            helperText={errors.step3.addressLine2}
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
          <label htmlFor="state" className="block text-sm font-medium text-[#000000] mb-1">
            State
          </label>
          <TextField
            id="state"
            name="state"
            value={step3Data.state}
            onChange={handleStep3Change}
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter state"
            error={!!errors.step3.state}
            helperText={errors.step3.state}
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
          <label htmlFor="pincode" className="block text-sm font-medium text-[#000000] mb-1">
            Pincode
          </label>
          <TextField
            id="pincode"
            name="pincode"
            type="number"
            value={step3Data.pincode}
            onChange={handleStep3Change}
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter pincode"
            error={!!errors.step3.pincode}
            helperText={errors.step3.pincode}
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
            title="Workshop Estimate"
            fieldName="workshopEstimate"
            file={uploadedDocs.workshopEstimate.file}
            uploadedUrl={uploadedDocs.workshopEstimate.url}
            onFileChange={handleDocUpload('workshopEstimate')}
          />
          <DocumentUploadCard
            title="Other Documents"
            fieldName="other"
            file={uploadedDocs.other.file}
            uploadedUrl={uploadedDocs.other.url}
            onFileChange={handleDocUpload('other')}
          />
        </div>
      </div>
    </div>
  );
}