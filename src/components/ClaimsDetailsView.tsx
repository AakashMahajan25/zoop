import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState, useEffect } from "react";
import { RowData } from "./intimationSection/Tables/IntimationListTable";
import { getClaimsById } from "@/utils/getClaimsById";
import FilePreview from "./FilePreview";

interface ClaimsDetailsViewProps {
  selectedClaim: RowData;
}

export default function ClaimsDetailsView({
  selectedClaim,
}: ClaimsDetailsViewProps): ReactElement {

  console.log(selectedClaim,"selectedClaim")
   const id = selectedClaim?.id;
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);
  console.log(details,'details')
  const policyDetails = details?.policyDetails
  const insurerInformation = details?.insurerInformation
  const workshopDetails = details?.workshopDetails
  const allocation = details?.allocation
console.log(policyDetails,'policyDetails')
console.log(insurerInformation,'policyDetails')
console.log(workshopDetails,'policyDetails')
   
useEffect(() => {
  console.log("kjhg",id)
    if (!id) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const resp = await getClaimsById(String(id));
        const data = resp?.data?.data ?? resp?.data ?? resp;

        if (!cancelled) setDetails(data);
      } catch (e: any) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {  
      cancelled = true;
    };
  }, [id]);

    return(
      <div className="px-6 font-geist bg-[#FBFBFB]">
  <div className="mb-6">
  </div>
  <div className='flex flex-col gap-3 '>
    <div className='border border-[#F4F4F5]'>
      <div className="flex justify-between items-center p-4">
        <h2 className='font-bold text-[20px] text-[#333333]'>Claim Details</h2>
        {/* <button className="text-[#09090B] text-[14px] font-medium flex items-center gap-1">Edit <img src='/assets/editIcon.svg' className="h-[20px]" alt="editIcon" /></button> */}
      </div>
      <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Insurer</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.insurer}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Policy Number</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.policyNo}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Policy Period</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.policyDate}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Insurer Branch</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.insurerBranch}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Claim Number</h3>
          <p className="text-[#474747] text-[14px]">{selectedClaim.claimNumber}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Date of Incident</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.dateOfIncident}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Place of Incident</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.placeOfIncident}</p>
        </div>
      </div>
      <div className='grid grid-cols-4  gap-3 border-b border-[#F4F4F5] m-4'>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Police Report</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.policeReportFiled}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Panchnama Carried out</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.panchanCarriedOut}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Station Diary Entry Number</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.stationDetail}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Police Station Name</h3>
          <p className="text-[#474747] text-[14px]">{policyDetails?.policeStationName}</p>
        </div>
      </div>
      <div className='grid grid-cols-4  gap-3 border-b border-[#F4F4F5] mx-4 pb-4'>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Intimation Form</h3>
          {/* <img src={policyDetails?.intimationFormFilePath} alt='intimationFormFilePath' /> */}
          <FilePreview
              url={policyDetails?.intimationFormFilePath}
              alt="intimationFormFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Claim Form</h3>
          <FilePreview
              url={policyDetails?.policyCopyFilePath}
              alt="policyCopyFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Policy Copy</h3>
          {/* <img src={policyDetails?.policyCopyFilePath} alt='policyCopyFilePath' /> */}
          <FilePreview
              url={policyDetails?.policyCopyFilePath}
              alt="Policy Copy"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Vehicle Copy</h3>
          {/* <img src={policyDetails?.vehicleRcFilePath} alt='vehicleRcFilePath' /> */}
          <FilePreview
              url={policyDetails?.vehicleRcFilePath}
              alt="vehicleRcFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
      </div>
    </div>
    
    <div className='border border-[#F4F4F5]'>
      <div className="flex justify-between items-center p-4">
        <h2 className='font-bold text-[20px] text-[#333333]'>Customer Details</h2>
        {/* <button className="text-[#09090B] text-[14px] font-medium flex items-center gap-1">Edit <img src='/assets/editIcon.svg' className="h-[20px]" alt="editIcon" /></button> */}
      </div>
      <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Insured Name (as on policy)</h3>
          <p className="text-[#474747] text-[14px]">{insurerInformation?.insurerName}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
          <p className="text-[#474747] text-[14px]">{insurerInformation?.mobileNo}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
          <p className="text-[#474747] text-[14px]">{insurerInformation?.emailAddress}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Vehicle Number</h3>
          <p className="text-[#474747] text-[14px]">{insurerInformation?.vehicleNo}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Driver Name</h3>
          <p className="text-[#474747] text-[14px]">{insurerInformation?.driverName}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Alternate Mobile Number</h3>
          <p className="text-[#474747] text-[14px]">{insurerInformation?.alternateNo}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Alternate Email Address</h3>
          <p className="text-[#474747] text-[14px]">{insurerInformation?.alternateEmail}</p>
        </div>
      </div>
      <div className='grid grid-cols-4  gap-3 border-b border-[#F4F4F5] mx-4 pb-4'>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Driving License</h3>
          <FilePreview
              url={insurerInformation?.drivingLicenseFilePath}
              alt="drivingLicenseFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Registration Certificate</h3>
          <FilePreview
              url={insurerInformation?.registrationCertificateFilePath}
              alt="registrationCertificateFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Aadhaar Card</h3>
          <FilePreview
              url={insurerInformation?.aadhaarCardFilePath}
              alt="aadhaarCardFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Pan Card</h3>
          <FilePreview
              url={insurerInformation?.panCardFilePath}
              alt="panCardFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
      </div>
    </div>
    
    <div className='border border-[#F4F4F5]'>
      <div className="flex justify-between items-center p-4">
        <h2 className='font-bold text-[20px] text-[#333333]'>Workshop Details</h2>
        {/* <button className="text-[#09090B] text-[14px] font-medium flex items-center gap-1">Edit <img src='/assets/editIcon.svg' className="h-[20px]" alt="editIcon" /></button> */}
      </div>
      <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Workshop Name</h3>
          <p className="text-[#474747] text-[14px]">{workshopDetails?.workshopName}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
          <p className="text-[#474747] text-[14px]">{workshopDetails?.mobileNo}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
          <p className="text-[#474747] text-[14px]">{workshopDetails?.emailAddress}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Estimate Repair Cost</h3>
          <p className="text-[#474747] text-[14px]">{workshopDetails?.estimatedCost}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Nature of Loss</h3>
          <p className="text-[#474747] text-[14px]">{workshopDetails?.natureOfLoss}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Address</h3>
          <p className="text-[#474747] text-[14px]">{workshopDetails?.addressLine1},{workshopDetails?.addressLine2}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">State</h3>
          <p className="text-[#474747] text-[14px]">{workshopDetails?.state}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Pin Code</h3>
          <p className="text-[#474747] text-[14px]">{workshopDetails?.pincode}</p>
        </div>
      </div>
      <div className='grid grid-cols-4  gap-3 border-b border-[#F4F4F5] mx-4 pb-4'>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Estimate</h3>
          <FilePreview
              url={workshopDetails?.estimateFilePath}
              alt="estimateFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585] my-2">Other</h3>
          <FilePreview
              url={workshopDetails?.otherFilePath}
              alt="otherFilePath"
              className=""         // keep your classes if needed
              height={100}         // tweak PDF/video height if you want
            />
        </div>
      </div>
    </div>
    
    <div className='border border-[#F4F4F5]'>
      <div className="flex justify-between items-center p-4">
        <h2 className='font-bold text-[16px] text-[#333333]'>Workshop Details</h2>
        {/* <button className="text-[#09090B] text-[14px] font-medium flex items-center gap-1">Edit <img src='/assets/editIcon.svg' className="h-[20px]" alt="editIcon" /></button> */}
      </div>
      <div className="grid grid-cols-4 gap-4 border-b border-[#F4F4F5] mx-4">
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Allocate To</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.allocatedTo}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Workshop Mobile Number</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.workshopContactMobileNumber}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Workshop Whatsapp Number</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.workshopContactWhatsappNumber}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Workshop Email Address</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.workshopContactEmailAddress}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Workshop Pin code</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.workshopPincode}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">State</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.state}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Division</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.division}</p>
        </div>
      </div>
    </div>
    
    <div className='border border-[#F4F4F5] mb-4'>
      <div className="flex justify-between items-center p-4">
        {/* <h2 className='font-bold text-[20px] text-[#333333]'>Contact Details</h2> */}
        {/* <button className="text-[#09090B] text-[14px] font-medium flex items-center gap-1">Edit <img src='/assets/editIcon.svg' className="h-[20px]" alt="editIcon" /></button> */}
      </div>
      <h2 className='font-bold text-[16px] text-[#333333] px-4'>Customer</h2>
      <div className="grid grid-cols-4 gap-4 mx-4">
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.customerContactMobileNumber}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">WhatsApp Number</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.customerContactWhatsappNumber}</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
          <p className="text-[#474747] text-[14px]">{allocation?.customerContactEmailAddress}</p>
        </div>
      </div>
      {/* <h2 className='font-bold text-[16px] text-[#333333] p-4'>Garage</h2>
      <div className="grid grid-cols-4 gap-4 mx-4">
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Mobile Number</h3>
          <p className="text-[#474747] text-[14px]">Raheja Insurance Co.</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">WhatsApp Number</h3>
          <p className="text-[#474747] text-[14px]">0000000000</p>
        </div>
        <div className="p-2">
          <h3 className="text-[14px] font-medium text-[#858585]">Email Address</h3>
          <p className="text-[#474747] text-[14px]">27/03/2023 - 27/03/2028</p>
        </div>
      </div> */}
    </div>
  </div>
</div>
    )
}