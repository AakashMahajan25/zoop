'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Roles, getRoles, CompleteProfilePayload, completeProfile, verifyEmail } from '@/utils/api';
import { useAuth } from '@/app/context/AuthContext';

interface CompleteProfileData {
    email: string;
    department: string;
    responsibility: string;
    zone: string;
    experience_years: string;
    agreeTerms: boolean;
}

interface ProfileFormErrors {
    department?: string;
    responsibility?: string;
    experience_years?: string;
    agreeTerms?: string;
}

/**
 * Email verification success page component
 * Displays verification success message and allows user to complete their profile
 */
export default function EmailVerifiedPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAuth();
    const [roles, setRoles] = useState<Roles[]>([]);
    const [completeProfileData, setCompleteProfileData] = useState<CompleteProfileData>({
        email: "",
        department: "",
        responsibility: "",
        zone: "",
        experience_years: "",
        agreeTerms: false,
    });
    const [step, setStep] = useState<"verifying" | "emailVerified" | "completeProfile" | "pending" | "approved" | "error">("verifying");
    const [apiError, setApiError] = useState<string | null>(null);
    const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({});
    const [isVerifying, setIsVerifying] = useState<boolean>(true);
    const verificationAttemptedRef = useRef<boolean>(false);

    // Email verification useEffect
    useEffect(() => {
        const verifyEmailToken = async () => {
            // Prevent multiple verification attempts
            if (verificationAttemptedRef.current) {
                return;
            }

            const token = searchParams?.get('token');
            
            if (!token) {
                setApiError('No verification token provided');
                setStep('error');
                setIsVerifying(false);
                verificationAttemptedRef.current = true;
                return;
            }

            try {
                setIsVerifying(true);
                setApiError(null);
                verificationAttemptedRef.current = true;
                
                const response = await verifyEmail(token);
                
                if (response.success) {
                    setStep('emailVerified');
                } else {
                    setApiError(response.message || 'Email verification failed');
                    setStep('error');
                }
            } catch (error: any) {
                console.error('Email verification error:', error);
                setApiError(error.message || 'Email verification failed');
                setStep('error');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyEmailToken();
    }, [searchParams]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles();
                console.log("API Roles Response:", response);
                if (response) {
                    setRoles(response);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchRoles();
    }, []);

    /**
     * Validates profile form fields
     */
    const validateProfile = (): ProfileFormErrors => {
        const profileErrs: ProfileFormErrors = {};
        
        if (!completeProfileData.department.trim()) {
            profileErrs.department = 'Role selection is required';
        }
        
        if (!completeProfileData.responsibility.trim()) {
            profileErrs.responsibility = 'Responsibility is required';
        }
        
        if (!completeProfileData.experience_years.trim()) {
            profileErrs.experience_years = 'Experience years is required';
        } else if (!/^\d+$/.test(completeProfileData.experience_years.trim())) {
            profileErrs.experience_years = 'Experience years must be a valid number';
        } else if (parseInt(completeProfileData.experience_years) < 0) {
            profileErrs.experience_years = 'Experience years cannot be negative';
        } else if (parseInt(completeProfileData.experience_years) > 50) {
            profileErrs.experience_years = 'Experience years cannot exceed 50';
        }
        
        if (!completeProfileData.agreeTerms) {
            profileErrs.agreeTerms = 'You must agree to the Privacy Policy';
        }
        
        return profileErrs;
    };

    const handleProfileChange = (field: keyof CompleteProfileData, value: string | boolean) => {
        setCompleteProfileData(prev => ({ ...prev, [field]: value }));
        // Clear profile errors when user starts typing
        if (profileErrors[field as keyof ProfileFormErrors]) {
            setProfileErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    /**
     * Validates if all profile form fields are completed
     */
    const isProfileDataFormValid = () => {
        const profileValidationErrors = validateProfile();
        return Object.keys(profileValidationErrors).length === 0;
    };

    /**
     * Handles profile data submission
     */
    const submitProfileData = async () => {
        const validationErrors = validateProfile();
        setProfileErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
            return; // Don't submit if there are validation errors
        }

        try {
            setStep("pending");
            
            // Convert the data to match CompleteProfilePayload interface
            const payload: CompleteProfilePayload = {
                department: completeProfileData.department,
                responsibility: completeProfileData.responsibility,
                experience_years: parseInt(completeProfileData.experience_years)
            };
            
            const response = await completeProfile(payload);
            if (response) {
                console.log("Profile been updated");
                localStorage.setItem("user-role", completeProfileData.department);
            } else {
                setApiError('Profile updated');
            }
        } catch (error) {
            console.error('Profile submission error:', error);
            setApiError('Failed to submit profile data. Please try again.');
        }
    };

    return (
        <div className="h-screen bg-[#EDFFF6] font-Geist text-[#4B465C] relative">
            <img
                src='/assets/Group.svg'
                alt="Background"
                className="w-full h-full object-cover absolute inset-0"
            />

            <img
                src='/assets/loginBg.svg'
                alt="Login Background"
                className="absolute top-6 lg:left-[25rem] z-10"
            />
            <img
                src='/assets/loginBg.svg'
                alt="Login Background"
                className="absolute bottom-28 lg:bottom-6 right-[1rem] lg:right-[30rem] z-10 rotate-180"
            />
            
            <div className="bg-[#FFFFFF] w-[360px] lg:w-[450px] rounded-lg border border-[#E5E5E5] absolute top-[150px] lg:top-[100px] left-1/2 transform -translate-x-1/2 z-20">
                <div className="p-4 lg:p-8 bg-white rounded-xl shadow-md lg:w-full lg:max-w-lg">
                    <div className="flex justify-center mb-4">
                        <img src='/assets/logo.svg' alt="Logo" className="h-[43px] w-[157px]" />
                    </div>

                    {/* API Error Display */}
                    {apiError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{apiError}</p>
                        </div>
                    )}

                    {step === "verifying" && (
                        <>
                            <div className='text-center'>
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#000000] mx-auto mb-6"></div>
                                <h2 className="text-[26px] font-medium mb-1 text-[#726E7D]">Verifying Email...</h2>
                                <p className="text-[15px] mb-6 text-[#7C7C7A]">
                                    Please wait while we verify your email address.
                                </p>
                            </div>
                        </>
                    )}

                    {step === "error" && (
                        <>
                            <div className='text-center'>
                                <img
                                    src='/assets/errorIcon.svg'
                                    alt="Error"
                                    className="w-[65px] h-[65px] mx-auto mb-6"
                                />
                                <h2 className="text-[26px] font-medium mb-1 text-[#726E7D]">Verification Failed</h2>
                                <p className="text-[15px] mb-6 text-[#7C7C7A]">
                                    {apiError || 'There was an error verifying your email. Please try again or contact support.'}
                                </p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md transition hover:bg-[#000000]"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </>
                    )}

                    {step === "emailVerified" && (
                        <>
                            <div className='text-center'>
                                <img
                                    src='/assets/successIcon.svg'
                                    alt="Email Verified"
                                    className="w-[65px] h-[65px] mx-auto mb-6"
                                />

                                <h2 className="text-[26px] font-medium mb-1 text-[#726E7D]">Email Verified Successfully!</h2>

                                <p className="text-[15px] mb-6 text-[#7C7C7A]">
                                    Your email has been verified successfully. You can now login to your account.
                                </p>

                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md transition hover:bg-[#000000]"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </>
                    )}

                    {step === "completeProfile" && (
                        <>
                            <h2 className="text-[26px] font-medium mb-1 text-[#726E7D] text-center">Complete Your Profile</h2>

                            <p className="text-[15px] mb-6 text-[#726E7D]">
                                Please complete your profile to finish the registration process
                            </p>

                            <div className="flex gap-4 mb-4">
                                <div className="w-1/2">
                                    <select
                                        value={completeProfileData.department}
                                        onChange={(e) => handleProfileChange('department', e.target.value)}
                                        className={`w-full border px-3 py-2 rounded text-[14px] text-[#868686] ${
                                            profileErrors.department 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-[#D9D9D9] focus:ring-blue-500'
                                        } focus:outline-none focus:ring-2`}
                                    >
                                        <option value="">Select Role</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {profileErrors.department && (
                                        <p className="text-red-500 text-sm mt-1">{profileErrors.department}</p>
                                    )}
                                </div>

                                <div className="w-1/2">
                                    <select
                                        value={completeProfileData.responsibility}
                                        onChange={(e) => handleProfileChange('responsibility', e.target.value)}
                                        className={`w-full border px-3 py-2 rounded text-[14px] text-[#868686] ${
                                            profileErrors.responsibility 
                                                ? 'border-red-500 focus:ring-red-500' 
                                                : 'border-[#D9D9D9] focus:ring-blue-500'
                                        } focus:outline-none focus:ring-2`}
                                    >
                                        <option value="">Responsibility</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Contributor">Contributor</option>
                                        <option value="Lead">Lead</option>
                                    </select>
                                    {profileErrors.responsibility && (
                                        <p className="text-red-500 text-sm mt-1">{profileErrors.responsibility}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={completeProfileData.experience_years}
                                    placeholder='Enter Experience years (numbers only)'
                                    onChange={(e) => {
                                        // Only allow numbers
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        handleProfileChange('experience_years', value);
                                    }}
                                    className={`w-full border px-3 py-2 rounded text-[14px] text-[#868686] ${
                                        profileErrors.experience_years 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-[#D9D9D9] focus:ring-blue-500'
                                    } focus:outline-none focus:ring-2`}
                                    maxLength={2}
                                />
                                {profileErrors.experience_years && (
                                    <p className="text-red-500 text-sm mt-1">{profileErrors.experience_years}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="flex items-center gap-1 text-[11px] text-[#565656]">
                                    <input
                                        type="checkbox"
                                        className={`border ${
                                            profileErrors.agreeTerms 
                                                ? 'border-red-500' 
                                                : 'border-[#A2A2A2]'
                                        } bg-[#FFFFFF]`}
                                        checked={completeProfileData.agreeTerms}
                                        onChange={(e) => handleProfileChange('agreeTerms', e.target.checked)}
                                    />
                                    Agree to Privacy Policy<span className='text-red-400'>*</span>
                                </label>
                                {profileErrors.agreeTerms && (
                                    <p className="text-red-500 text-sm mt-1">{profileErrors.agreeTerms}</p>
                                )}
                            </div>

                            <button
                                onClick={submitProfileData}
                                className={`w-full text-lg font-medium py-2 rounded-md transition ${
                                    isProfileDataFormValid() 
                                        ? 'bg-[#000000] text-[#21FF91] hover:bg-[#000000] cursor-pointer' 
                                        : 'bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed'
                                }`}
                                disabled={!isProfileDataFormValid()}
                            >
                                Request For Approval
                            </button>
                        </>
                    )}

                    {step === "pending" && (
                        <>
                            <div className='text-center'>
                                <img
                                    src='/assets/pendingIcon.svg'
                                    alt="Pending Approval"
                                    className="w-[65px] h-[65px] mx-auto mb-6"
                                />

                                <h2 className="text-[26px] font-medium mb-1">Pending Admin Approval</h2>

                                <p className="text-[15px] mb-6">
                                    Your request has been submitted.
                                </p>
                            </div>
                        </>
                    )}

                    {step === "approved" && (
                        <>
                            <div className='text-center'>
                                <img
                                    src='/assets/approveIcon.svg'
                                    alt="Request Approved"
                                    className="w-[65px] h-[65px] mx-auto mb-6"
                                />

                                <h2 className="text-[26px] font-medium mb-1">Request Approved</h2>

                                <p className="text-[15px] mb-8">
                                    Your request has been approved. You can now login using your credentials.
                                </p>

                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md transition hover:bg-[#000000]"
                                >
                                    Back To Login
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
