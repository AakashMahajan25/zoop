// ClaimDetailsStep1.tsx
import React from 'react';
import {
  FormControl,
  FormHelperText,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DocumentUploadCard from './DocumentUploadCard';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

// New schema interface matching the context
interface PolicyDetails {
  insurer: string;
  policyNo: string;
  policyDate: string;
  policyEndDate: string;
  claimsNo: string;
  insurerBranch: string;
  placeOfIncident: string;
  dateOfIncident: string;
  policeReportFiled: boolean;
  panchanCarriedOut: boolean;
  policeStationName: string;
  stationDetail: string;
  policyCopyFilePath: string;
  intimationFormFilePath: string;
  claimsFormFilePath: string;
  vehicleRcFilePath: string;
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

export interface Step1Props {
  step1Data: PolicyDetails;
  setStep1Data: React.Dispatch<React.SetStateAction<PolicyDetails>>;
  errors: { step1: Partial<Record<keyof PolicyDetails, string>> };
  docErrors: Partial<Record<keyof UploadedDocuments, string>>;
  handleStep1Change: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
  uploadedDocs: UploadedDocuments;
  handleDocUpload: (fieldName: keyof UploadedDocuments) => (file: File | null) => void;
}

export default function ClaimDetailsStep1({
  step1Data,
  setStep1Data,
  errors,
  docErrors,
  handleStep1Change,
  uploadedDocs,
  handleDocUpload,
}: Step1Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="border border-[#EFEFEFE5] p-8 m-8">
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <FormControl className="w-full">
            <label htmlFor="policyNo" className="block text-sm font-medium text-[#000000] mb-1">
              Insurer <span className='text-red-400'>*</span>
            </label>
            <Select
              labelId="insurer-select-label"
              id="insurer-select"
              name="insurer"
              value={step1Data.insurer}
              onChange={handleStep1Change}
              required
              variant="outlined"
              size="small"
              className="bg-gray-50"
              displayEmpty
              renderValue={(selected) => {
                const selectedInsurer = [
                  { id: "1", name: "Insurer 1" },
                  { id: "2", name: "Insurer 2" },
                  { id: "3", name: "Insurer 3" },
                ].find((insurer) => insurer.id === selected);
                return selectedInsurer ? selectedInsurer.name : <span style={{ color: '#757575' }}>Select Insurer</span>;
              }}
            >
              <MenuItem value="" disabled>
                Select Insurer
              </MenuItem>
              {[
                { id: "1", name: "Insurer 1" },
                { id: "2", name: "Insurer 2" },
                { id: "3", name: "Insurer 3" },
              ].map((insurer) => (
                <MenuItem key={insurer.id} value={insurer.id}>
                  {insurer.name}
                </MenuItem>
              ))}
            </Select>
            {!!errors.step1.insurer && <FormHelperText error>{errors.step1.insurer}</FormHelperText>}
          </FormControl>

          <div>
            <label htmlFor="policy_number" className="block text-sm font-medium text-[#000000] mb-1">
              Policy Number <span className='text-red-400'>*</span>
            </label>
            <TextField
              id="policy_number"
              name="policyNo"
              value={step1Data.policyNo}
              onChange={handleStep1Change}
              required
              variant="outlined"
              size="small"
              className="bg-gray-50 w-full"
              placeholder="Enter Policy number"
              error={!!errors.step1.policyNo}
              helperText={errors.step1.policyNo}
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
            <label htmlFor="policyDate" className="block text-sm font-medium text-[#000000] mb-1">
              Policy Date <span className='text-red-400'>*</span>
            </label>
            <DatePicker
              //@ts-ignore
                id="policyDate"
                value={step1Data.policyDate ? dayjs(step1Data.policyDate) : null}
                onChange={(newValue) => setStep1Data({ ...step1Data, policyDate: newValue && 'format' in newValue ? newValue.format("YYYY-MM-DD") : '' })}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    size: "small",
                    className: "bg-gray-50 w-full",
                    placeholder: "Select Policy Date",
                    error: !!errors.step1.policyDate,
                    helperText: errors.step1.policyDate,
                    sx: {
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                    }
                  }
                }}
              />
              {errors.step1.policyDate && (
      <FormHelperText error className="ml-1">
        {errors.step1.policyDate}
      </FormHelperText>
    )}
          </div>

          <div>
            <label htmlFor="policyEndDate" className="block text-sm font-medium text-[#000000] mb-1">
              Policy End Date <span className='text-red-400'>*</span>
            </label>
            <DatePicker
              //@ts-ignore
                id="policyEndDate"
                value={step1Data.policyEndDate ? dayjs(step1Data.policyEndDate) : null}
                onChange={(newValue) => setStep1Data({ ...step1Data, policyEndDate: newValue && 'format' in newValue ? newValue.format("YYYY-MM-DD") : '' })}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    size: "small",
                    className: "bg-gray-50 w-full",
                    placeholder: "Select Policy End Date",
                    error: !!errors.step1.policyEndDate,
                    helperText: errors.step1.policyEndDate,
                    sx: {
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                    }
                  }
                }}
              />
              {errors.step1.policyEndDate && (
      <FormHelperText error className="ml-1">
        {errors.step1.policyEndDate}
      </FormHelperText>
    )}
          </div>

          <div>
            <label htmlFor="claim_number" className="block text-sm font-medium text-[#000000] mb-1">
              Claim Number <span className='text-red-400'>*</span>
            </label>
            <TextField
              id="claim_number"
              name="claimsNo"
              value={step1Data.claimsNo}
              onChange={handleStep1Change}
              required
              variant="outlined"
              size="small"
              className="bg-gray-50 w-full"
              placeholder="Enter Claim Number"
              error={!!errors.step1.claimsNo}
              helperText={errors.step1.claimsNo}
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

          <FormControl className="w-full">
            <label htmlFor="insurerBranch" className="block text-sm font-medium text-[#000000] mb-1">
              Insurer Branch <span className='text-red-400'>*</span>
            </label>
            <Select
              labelId="insurerBranch-select-label"
              id="insurerBranch-select"
              name="insurerBranch"
              value={step1Data.insurerBranch}
              onChange={handleStep1Change}
              variant="outlined"
              size="small"
              className="bg-gray-50"
              displayEmpty
              renderValue={(selected) => (selected ? selected : <span style={{ color: '#757575' }}>Select Branch</span>)}
            >
              <MenuItem value="" disabled>
                Select Branch
              </MenuItem>
              {['Branch 1', 'Branch 2', 'Branch 3'].map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
            {!!errors.step1.insurerBranch && <FormHelperText error>{errors.step1.insurerBranch}</FormHelperText>}
          </FormControl>

          <div>
            <label htmlFor="place_of_loss" className="block text-sm font-medium text-[#000000] mb-1">
              Place of Incident <span className='text-red-400'>*</span>
            </label>
            <TextField
              id="place_of_loss"
              name="placeOfIncident"
              value={step1Data.placeOfIncident}
              onChange={handleStep1Change}
              required
              variant="outlined"
              size="small"
              className="bg-gray-50 w-full"
              placeholder="Enter Place of Incident"
              error={!!errors.step1.placeOfIncident}
              helperText={errors.step1.placeOfIncident}
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
            <label htmlFor="dateOfIncident" className="block text-sm font-medium text-[#000000] mb-1">
              Date of Incident <span className='text-red-400'>*</span>
            </label>
            <DatePicker
              //@ts-ignore
                id="dateOfIncident"
                value={step1Data.dateOfIncident ? dayjs(step1Data.dateOfIncident) : null}
                onChange={(newValue) => setStep1Data({ ...step1Data, dateOfIncident: newValue && 'format' in newValue ? newValue.format("YYYY-MM-DD") : '' })}
                slotProps={{
                  textField: {
                    variant: "outlined",
                    size: "small",
                    className: "bg-gray-50 w-full",
                    placeholder: "Select Date of Incident",
                    error: !!errors.step1.dateOfIncident,
                    helperText: errors.step1.dateOfIncident,
                    sx: {
                      '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                      '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D1D5DB',
                      },
                    }
                  }
                }}
              />
              {errors.step1.dateOfIncident && (
      <FormHelperText error className="ml-1">
        {errors.step1.dateOfIncident}
      </FormHelperText>
    )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-1">
              Police Report Filed <span className='text-red-400'>*</span>
            </label>
            <RadioGroup
              row
              name="policeReportFiled"
              value={step1Data.policeReportFiled ? "true" : "false"}
              onChange={(e) =>
                setStep1Data({
                  ...step1Data,
                  policeReportFiled: e.target.value === "true",
                })
              }
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#000000] mb-1">
              Panchan Carried Out <span className='text-red-400'>*</span>
            </label>
            <RadioGroup
              row
              name="panchanCarriedOut"
              value={step1Data.panchanCarriedOut ? "true" : "false"}
              onChange={(e) =>
                setStep1Data({
                  ...step1Data,
                  panchanCarriedOut: e.target.value === "true",
                })
              }
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </div>

          <div>
            <label htmlFor="policeStationName" className="block text-sm font-medium text-[#000000] mb-1">
              Police Station Name <span className='text-red-400'>*</span>
            </label>
            <TextField
              id="policeStationName"
              name="policeStationName"
              value={step1Data.policeStationName}
              onChange={handleStep1Change}
              required
              variant="outlined"
              size="small"
              className="bg-gray-50 w-full"
              placeholder="Enter Police Station Name"
              error={!!errors.step1.policeStationName}
              helperText={errors.step1.policeStationName}
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
            <label htmlFor="stationDetail" className="block text-sm font-medium text-[#000000] mb-1">
              Station Detail <span className='text-red-400'>*</span>
            </label>
            <TextField
              id="stationDetail"
              name="stationDetail"
              value={step1Data.stationDetail}
              onChange={handleStep1Change}
              required
              variant="outlined"
              size="small"
              className="bg-gray-50 w-full"
              placeholder="Enter Station Detail"
              error={!!errors.step1.stationDetail}
              helperText={errors.step1.stationDetail}
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
          <Typography variant="h6" className="mb-4">
            Document Upload
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DocumentUploadCard
              title="Policy Copy"
              fieldName="policyCopy"
              file={uploadedDocs.policyCopy.file}
              uploadedUrl={uploadedDocs.policyCopy.url}
              onFileChange={handleDocUpload('policyCopy')}
            />
            <DocumentUploadCard
              title="Intimation Form"
              fieldName="intimationForm"
              file={uploadedDocs.intimationForm.file}
              uploadedUrl={uploadedDocs.intimationForm.url}
              onFileChange={handleDocUpload('intimationForm')}
            />
            <DocumentUploadCard
              title="Claims Form"
              fieldName="claimsForm"
              file={uploadedDocs.claimsForm.file}
              uploadedUrl={uploadedDocs.claimsForm.url}
              onFileChange={handleDocUpload('claimsForm')}
            />
            <DocumentUploadCard
              title="Vehicle RC"
              fieldName="vehicleRC"
              file={uploadedDocs.vehicleRC.file}
              uploadedUrl={uploadedDocs.vehicleRC.url}
              onFileChange={handleDocUpload('vehicleRC')}
            />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}