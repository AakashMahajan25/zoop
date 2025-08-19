"use client";

import Image from "next/image";
import { SetStateAction, useEffect, useState } from "react";
import loginBg from "../assets/loginBg.svg";
import { useSearchParams } from "next/navigation";
import WorkshopDocumentUpload from "@/components/workshopDocumentUpload/WorkshopDocumentUpload";
import { ClaimDetails } from "./workshopDocumentUpload/types";
import ClaimUploads from "./workshopDocumentUpload/ClaimUploads";

export default function UploadAssessment() {
    const [step, setStep] = useState<
        | "uploadAssessment"
        | "uploadedDocument"
        | "selectRole"
        | "uploadDoc"
        | "uploadDocStep"
        | "language"
        | "enablePermissions"
    >("uploadAssessment");
    const [selectedRole, setSelectedRole] = useState<
        "customer" | "workshop" | ""
    >("");
    const [vehicleType, setVehicleType] = useState<string>("");
    const [language, setLanguage] = useState<string>("");
    const [driver, setDriver] = useState<string>("");
    const [uploadAssessmentModal, setUploadAssessmentModal] =
        useState<boolean>(true);
    const [cameraAllowed, setCameraAllowed] = useState(false);
    const [locationAllowed, setLocationAllowed] = useState(false);
    const [errors, setErrors] = useState({
        language: "",
        role: "",
        vehicleType: "",
        driver: "",
        permissions: "",
    });
    const [claimDetails, setClaimDetails] = useState<ClaimDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");
    const steps = [
        {
            stepNum: 1,
            title: "Personal & Vehicle",
            subtitle: "Personal & Vehicle",
        },
        {
            stepNum: 2,
            title: "Vehicle Photo Upload",
            subtitle: "Vehicle Photo Upload",
        },
        selectedRole === "customer"
            ? {
                stepNum: 3,
                title: "Driver Information",
                subtitle: "Info of the person driving the vehicle",
            }
            : null,
    ].filter(Boolean);

    // Validate current step
    const validateStep = () => {
        const newErrors = { ...errors };

        if (step === "language") {
            newErrors.language = language ? "" : "Please select a language";
        }

        if (step === "selectRole") {
            newErrors.role = selectedRole ? "" : "Please select your role";
        }

        if (step === "uploadDoc") {
            newErrors.vehicleType = vehicleType
                ? ""
                : "Please select vehicle type";
            if (selectedRole === "customer") {
                newErrors.driver = driver
                    ? ""
                    : "Please select who was driving";
            }
        }

        if (step === "enablePermissions") {
            newErrors.permissions =
                cameraAllowed && locationAllowed
                    ? ""
                    : "Please enable all permissions";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const requestLocationAccess = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                console.log("Location access granted:", position);
                setLocationAllowed(true);
                setErrors(prev => ({ ...prev, permissions: "" }));
            },
            error => {
                console.error("Location access denied", error);
                setErrors(prev => ({
                    ...prev,
                    permissions: "Location access is required",
                }));
            }
        );
    };

    const requestCameraAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            console.log("Camera access granted");
            stream.getTracks().forEach(track => track.stop());
            setCameraAllowed(true);
            setErrors(prev => ({ ...prev, permissions: "" }));
        } catch (err) {
            console.error("Camera access denied", err);
            setErrors(prev => ({
                ...prev,
                permissions: "Camera access is required",
            }));
        }
    };

    const updateStep = (newStep: typeof step) => {
        if (validateStep()) {
            setStep(newStep);
            window.history.pushState(
                { step: newStep, selectedRole, vehicleType, driver },
                "",
                `?step=${newStep}`
            );
        }
    };

    const handleContinue = () => {
        const stepsOrder = [
            "uploadAssessment",
            "selectRole",
            "uploadedDocument",
            "uploadDoc",
            "uploadDocStep",
        ];
        const currentIndex = stepsOrder.indexOf(step);
        if (currentIndex < stepsOrder.length - 1) {
            //@ts-ignore
            updateStep(stepsOrder[currentIndex + 1]);
        }
    };
    useEffect(() => {
        console.log("token", token);
        if (!token) {
            console.error("No token in URL");
            setLoading(false);
            return;
        }

        const fetchClaimDetails = async () => {
            try {
                console.log("Fetching claim details for token:", token);
                const res = await fetch(
                    `http://13.235.82.24:8080/api/v1/claim-links/claim-access/${token}`
                );

                if (!res.ok) {
                    throw new Error(
                        `Failed to fetch claim details: ${res.status}`
                    );
                }

                const data = await res.json();
                console.log("Claim details fetched:", data);
                setClaimDetails(data);
            } catch (err) {
                console.error("Error fetching claim details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchClaimDetails();
    }, [token]);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (event.state && event.state.step) {
                setStep(event.state.step);
                setSelectedRole(event.state.selectedRole || "");
                setVehicleType(event.state.vehicleType || "");
                setDriver(event.state.driver || "");
                setUploadAssessmentModal(event.state.step !== "uploadDocStep");
            }
        };

        window.addEventListener("popstate", handlePopState);
        window.history.replaceState(
            { step, selectedRole, vehicleType, driver },
            "",
            `?step=${step}`
        );

        return () => window.removeEventListener("popstate", handlePopState);
    }, [step, selectedRole, vehicleType, driver]);

    // Check if current step is valid
    const isStepValid = () => {
        switch (step) {
            case "language":
                return !!language;
            case "selectRole":
                return !!selectedRole;
            case "uploadDoc":
                return (
                    !!vehicleType && (selectedRole === "workshop" || !!driver)
                );
            case "enablePermissions":
                return cameraAllowed && locationAllowed;
            default:
                return true;
        }
    };
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Loading claim details...</p>
            </div>
        );
    }
    if (step === "uploadedDocument") {
        return (
            <ClaimUploads
                reference_id={claimDetails?.reference_id ?? ""}
                selectedRole={selectedRole}
                claimDetails={claimDetails}
                onContinue={() => setStep("uploadDoc")}
            />
        );
    }
    return (
        <>
            {!uploadAssessmentModal && (
                <div>
                    <WorkshopDocumentUpload
                        selectedRole={selectedRole as "customer" | "workshop"}
                        setUploadAssessmentModal={setUploadAssessmentModal}
                        claimDetails={claimDetails}
                        setStep={setStep}
                    />
                </div>
            )}

            {uploadAssessmentModal && (
                <div className="h-screen bg-[#FFFFFF] font-Geist text-[#4B465C] flex items-center justify-center">
                    <Image
                        src={loginBg}
                        alt="Login Background"
                        className="absolute top-40 lg:top-24 left-[1px] lg:left-[29rem] z-10"
                    />
                    <Image
                        src={loginBg}
                        alt="Login Background Rotated"
                        className="absolute bottom-32 lg:bottom-24 right-[1rem] lg:right-[30rem] z-10 rotate-180"
                    />
                    <div className="bg-white w-[350px] lg:w-[450px] rounded-lg border border-[#E5E5E5] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 p-10">
                        <img
                            src="/assets/logo.svg"
                            alt="logo"
                            className="mx-auto mb-8"
                        />
                        {step === "uploadAssessment" && (
                            <>
                                <h2 className="text-2xl font-medium mt-6 mb-2 text-[#4B465C]">
                                    Welcome to Zoop!
                                </h2>
                                <p className="text-[14px] mb-6 text-[#4B465C]">
                                    Please sign in to your account and start the
                                    adventure
                                </p>
                                <button
                                    type="button"
                                    onClick={() => updateStep("language")}
                                    className="w-full bg-black text-lg text-[#21FF91] font-medium py-2 rounded-md hover:bg-black transition"
                                >
                                    Continue
                                </button>
                            </>
                        )}
                        {step === "language" && (
                            <>
                                <h2 className="text-[24px] font-medium mb-2 text-center text-[#4B465C]">
                                    Welcome to Zoop!
                                </h2>
                                <p className="text-[14px] mb-2 text-center">
                                    Please upload the following details for
                                    assessment
                                </p>
                                <p className="text-[16px] text-[#000000] font-medium mb-2 text-center">
                                    Select your preferred language
                                </p>

                                <div className="mb-4">
                                    <select
                                        value={language}
                                        onChange={e => {
                                            setLanguage(e.target.value);
                                            setErrors(prev => ({
                                                ...prev,
                                                language: "",
                                            }));
                                        }}
                                        className={`w-full border ${errors.language
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            } px-3 py-2 rounded-md text-sm`}
                                    >
                                        <option value="">
                                            Select Language
                                        </option>
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Marathi">Marathi</option>
                                    </select>
                                    {errors.language && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.language}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => updateStep("selectRole")}
                                    className={`w-full my-6 text-[18px] font-medium ${language
                                        ? "bg-[#000000] text-[#21FF91] hover:bg-[#000000]"
                                        : "bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed"
                                        } py-2 rounded-md transition`}
                                    disabled={!language}
                                >
                                    Continue
                                </button>
                            </>
                        )}

                        {step === "selectRole" && (
                            <>
                                <p className="text-[16px] mb-8 text-center text-[#000000] font-medium">
                                    Select whether you are a customer or
                                    representing a workshop.
                                </p>
                                <div className="mb-4 text-[16px] flex justify-center gap-10 text-[#000000]">
                                    {["customer", "workshop"].map(role => (
                                        <label
                                            key={role}
                                            className="flex items-center gap-2 capitalize"
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role}
                                                checked={selectedRole === role}
                                                onChange={e => {
                                                    setSelectedRole(
                                                        e.target.value as
                                                        | "customer"
                                                        | "workshop"
                                                    );
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        role: "",
                                                    }));
                                                }}
                                                className="accent-black"
                                            />
                                            {role}
                                        </label>
                                    ))}
                                </div>
                                {errors.role && (
                                    <p className="text-red-500 text-xs text-center mb-4">
                                        {errors.role}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={handleContinue}
                                    className={`w-full my-6 text-[18px] font-medium ${selectedRole
                                        ? "bg-[#000000] text-[#21FF91] hover:bg-[#000000]"
                                        : "bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed"
                                        } py-2 rounded-md transition`}
                                    disabled={!selectedRole}
                                >
                                    Continue
                                </button>
                            </>
                        )}
                        {step === "uploadDoc" && (
                            <>
                                <p className="text-[16px] mb-4 text-center text-[#000000]">
                                    Select the type of vehicle
                                </p>
                                <div className="mb-4">
                                    <select
                                        value={vehicleType}
                                        onChange={e => {
                                            setVehicleType(e.target.value);
                                            setErrors(prev => ({
                                                ...prev,
                                                vehicleType: "",
                                            }));
                                        }}
                                        className={`w-full border ${errors.vehicleType
                                            ? "border-red-500"
                                            : "border-gray-300"
                                            } px-3 py-2 rounded-md text-sm`}
                                    >
                                        <option value="">
                                            Select Vehicle Type
                                        </option>
                                        <option value="Car">Car</option>
                                        <option value="Bike">Bike</option>
                                        <option value="Truck">Truck</option>
                                    </select>
                                    {errors.vehicleType && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.vehicleType}
                                        </p>
                                    )}
                                </div>

                                {selectedRole === "customer" && (
                                    <>
                                        <p className="text-[16px] mb-4 text-center text-[#000000]">
                                            Who was driving?
                                        </p>
                                        <div className="mb-4">
                                            <select
                                                value={driver}
                                                onChange={e => {
                                                    setDriver(e.target.value);
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        driver: "",
                                                    }));
                                                }}
                                                className={`w-full border ${errors.driver
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                                    } px-3 py-2 rounded-md text-sm`}
                                            >
                                                <option value="">
                                                    Select Driver
                                                </option>
                                                <option value="Self">
                                                    Self
                                                </option>
                                                <option value="Friend">
                                                    Friend
                                                </option>
                                                <option value="Family">
                                                    Family
                                                </option>
                                            </select>
                                            {errors.driver && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.driver}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => updateStep("uploadDocStep")}
                                    className={`w-full my-6 text-[18px] font-medium ${vehicleType &&
                                        (selectedRole === "workshop" || driver)
                                        ? "bg-[#000000] text-[#21FF91] hover:bg-[#000000]"
                                        : "bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed"
                                        } py-2 rounded-md transition`}
                                    disabled={
                                        !vehicleType ||
                                        (selectedRole === "customer" && !driver)
                                    }
                                >
                                    Continue
                                </button>
                            </>
                        )}

                        {step === "uploadDocStep" && (
                            <>
                                <p className="text-[16px] mb-6 text-center text-[#000000]">
                                    Please be prepared with the following
                                    documents to upload
                                </p>
                                <div className="flex flex-col relative my-6">
                                    {steps.map(
                                        (step, i) =>
                                            step && (
                                                <div
                                                    key={i}
                                                    className="text-[14px]"
                                                >
                                                    {i > 0 && (
                                                        <div className="w-[2px] bg-[#21FF91] h-10 mx-5"></div>
                                                    )}

                                                    <div className="relative z-10 flex items-center gap-4">
                                                        <div className="border-2 border-[#21FF91] text-center py-2 rounded-full w-10 h-10 flex items-center justify-center">
                                                            0{step.stepNum}
                                                        </div>
                                                        <div>
                                                            <p className="text-[#0D0B26]">
                                                                {step.title}
                                                            </p>
                                                            <p className="text-[#646970]">
                                                                {step.subtitle}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateStep("enablePermissions")
                                    }
                                    className="w-full bg-black text-lg text-[#21FF91] font-medium py-2 rounded-md transition hover:bg-black"
                                >
                                    Continue
                                </button>
                            </>
                        )}

                        {step === "enablePermissions" && (
                            <>
                                <h2 className="text-[16px] font-medium mb-1 text-center text-[#000000]">
                                    Enable Permission
                                </h2>
                                <p className="text-[12px] mb-4 text-center text-[#000000]">
                                    Please allow access to your camera and
                                    location
                                </p>

                                {/* Camera Access */}
                                <div
                                    className={`flex items-center justify-between border ${errors.permissions && !cameraAllowed
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        } px-4 py-3 rounded-md mb-4 mx-4`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="text-green-500">
                                            <img
                                                src="assets/cameraIcon.svg"
                                                alt="cameraIcon"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-black">
                                                Camera Access
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                For uploading document photos
                                            </p>
                                        </div>
                                    </div>
                                    {cameraAllowed ? (
                                        <span className="text-green-500 text-sm">
                                            Allowed
                                        </span>
                                    ) : (
                                        <button
                                            onClick={requestCameraAccess}
                                            className="bg-black text-white px-4 py-1 text-sm rounded-md"
                                        >
                                            Allow
                                        </button>
                                    )}
                                </div>

                                {/* Location Access */}
                                <div
                                    className={`flex items-center justify-between border ${errors.permissions && !locationAllowed
                                        ? "border-red-500"
                                        : "border-gray-300"
                                        } px-4 py-3 rounded-md mb-4 mx-4`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="text-green-500">
                                            <img
                                                src="assets/locationIcon.svg"
                                                alt="locationIcon"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-black">
                                                Location Access
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                For accurate claim processing
                                            </p>
                                        </div>
                                    </div>
                                    {locationAllowed ? (
                                        <span className="text-green-500 text-sm">
                                            Allowed
                                        </span>
                                    ) : (
                                        <button
                                            onClick={requestLocationAccess}
                                            className="bg-black text-white px-4 py-1 text-sm rounded-md"
                                        >
                                            Allow
                                        </button>
                                    )}
                                </div>

                                {errors.permissions && (
                                    <p className="text-red-500 text-xs text-center mb-4">
                                        {errors.permissions}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (validateStep()) {
                                            setUploadAssessmentModal(false);
                                            window.history.pushState(
                                                {
                                                    step: "uploadDocStep",
                                                    selectedRole,
                                                    vehicleType,
                                                    driver,
                                                },
                                                "",
                                                "?step=uploadDocStep"
                                            );
                                        }
                                    }}
                                    className={`w-full my-6 text-[18px] font-medium ${cameraAllowed && locationAllowed
                                        ? "bg-[#000000] text-[#21FF91] hover:bg-[#000000]"
                                        : "bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed"
                                        } py-2 rounded-md transition`}
                                    disabled={
                                        !cameraAllowed || !locationAllowed
                                    }
                                >
                                    Continue
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
