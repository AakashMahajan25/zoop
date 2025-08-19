import React, { useState, useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import {
    WorkshopDocumentUploadProps,
    FileArray,
    SingleFileArray,
    UploadedFile,
} from "./types";
import { validateStep1, validatePersonalInfo } from "./validation";

const WorkshopDocumentUpload: React.FC<WorkshopDocumentUploadProps> = ({
    selectedRole,
    setUploadAssessmentModal,
    setStep,
    claimDetails,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [filesStep1, setFilesStep1] = useState<FileArray>(Array(8).fill([]));
    const [filesStep2Top, setFilesStep2Top] = useState<FileArray>(
        Array(3).fill([])
    );
    const [filesStep2Left, setFilesStep2Left] = useState<FileArray>(
        Array(4).fill([])
    );
    const [filesStep2Right, setFilesStep2Right] = useState<FileArray>(
        Array(4).fill([])
    );
    const [drivingLicense, setDrivingLicense] = useState<SingleFileArray>([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [step1Errors, setStep1Errors] = useState<string[]>([]);
    const [personalInfoErrors, setPersonalInfoErrors] = useState<{
        firstName?: string;
        lastName?: string;
    }>({});

    useEffect(() => {
        if (!claimDetails?.reference_id) return;
      
        const fetchUploads = async () => {
          try {
            const rolePath = selectedRole === "workshop" ? "workshop" : "customer";
            const res = await fetch(
              `http://13.235.82.24:8080/api/v1/uploads/${rolePath}/claims/${claimDetails?.reference_id}/uploads`
            );
            if (!res.ok) throw new Error("Failed to fetch uploads");
      
            const data = await res.json();
            if (data?.data) {
              mapUploadsToState(data.data);
            }
          } catch (err) {
            console.error("Error fetching uploads", err);
          }
        };
      
        fetchUploads();
      }, [claimDetails?.reference_id, selectedRole]);

    const handleNextStep = () => {
        if (currentStep === 1) {
            // const errors = validateStep1(filesStep1, selectedRole);
            // setStep1Errors(errors);
            // if (errors.some(error => error)) {
            //   return;
            // }
        } else if (currentStep === 3 && selectedRole === "customer") {
            const errors = validatePersonalInfo(firstName, lastName);
            setPersonalInfoErrors(errors);

            if (errors.firstName || errors.lastName) {
                return;
            }
        }

        if (selectedRole === "workshop" && currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else if (selectedRole === "customer" && currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
        if (currentStep === 1) {
            setUploadAssessmentModal(true);
        }
    };

    const mapUploadsToState = (data: { documents: any[]; media: any[] }) => {
        const { documents, media } = data;
      
        // Clone current state so we don't mutate directly
        const step1 = [...filesStep1];
        const top = [...filesStep2Top];
        const left = [...filesStep2Left];
        const right = [...filesStep2Right];
      
        // 1️⃣ Documents mapping
        documents.forEach(doc => {
          const idx = doc.document_type_id - 1;
          if (idx >= 0 && idx < step1.length && step1[idx].length === 0) {
            step1[idx] = [
              { name: doc.file_url.split("/").pop() || "", url: doc.file_url }
            ];
          }
          if (doc.document_type_id === 2 && drivingLicense.length === 0) {
            setDrivingLicense([
              { name: doc.file_url.split("/").pop() || "", url: doc.file_url }
            ]);
          }
        });
      
        // 2️⃣ Media mapping
        // Adjust mapping arrays so section_id matches your step structure
        const step2TopSections = [1, 2, 3];
        const step2LeftSections = [4, 5, 6, 7];
        const step2RightSections = [8, 9, 10, 11];
      
        media.forEach(m => {
          if (step2TopSections.includes(m.section_id)) {
            const idx = step2TopSections.indexOf(m.section_id);
            if (top[idx].length === 0) {
              top[idx] = [
                { name: m.file_url.split("/").pop() || "", url: m.file_url }
              ];
            }
          }
          if (step2LeftSections.includes(m.section_id)) {
            const idx = step2LeftSections.indexOf(m.section_id);
            if (left[idx].length === 0) {
              left[idx] = [
                { name: m.file_url.split("/").pop() || "", url: m.file_url }
              ];
            }
          }
          if (step2RightSections.includes(m.section_id)) {
            const idx = step2RightSections.indexOf(m.section_id);
            if (right[idx].length === 0) {
              right[idx] = [
                { name: m.file_url.split("/").pop() || "", url: m.file_url }
              ];
            }
          }
        });
      
        // 3️⃣ Update state
        setFilesStep1(step1);
        setFilesStep2Top(top);
        setFilesStep2Left(left);
        setFilesStep2Right(right);
      };

    const handleConfirm = async () => {
        if (selectedRole === "customer" && currentStep === 4) {
            const errors = validatePersonalInfo(firstName, lastName);
            setPersonalInfoErrors(errors);
            if (errors.firstName || errors.lastName) {
                return;
            }
        }

        try {
            const claimId = claimDetails?.reference_id;
            const baseUrl = "http://13.235.82.24:8080/api/v1/uploads";
            const rolePath =
                selectedRole === "workshop" ? "workshop" : "customer";

            // helper for single POST
            const uploadFiles = async (
                files: { file: UploadedFile; extra: Record<string, any> }[],
                endpoint: string
            ) => {
                const newFiles = files.filter(
                    ({ file }) => file instanceof File
                );
                if (!newFiles.length) return;

                const formData = new FormData();
                newFiles.forEach(({ file }) => {
                    if (file instanceof File) {
                        formData.append("files", file);
                    }
                });
                formData.append(
                    "meta",
                    JSON.stringify(newFiles.map(({ extra }) => extra))
                );

                const res = await fetch(
                    `${baseUrl}/${rolePath}/claims/${claimId}/${endpoint}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );
                if (!res.ok) throw new Error(`Upload failed: ${endpoint}`);
            };

            // Collect all documents
            const documentsToUpload: {
                file: UploadedFile;
                extra: Record<string, any>;
            }[] = [];
            const step1DocMapping = [
                { idx: 0, document_type_id: 1 },
                { idx: 1, document_type_id: 2 },
                { idx: 2, document_type_id: 3 },
                { idx: 3, document_type_id: 4 },
                { idx: 4, document_type_id: 5 },
                { idx: 5, document_type_id: 6 },
                { idx: 7, document_type_id: 7 },
            ];
            step1DocMapping.forEach(({ idx, document_type_id }) => {
                if (filesStep1[idx]?.length) {
                    filesStep1[idx].forEach(file => {
                        documentsToUpload.push({
                            file,
                            extra: { document_type_id },
                        });
                    });
                }
            });
            if (drivingLicense.length) {
                drivingLicense.forEach(file => {
                    documentsToUpload.push({
                        file,
                        extra: { document_type_id: 2 },
                    }); // Driving License
                });
            }

            // Collect all media
            const mediaToUpload: {
                file: UploadedFile;
                extra: Record<string, any>;
            }[] = [];
            if (filesStep1[6]?.length) {
                filesStep1[6].forEach(file => {
                    mediaToUpload.push({ file, extra: { section_id: 1 } }); // Vehicle Photos (Side)
                });
            }
            const step2TopSections = [2, 3, 4];
            filesStep2Top.forEach((arr, idx) => {
                arr.forEach(file => {
                    mediaToUpload.push({
                        file,
                        extra: { section_id: step2TopSections[idx] },
                    });
                });
            });
            const step2LeftSections = [5, 6, 7, 8];
            filesStep2Left.forEach((arr, idx) => {
                arr.forEach(file => {
                    mediaToUpload.push({
                        file,
                        extra: { section_id: step2LeftSections[idx] },
                    });
                });
            });
            const step2RightSections = [9, 10, 11, 12];
            filesStep2Right.forEach((arr, idx) => {
                arr.forEach(file => {
                    mediaToUpload.push({
                        file,
                        extra: { section_id: step2RightSections[idx] },
                    });
                });
            });

            // 3️⃣ Upload in 2 requests
            await uploadFiles(documentsToUpload, "documents");
            await uploadFiles(mediaToUpload, "media");

            // 4️⃣ Reset state
            setCurrentStep(1);
            setFilesStep1(Array(7).fill([]));
            setFilesStep2Top(Array(3).fill([]));
            setFilesStep2Left(Array(4).fill([]));
            setFilesStep2Right(Array(4).fill([]));
            setDrivingLicense([]);
            setFirstName("");
            setLastName("");
            setShowSuccessModal(true);
            setCountdown(10);

            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 0) {
                        clearInterval(interval);
                        setShowSuccessModal(false);
                        setStep("uploadedDocument");
                        setUploadAssessmentModal(true); 
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            console.error(err);
            alert("Error uploading files. Please try again.");
        }
    };

    const handleEditStep = (step: number) => () => setCurrentStep(step);

    const renderStepper = () => {
        const totalSteps = selectedRole === "workshop" ? 3 : 4;
        const stepTitles =
            selectedRole === "workshop"
                ? ["Documents Required: Personal & Vehicle", "Damage", "Review"]
                : [
                      "Documents Required: Personal & Vehicle",
                      "Vehicle Photo Upload: Private Vehicle",
                      "Vehicle Photo Upload: Private Vehicle",
                      "Review",
                  ];

        return (
            <div className="mb-6 text-center">
                <div className="py-2 px-2">
                    <h2 className="text-[#4C4C4C] text-[20px] font-semibold text-left">
                        Claim Document & Media Upload
                    </h2>
                    <p className="text-[#858585] text-[14px] text-left py-2">
                        Please upload the required documents and media below to
                        proceed with your claim assessment.
                    </p>
                </div>
                <div className="bg-[#F4FFFACC] py-2 px-4">
                    <h2 className="text-[16px] font-medium text-[#000000] mb-2">
                        {stepTitles[currentStep - 1]}
                    </h2>

                    <div className="flex items-center w-full lg:px-16">
                        {[...Array(totalSteps)].map((_, index) => {
                            const step = index + 1;
                            const isActive = currentStep === step;
                            const isCompleted = currentStep > step;

                            return (
                                <React.Fragment key={step}>
                                    {/* Step circle */}
                                    <div className="flex items-center">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center border text-sm font-medium ${
                                                isActive || isCompleted
                                                    ? "bg-[#21FF91] text-[#000000] border-[#00E58F]"
                                                    : "bg-white text-[#000000] border-[#00E58F]"
                                            }`}
                                        >
                                            {step}
                                        </div>
                                    </div>

                                    {/* Line (render only if not last step) */}
                                    {step < totalSteps && (
                                        <div
                                            className={`flex-1 h-0.5 mx-2 ${
                                                currentStep > step
                                                    ? "bg-[#00E58F]"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="my-8">
            <div className="flex flex-col items-center gap-2">
                <img className="mr-3" src="../assets/logo.svg" alt="logo" />
                <div className="w-full bg-white px-6 py-4 lg:px-10">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 text-sm text-gray-700 w-full">
                        <div>
                            <p className="text-[14px] text-[#858585]">
                                Claim Reference ID
                            </p>
                            <p className="text-[14px] text-[#484848]">
                                {claimDetails?.reference_id}
                            </p>
                        </div>
                        <div>
                            <p className="text-[14px] text-[#858585]">
                                Vehicle number
                            </p>
                            <p className="text-[14px] text-[#484848]">
                                {claimDetails?.insurerInformation.vehicleNo}
                            </p>
                        </div>
                        <div>
                            <p className="text-[14px] text-[#858585]">
                                Claim handler name
                            </p>
                            <p className="text-[14px] text-[#484848]">
                                Hitesh Sutar
                            </p>
                        </div>
                        <div>
                            <p className="text-[14px] text-[#858585]">
                                Workshop name
                            </p>
                            <p className="text-[14px] text-[#484848]">
                                {claimDetails?.workshopDetails.workshopName}
                            </p>
                        </div>
                        <div>
                            <p className="text-[14px] text-[#858585]">
                                Helpline Number
                            </p>
                            <p className="text-[14px] text-[#484848]">
                                00000000
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="px-4 sm:p-8 w-full mb-48">
                    {renderStepper()}

                    {currentStep === 1 && (
                        <Step1
                            selectedRole={selectedRole}
                            filesStep1={filesStep1}
                            setFilesStep1={setFilesStep1}
                            errors={step1Errors}
                            setErrors={setStep1Errors}
                        />
                    )}

                    {currentStep === 2 && (
                        <Step2
                            filesStep2Top={filesStep2Top}
                            setFilesStep2Top={setFilesStep2Top}
                            filesStep2Left={filesStep2Left}
                            setFilesStep2Left={setFilesStep2Left}
                            filesStep2Right={filesStep2Right}
                            setFilesStep2Right={setFilesStep2Right}
                        />
                    )}

                    {currentStep === 3 && (
                        <Step3
                            selectedRole={selectedRole}
                            filesStep1={filesStep1}
                            setFilesStep1={setFilesStep1}
                            filesStep2Top={filesStep2Top}
                            setFilesStep2Top={setFilesStep2Top}
                            filesStep2Left={filesStep2Left}
                            setFilesStep2Left={setFilesStep2Left}
                            filesStep2Right={filesStep2Right}
                            setFilesStep2Right={setFilesStep2Right}
                            drivingLicense={drivingLicense}
                            setDrivingLicense={setDrivingLicense}
                            firstName={firstName}
                            setFirstName={setFirstName}
                            lastName={lastName}
                            setLastName={setLastName}
                            personalInfoErrors={personalInfoErrors}
                            setPersonalInfoErrors={setPersonalInfoErrors}
                            handleEditStep={handleEditStep}
                        />
                    )}

                    {selectedRole === "customer" && currentStep === 4 && (
                        <Step4
                            filesStep1={filesStep1}
                            setFilesStep1={setFilesStep1}
                            filesStep2Top={filesStep2Top}
                            setFilesStep2Top={setFilesStep2Top}
                            filesStep2Left={filesStep2Left}
                            setFilesStep2Left={setFilesStep2Left}
                            filesStep2Right={filesStep2Right}
                            setFilesStep2Right={setFilesStep2Right}
                            drivingLicense={drivingLicense}
                            setDrivingLicense={setDrivingLicense}
                            firstName={firstName}
                            lastName={lastName}
                            handleEditStep={handleEditStep}
                        />
                    )}

                    <div className="fixed right-0 bottom-0 px-4 sm:px-10 py-3 flex flex-row justify-end gap-4 bg-white shadow-[0_-4px_12px_4px_rgba(51,51,51,0.1)] w-full">
                        <button
                            onClick={handlePrevStep}
                            className={`px-4 py-2 rounded-md text-[#4B465C] ${
                                currentStep === 1
                                    ? "bg-[#4B465C14] "
                                    : "bg-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            Previous
                        </button>
                        {currentStep < (selectedRole === "workshop" ? 3 : 4) ? (
                            <button
                                onClick={handleNextStep}
                                className="px-4 py-2 bg-[#000000] text-white rounded-md"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-[#000000] text-white rounded-md"
                            >
                                Confirm
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center py-10">
                    <div className="text-center">
                        <div className="flex flex-col items-center gap-2">
                            <img src="../assets/logo.svg" alt="logo" />
                            <h2 className="text-[#5C5C5C] text-[20px] font-semibold mt-8">
                                Claim Reference ID: {claimDetails?.reference_id}
                            </h2>
                            <h2 className="text-[#5C5C5C] text-[20px] font-medium">
                                Claim Document & Media Upload
                            </h2>
                            <p className="text-[20px] text-[#858585] px-4">
                                Please upload the required documents and media
                                below to proceed with your claim assessment.
                            </p>
                        </div>
                        <div className="mt-20 py-6 flex flex-col items-center gap-2 shadow-md m-4 rounded-lg">
                            <div className="flex items-center justify-center">
                                <div className="relative w-[100px] h-[100px] rounded-full flex items-center justify-center shadow-[0_0_30px_#CFFCE9]">
                                    <div className="z-10 w-[80px] h-[80px] rounded-full flex items-center justify-center">
                                        <img
                                            src="/assets/otpSuccessIcon.svg"
                                            alt="otpSuccessIcon"
                                            className=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold text-[#5C5C5C]">
                                Documents Submitted !
                            </h2>
                            <p className="text-[#858585] px-4">
                                Thank you! Your documents have been submitted
                                for further assessment.
                            </p>
                            <p className="text-[#16A34A] text-center py-4">
                                Redirecting to Dashboard page in {countdown}
                                {countdown !== 1 && "s"}...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkshopDocumentUpload;
