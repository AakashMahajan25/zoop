import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, Card, CardContent, Typography, Select, MenuItem, FormControl, FormHelperText, CircularProgress } from '@mui/material';
import { Allocation, InsurerInformation, WorkshopDetails } from '@/types/intimationInterface';
import { getClaimHandlers, ClaimHandler } from '@/utils/api';

interface Step4Props {
  step4Data: Allocation;
  step2Data: InsurerInformation;
  step3Data: WorkshopDetails;
  handleStep4Change: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
  errors: { step4: Partial<Record<keyof Allocation, string>> };
}

export default function HandlerDetailsStep4({ step4Data, step2Data, step3Data, handleStep4Change, errors }: Step4Props) {
  const [claimHandlers, setClaimHandlers] = useState<ClaimHandler[]>([]);
  const [loadingHandlers, setLoadingHandlers] = useState(false);
  const [handlersError, setHandlersError] = useState<string | null>(null);

  // Fetch claim handlers when component mounts
  useEffect(() => {
    const fetchHandlers = async () => {
      try {
        setLoadingHandlers(true);
        setHandlersError(null);
        console.log('🔄 Step4: Fetching claim handlers from /profile/claim-handlers');
        const handlers = await getClaimHandlers();
        console.log('✅ Step4: Claim handlers fetched successfully:', handlers);
        console.log('✅ Step4: Handlers count:', handlers.length);
        setClaimHandlers(handlers);
      } catch (error: any) {
        console.error('❌ Step4: Failed to fetch claim handlers:', error);
        console.error('❌ Step4: Error message:', error.message);
        console.error('❌ Step4: Error stack:', error.stack);
        setHandlersError(`Failed to load claim handlers: ${error.message}`);
      } finally {
        setLoadingHandlers(false);
      }
    };

    fetchHandlers();
  }, []);

  // Handle claim handler selection
  const handleClaimHandlerChange = (event: any) => {
    const selectedHandlerId = event.target.value;
    const selectedHandler = claimHandlers.find(handler => handler.id === selectedHandlerId);
    
    if (selectedHandler) {
      console.log('👤 Claim handler selected:', selectedHandler);
      // Update both allocatedTo (name) and allocatedtouserid (id)
      handleStep4Change({
        target: {
          name: 'allocatedTo',
          value: selectedHandler.name
        }
      });
      handleStep4Change({
        target: {
          name: 'allocatedtouserid',
          value: selectedHandler.id
        }
      });
    }
  };

  return (
    <div className="border border-[#EFEFEFE5] p-8 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="workshopPincode" className="block text-sm font-medium text-[#000000] mb-1">
            Workshop Pincode<span className='text-red-400'>*</span>
          </label>
          <TextField
            id="workshopPincode"
            name="workshopPincode"
            type="number"
            value={step4Data.workshopPincode || "400054"}
            onChange={handleStep4Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter workshop pincode"
            error={!!errors.step4.workshopPincode}
            helperText={errors.step4.workshopPincode}
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
          <label htmlFor="state" className="block text-sm font-medium text-[#000000] mb-1">
            State <span className='text-red-400'>*</span>
          </label>
          <Select
            labelId="state-select-label"
            id="state-select"
            name="state"
            value={step4Data.state || "Maharashtra"}
            onChange={handleStep4Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50"
            displayEmpty
            renderValue={(selected) => (selected ? selected : <span style={{ color: '#757575' }}>Select State</span>)}
          >
            <MenuItem value="" disabled>
              Select State
            </MenuItem>
            {['Andhra Pradesh',
              'Bihar',
              'Karnataka',
              'Maharashtra',
              'Tamil Nadu'].map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
          {!!errors.step4.state && <FormHelperText error>{errors.step4.state}</FormHelperText>}
        </FormControl>

        <div>
          <label htmlFor="division" className="block text-sm font-medium text-[#000000] mb-1">
            Division <span className='text-red-400'>*</span>
          </label>
          <TextField
            id="division"
            name="division"
            value={step4Data.division}
            onChange={handleStep4Change}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50 w-full"
            placeholder="Enter division"
            error={!!errors.step4.division}
            helperText={errors.step4.division}
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
          <label htmlFor="allocatedTo" className="block text-sm font-medium text-[#000000] mb-1">
            Allocated To <span className='text-red-400'>*</span>
          </label>
          <Select
            labelId="allocated-to-select-label"
            id="allocated-to-select"
            name="allocatedTo"
            value={step4Data.allocatedtouserid || ''}
            onChange={handleClaimHandlerChange}
            required
            variant="outlined"
            size="small"
            className="bg-gray-50"
            displayEmpty
            disabled={loadingHandlers}
            renderValue={(selected) => {
              if (!selected) {
                return <span style={{ color: '#757575' }}>
                  {loadingHandlers ? 'Loading handlers...' : 'Select Claim Handler'}
                </span>;
              }
              const handler = claimHandlers.find(h => h.id === selected);
              return handler ? handler.name : 'Select Claim Handler';
            }}
            startAdornment={loadingHandlers ? (
              <InputAdornment position="start">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null}
          >
            <MenuItem value="" disabled>
              Select Claim Handler
            </MenuItem>
            {claimHandlers.map((handler) => (
              <MenuItem key={handler.id} value={handler.id}>
                {handler.name}
              </MenuItem>
            ))}
          </Select>
          {!!errors.step4.allocatedTo && <FormHelperText error>{errors.step4.allocatedTo}</FormHelperText>}
          {handlersError && <FormHelperText error>{handlersError}</FormHelperText>}
        </FormControl>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-50">
            <CardContent>
              <Typography variant="h6" className="mb-4">Customer Contact</Typography>
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerContactMobileNumber" className="block text-sm font-medium text-[#000000] mb-1">
                    Mobile Number <span className='text-red-400'>*</span>
                  </label>
                  <TextField
                    id="customerContactMobileNumber"
                    name="customerContactMobileNumber"
                    value={step4Data.customerContactMobileNumber || step2Data.mobileNo}
                    onChange={handleStep4Change}
                    required
                    variant="outlined"
                    size="small"
                    className="bg-white w-full"
                    placeholder="Enter mobile number"
                    error={!!errors.step4.customerContactMobileNumber}
                    helperText={errors.step4.customerContactMobileNumber}
                  />
                </div>
                <div>
                  <label htmlFor="customerContactWhatsappNumber" className="block text-sm font-medium text-[#000000] mb-1">
                    WhatsApp Number
                  </label>
                  <TextField
                    id="customerContactWhatsappNumber"
                    name="customerContactWhatsappNumber"
                    value={step4Data.customerContactWhatsappNumber || step2Data.alternateNo}
                    onChange={handleStep4Change}
                    variant="outlined"
                    size="small"
                    className="bg-white w-full"
                    placeholder="Enter WhatsApp number"
                    error={!!errors.step4.customerContactWhatsappNumber}
                    helperText={errors.step4.customerContactWhatsappNumber}
                  />
                </div>
                <div>
                  <label htmlFor="customerContactEmailAddress" className="block text-sm font-medium text-[#000000] mb-1">
                    Email Address <span className='text-red-400'>*</span>
                  </label>
                  <TextField
                    id="customerContactEmailAddress"
                    name="customerContactEmailAddress"
                    value={step4Data.customerContactEmailAddress || step2Data.emailAddress}
                    onChange={handleStep4Change}
                    required
                    variant="outlined"
                    size="small"
                    className="bg-white w-full"
                    placeholder="Enter email address"
                    error={!!errors.step4.customerContactEmailAddress}
                    helperText={errors.step4.customerContactEmailAddress}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50">
            <CardContent>
              <Typography variant="h6" className="mb-4">Workshop Contact</Typography>
              <div className="space-y-4">
                <div>
                  <label htmlFor="workshopContactMobileNumber" className="block text-sm font-medium text-[#000000] mb-1">
                    Mobile Number <span className='text-red-400'>*</span>
                  </label>
                  <TextField
                    id="workshopContactMobileNumber"
                    name="workshopContactMobileNumber"
                    value={step4Data.workshopContactMobileNumber || step3Data.mobileNo}
                    onChange={handleStep4Change}
                    required
                    variant="outlined"
                    size="small"
                    className="bg-white w-full"
                    placeholder="Enter mobile number"
                    error={!!errors.step4.workshopContactMobileNumber}
                    helperText={errors.step4.workshopContactMobileNumber}
                  />
                </div>
                <div>
                  <label htmlFor="workshopContactWhatsappNumber" className="block text-sm font-medium text-[#000000] mb-1">
                    WhatsApp Number
                  </label>
                  <TextField
                    id="workshopContactWhatsappNumber"
                    name="workshopContactWhatsappNumber"
                    value={step4Data.workshopContactWhatsappNumber}
                    onChange={handleStep4Change}
                    variant="outlined"
                    size="small"
                    className="bg-white w-full"
                    placeholder="Enter WhatsApp number"
                    error={!!errors.step4.workshopContactWhatsappNumber}
                    helperText={errors.step4.workshopContactWhatsappNumber}
                  />
                </div>
                <div>
                  <label htmlFor="workshopContactEmailAddress" className="block text-sm font-medium text-[#000000] mb-1">
                    Email Address <span className='text-red-400'>*</span>
                  </label>
                  <TextField
                    id="workshopContactEmailAddress"
                    name="workshopContactEmailAddress"
                    value={step4Data.workshopContactEmailAddress || step3Data.emailAddress}
                    onChange={handleStep4Change}
                    required
                    variant="outlined"
                    size="small"
                    className="bg-white w-full"
                    placeholder="Enter email address"
                    error={!!errors.step4.workshopContactEmailAddress}
                    helperText={errors.step4.workshopContactEmailAddress}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}