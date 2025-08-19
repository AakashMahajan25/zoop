"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Step4 from "./Step4";
import {
    UploadsResponse,
    DocumentUpload,
    MediaUpload,
    FileArray,
    SingleFileArray,
    ClaimUploadsProps,
    step1FileNames,
    step2TopFileNames,
    step2LeftFileNames,
    step2RightFileNames,
} from "./types";
import RenderUploadedFiles from "./RenderUploadedFiles";

export default function ClaimUploads({
    reference_id,
    selectedRole,
    claimDetails,
    onContinue,
}: ClaimUploadsProps) {
    const router = useRouter();
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

    useEffect(() => {
        if (!reference_id || !selectedRole) return;

        const fetchUploads = async () => {
            const res = await fetch(
                `http://13.235.82.24:8080/api/v1/uploads/${selectedRole}/claims/${reference_id}/uploads`
            );
            const data = await res.json();
            mapUploadsToState(data.data);
        };

        fetchUploads();
    }, [reference_id, selectedRole]);

    const mapUploadsToState = (data: UploadsResponse) => {
        const { documents, media } = data;

        const step1 = [...filesStep1];
        const top = [...filesStep2Top];
        const left = [...filesStep2Left];
        const right = [...filesStep2Right];

        documents.forEach((doc: DocumentUpload) => {
            // Map by document_type_id
            const idx = doc.document_type_id - 1;
            if (step1[idx])
                step1[idx] = [
                    {
                        name: doc.file_url.split("/").pop() || "",
                        url: doc.file_url,
                    },
                ];
            if (doc.document_type_id === 2)
                setDrivingLicense([
                    {
                        name: doc.file_url.split("/").pop() || "",
                        url: doc.file_url,
                    },
                ]);
        });

        media.forEach((m: MediaUpload) => {
            // Map by section_id
            if ([2, 3, 4].includes(m.section_id)) {
                top[[2, 3, 4].indexOf(m.section_id)] = [
                    {
                        name: m.file_url.split("/").pop() || "",
                        url: m.file_url,
                    },
                ];
            } else if ([5, 6, 7, 8].includes(m.section_id)) {
                left[[5, 6, 7, 8].indexOf(m.section_id)] = [
                    {
                        name: m.file_url.split("/").pop() || "",
                        url: m.file_url,
                    },
                ];
            } else if ([9, 10, 11, 12].includes(m.section_id)) {
                right[[9, 10, 11, 12].indexOf(m.section_id)] = [
                    {
                        name: m.file_url.split("/").pop() || "",
                        url: m.file_url,
                    },
                ];
            }
        });

        setFilesStep1(step1);
        setFilesStep2Top(top);
        setFilesStep2Left(left);
        setFilesStep2Right(right);
    };

    return (
        <div className="my-8 flex flex-col h-[calc(100vh-4rem)]">
            {/* Top Section */}
            <div className="flex flex-col items-center gap-2 shrink-0">
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

            {/* Scrollable Section */}
            <div className="flex-1 overflow-y-auto px-4 sm:p-8 w-full pb-24">
                {/* Documents: Personal & Vehicle */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[16px] text-[#000000]">
                            Documents: Personal & Vehicle
                        </h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {step1FileNames.map((name, index) =>
                            filesStep1[index].length > 0 ? (
                                <div key={index}>
                                    <h5 className="text-[14px] font-medium text-[#3B3B3B] mb-2">
                                        {name}:
                                    </h5>
                                    <RenderUploadedFiles
                                        files={filesStep1[index]}
                                        fieldIndex={index}
                                        setFiles={setFilesStep1}
                                        filesArray={filesStep1}
                                    />
                                </div>
                            ) : (
                                <div key={index}>
                                    <h5 className="text-[14px] font-medium text-[#3B3B3B] mb-2">
                                        {name}:
                                    </h5>
                                    <p className="text-[14px] text-[#858585]">
                                        Not Uploaded Yet
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Vehicle Photo Upload */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[16px] text-[#000000]">
                            Vehicle Photo Upload: Private Vehicle
                        </h4>
                    </div>
                    <div className="mb-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {step2TopFileNames.map((item, index) =>
                                filesStep2Top[index].length > 0 ? (
                                    <div key={index}>
                                        <h5 className="text-xs font-medium text-gray-500 mb-2">
                                            {item.label}:
                                        </h5>
                                        <RenderUploadedFiles
                                            files={filesStep2Top[index]}
                                            fieldIndex={index}
                                            setFiles={setFilesStep2Top}
                                            filesArray={filesStep2Top}
                                        />
                                    </div>
                                ) : (
                                    <div key={index}>
                                        <h5 className="text-[14px] font-medium text-[#3B3B3B] mb-2">
                                            {item.label}:
                                        </h5>
                                        <p className="text-[14px] text-[#858585]">
                                            Not Uploaded Yet
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-1/2">
                            {step2LeftFileNames.map((item, index) =>
                                filesStep2Left[index].length > 0 ? (
                                    <div key={index}>
                                        <h5 className="text-xs font-medium text-gray-500 mb-2">
                                            {item.label}:
                                        </h5>
                                        <RenderUploadedFiles
                                            files={filesStep2Left[index]}
                                            fieldIndex={index}
                                            setFiles={setFilesStep2Left}
                                            filesArray={filesStep2Left}
                                        />
                                    </div>
                                ) : (
                                    <div key={index}>
                                        <h5 className="text-[14px] font-medium text-[#3B3B3B] mb-2">
                                            {item.label}:
                                        </h5>
                                        <p className="text-[14px] text-[#858585]">
                                            Not Uploaded Yet
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="w-full sm:w-1/2">
                            {step2RightFileNames.map((item, index) =>
                                filesStep2Right[index].length > 0 ? (
                                    <div key={index}>
                                        <h5 className="text-xs font-medium text-gray-500 mb-2">
                                            {item.label}:
                                        </h5>
                                        <RenderUploadedFiles
                                            files={filesStep2Right[index]}
                                            fieldIndex={index}
                                            setFiles={setFilesStep2Right}
                                            filesArray={filesStep2Right}
                                        />
                                    </div>
                                ) : (
                                    <div key={index}>
                                        <h5 className="text-[14px] font-medium text-[#3B3B3B] mb-2">
                                            {item.label}:
                                        </h5>
                                        <p className="text-[14px] text-[#858585]">
                                            Not Uploaded Yet
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Driver Details */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[16px] text-[#000000]">
                            Driver Details: Someone Else
                        </h4>
                    </div>
                    {drivingLicense.length > 0 ? (
                        <div className="mt-4">
                            <h5 className="text-xs font-medium text-gray-500 mb-2">
                                Driving License:
                            </h5>
                            <RenderUploadedFiles
                                files={drivingLicense}
                                fieldIndex={0}
                                //@ts-ignore
                                setFiles={setDrivingLicense}
                                filesArray={drivingLicense}
                            />
                        </div>
                    ) : (
                        <div>
                            <h5 className="text-[14px] font-medium text-[#3B3B3B] mb-2">
                                Driving License:
                            </h5>
                            <p className="text-[14px] text-[#858585]">
                                Not Uploaded Yet
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Footer Button */}
            <div className="shrink-0 sticky bottom-0 bg-white py-4 text-center border-t">
                <button
                    onClick={onContinue}
                    className="bg-black text-white py-2 px-4 rounded"
                >
                    Continue to Upload
                </button>
            </div>
        </div>
    );
}
