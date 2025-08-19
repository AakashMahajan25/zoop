'use client';
import { useContext, useEffect, useMemo, useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import Login from '../components/Login';
import { registerUser, RegisterRequest, ApiResponse, RegisterResponse, loginUser, Roles, getRoles, ProfileResponse, CompleteProfilePayload, completeProfile, setAuthToken } from '@/utils/api';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { Spinner } from '@/components/Spinner';
import { getContextualErrorMessage } from '@/utils/errorMessages';

interface FormData {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    password: string;
}

interface CompleteProfileData {
    email: string;
    department: string;
    responsibility: string;
    zone: string;
    experience_years: string;
    agreeTerms: boolean;
}

interface FormErrors {
    submit: any;
    firstName?: string;
    lastName?: string;
    mobile?: string;
    email?: string;
    password?: string;
}

interface ProfileFormErrors {
    department?: string;
    responsibility?: string;
    experience_years?: string;
    agreeTerms?: string;
}



export default function SignIn() {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
    });
    const [completeProfileData, setCompleteProfileData] = useState<CompleteProfileData>({
        email: "",
        department: "",
        responsibility: "",
        zone: "",
        experience_years: "",
        agreeTerms: false,
    });
    const [errors, setErrors] = useState<FormErrors>(() => ({} as FormErrors));
    const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [roles, setRoles] = useState<Roles[]>([]);
    const [step, setStep] = useState<"signup" | "checkEmail" | "completeProfile" | "pending" | "approved">("signup");
    const [submitted, setSubmitted] = useState(false);
    const [signInModal, setSignInModal] = useState(true);
    const { setUser } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);


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

    const validate = (): FormErrors => {
        const errs: FormErrors = {
            submit: undefined
        };
        if (!formData.firstName.trim()) errs.firstName = 'First name is required';
        if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
        if (!formData.mobile.trim()) errs.mobile = 'Mobile number is required';
        else if (!/^[6-9]\d{9}$/.test(formData.mobile)) errs.mobile = 'Please enter a valid 10-digit mobile number';
        if (!formData.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Please enter a valid email address';
        if (!formData.password.trim()) errs.password = 'Password is required';
        else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters';
        else if (!/[A-Z]/.test(formData.password)) errs.password = 'Password must contain at least one uppercase letter';
        else if (!/[a-z]/.test(formData.password)) errs.password = 'Password must contain at least one lowercase letter';
        else if (!/[0-9]/.test(formData.password)) errs.password = 'Password must contain at least one number';
        // Removed the special character requirement - now only alphabets and numbers are supported
        return errs;
    };

    const isFormValid = useMemo(() => {
        const errors = validate();
        return Object.keys(errors).length === 1; // Only submit key exists when no errors
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear API error when user starts typing
        if (apiError) setApiError(null);
    };

    const togglePassword = () => setShowPassword(prev => !prev);

    const handleRegistration = async (userData: FormData): Promise<ApiResponse<RegisterResponse>> => {
        const registerData: RegisterRequest = {
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            phone: userData.mobile,
            password: userData.password
        };

        return await registerUser(registerData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length === 1) { // Only submit key exists when no errors
            setIsLoading(true);
            setApiError(null);
            
            try {
                console.log('Submitting registration data:', formData);
                const response = await handleRegistration(formData);
                
                if (response.success) {
                    console.log('Registration successful:', response);
                    setSubmitted(true);
                    setStep("checkEmail");
                    
                    // Email verification will be handled via the backend redirect to /email-verified
                } else {
                    setApiError(getContextualErrorMessage(response.message || 'Registration failed', 'registration'));
                }
            } catch (error) {
                console.error('Registration error:', error);
                setApiError(getContextualErrorMessage(error, 'registration', 'Registration failed. Please try again.'));
            } finally {
                setIsLoading(false);
            }
        }
    };



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

    const maskEmail = (email: string) => {
        const [user, domain] = email.split('@');
        const maskedUser = user[0] + '*'.repeat(user.length - 2) + user.slice(-1);
        const [domainName, domainExt] = domain.split('.');
        const maskedDomain = domainName[0] + '*'.repeat(domainName.length - 2) + domainName.slice(-1);
        return `${maskedUser}@${maskedDomain}.${domainExt}`;
    };

    const handleProfileChange = (field: keyof CompleteProfileData, value: string | boolean) => {
        setCompleteProfileData(prev => ({ ...prev, [field]: value }));
        // Clear profile errors when user starts typing
        if (profileErrors[field as keyof ProfileFormErrors]) {
            setProfileErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const isProfileDataFormValid = useMemo(() => {
        const profileValidationErrors = validateProfile();
        return Object.keys(profileValidationErrors).length === 0;
    }, [completeProfileData]);

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
                setApiError(getContextualErrorMessage('Profile updated successfully', 'profile'));
            }

        } catch (error) {
            console.error('Profile submission error:', error);
            setApiError(getContextualErrorMessage(error, 'profile', 'Failed to submit profile data. Please try again.'));
        }
    };

    return (
        <>
            {signInModal ?
                <div className="h-screen bg-[#EDFFF6] font-Geist text-[#4B465C] relative">
                    <img
                        src='../assets/Group.svg'
                        alt="Background"
                        className="w-full h-full object-cover absolute inset-0"
                    />

                    <img
                        src='../assets/loginBg.svg'
                        alt="Login Background"
                        className="absolute top-6 lg:left-[25rem] z-10"
                    />
                    <img
                        src='../assets/loginBg.svg'
                        alt="Login Background"
                        className="absolute bottom-28 lg:bottom-6 right-[1rem] lg:right-[30rem] z-10 rotate-180"
                    />
                    <div className="bg-[#FFFFFF] w-[360px] lg:w-[450px] rounded-lg border border-[#E5E5E5] absolute top-[150px] lg:top-[100px] left-1/2 transform -translate-x-1/2 z-20">
                        <form onSubmit={handleSubmit} className="p-4 lg:p-8 bg-white rounded-xl shadow-md lg:w-full lg:max-w-lg">
                            <div className="flex justify-center mb-4">
                                <img src='../assets/logo.svg' alt="Logo" className="h-[43px] w-[157px]" />
                            </div>

                            {/* API Error Display */}
                            {apiError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-600 text-sm">{apiError}</p>
                                </div>
                            )}

                            {step === "signup" && (
                                <>
                                    <h2 className="text-[26px] font-medium mb-1 text-[#726E7D] text-center">Sign-up</h2>
                                    <p className="text-[15px] mb-6 text-center">Please sign in to your account and start the adventure</p>

                                    <div className="flex gap-4 mb-4">
                                        <div className="w-1/2">
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder='First Name'
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full text-[14px] px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                        </div>
                                        <div className="w-1/2">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                placeholder='Last Name'
                                                onChange={handleChange}
                                                className="w-full text-[14px] px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={formData.mobile}
                                            placeholder='Mobile Number'
                                            onChange={handleChange}
                                            className="w-full text-[14px] px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                                        {!/^[6-9]\d{9}$/.test(formData.mobile) && formData.mobile && !errors.mobile && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Mobile number must:
                                                <ul className="list-disc pl-5">
                                                    <li className="text-red-400">Be a valid 10-digit number starting with 6-9</li>
                                                </ul>
                                            </div>
                                        )}

                                    </div>

                                    <div className="mb-4">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            placeholder='Email'
                                            onChange={handleChange}
                                            className="w-full text-[14px] px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        {formData.email && !/\S+@\S+\.\S+/.test(formData.email) && !errors.email && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Email must:
                                                <ul className="list-disc pl-5">
                                                    <li className="text-red-400">Be a valid email address</li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-2 relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder='Password'
                                            className="w-full text-[14px] px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePassword}
                                            className="absolute right-3 top-1 text-gray-600"
                                        >
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </button>
                                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                        {formData.password && !errors.password && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                Password must contain:
                                                <ul className="list-disc pl-5">
                                                    {!/^.{8,}$/.test(formData.password) && (
                                                        <li className="text-red-400">At least 8 characters</li>
                                                    )}
                                                    {!/[A-Z]/.test(formData.password) && (
                                                        <li className="text-red-400">One uppercase letter</li>
                                                    )}
                                                    {!/[a-z]/.test(formData.password) && (
                                                        <li className="text-red-400">One lowercase letter</li>
                                                    )}
                                                    {!/[0-9]/.test(formData.password) && (
                                                        <li className="text-red-400">One number</li>
                                                    )}
                                                    {/[^A-Za-z0-9]/.test(formData.password) && (
                                                        <li className="text-red-400">No special characters allowed</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!isFormValid || isLoading}
                                        aria-busy={isLoading}
                                        className={`w-full my-6 text-[18px] font-medium py-2 rounded-md transition flex items-center justify-center gap-2 ${
                                            isFormValid && !isLoading
                                                ? "bg-[#000000] text-[#21FF91] hover:bg-[#000000]"
                                                : "bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed"
                                        }`}
                                    >
                                        {isLoading ? (<><Spinner size="sm" /><span>Creating Account...</span></>) : 'Submit'}
                                    </button>
                                    <p className="text-center text-sm text-gray-500">
                                        <span className="opacity-75">Already Verified?</span>{' '}
                                        <button
                                            type="button"
                                            onClick={() => router.push('/login')}
                                            className="
                                                text-black 
                                                font-medium 
                                                underline 
                                                underline-offset-2 
                                                hover:text-green-600
                                                transition-colors
                                            "
                                        >
                                            Login
                                        </button>
                                    </p>
                                </>
                            )}
                            {/* step === "verifyEmail" && (<>
                                <div className="">
                                    <h2 className="text-[26px] font-medium mb-1 text-[#726E7D] text-center">Verify your Email</h2>
                                    <p className="text-[15px] mb-6">
                                        We have sent a verification email to <span className="font-medium">{maskEmail(formData.email)}</span>
                                    </p>

                                    {secondsLeft > 0 ? (
                                        <p className="text-[#7C7C7A] text-[15px]">Link expires in <span className='text-green-400'>{secondsLeft} second{secondsLeft !== 1 && 's'}</span></p>
                                    ) : (
                                        <p className="text-red-500 text-[15px] font-medium">Link expired</p>
                                    )}

                                    <p className="mt-20 mb-4 text-[14px] text-[#726E7D]">Didn't receive the email? Check spam folder or</p>

                                    <button
                                        onClick={() => {
                                            setStep("completeProfile");
                                            setSecondsLeft(60);
                                        }}
                                        disabled={!isFormValid}
                                        className={`w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md transition ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#000000]'
                                            }`}
                                    >
                                        Resend
                                    </button>
                                </div>
                            </>)} */}
                            {step === "checkEmail" && (
                                <>
                                    <div className='text-center'>
                                        <img
                                            src='../assets/notificationIcon.svg'
                                            alt="Check Email"
                                            className="w-[65px] h-[65px] mx-auto mb-6"
                                        />

                                        <h2 className="text-[26px] font-medium mb-1 text-[#726E7D]">Check Your Email</h2>

                                        <p className="text-[15px] mb-6 text-[#7C7C7A]">
                                            We've sent an activation link to <strong>{maskEmail(formData.email)}</strong>
                                        </p>

                                        <p className="text-[14px] mb-6 text-[#7C7C7A]">
                                            Please check your email and click the verification link to activate your account.
                                        </p>

                                        <p className="text-[12px] text-[#A7AAAD] mt-8">
                                            Didn't receive the email? Please check your spam folder.
                                        </p>
                                    </div>
                                </>
                            )}
                            {step === "completeProfile" && (
                                <>
                                    <h2 className="text-[26px] font-medium mb-1 text-[#726E7D] text-center">Complete Your Profile</h2>

                                    <p className="text-[15px] mb-6 text-[#726E7D]">
                                        Please sign in to your account and start the adventure
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
                                    {errors.submit && (
                                        <p className="text-red-500 text-sm mt-2">{errors.submit}</p>
                                    )}
                                    <button
                                        onClick={() => submitProfileData()}
                                        className={`w-full text-lg font-medium py-2 rounded-md transition ${
                                            isProfileDataFormValid 
                                                ? 'bg-[#000000] text-[#21FF91] hover:bg-[#000000] cursor-pointer' 
                                                : 'bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed'
                                        }`}
                                        disabled={!isProfileDataFormValid}
                                    >
                                        Request For Approval
                                    </button>
                                </>
                            )}
                            {step === "pending" && (
                                <>
                                    <div className='text-center'>
                                        <img
                                            src='../assets/pendingIcon.svg'
                                            alt="Welcome"
                                            className="w-[65px] h-[65px] mx-auto mb-6"
                                        />

                                        <h2 className="text-[26px] font-medium mb-1">Pending Admin Approval</h2>

                                        <p className="text-[15px] mb-6">
                                            Your request has been submitted. You'll receive an update once approved.
                                        </p>
                                    </div>
                                </>
                            )}
                            {step === "approved" && (
                                <>
                                    <div className='text-center'>
                                        <img
                                            src='../assets/approveIcon.svg'
                                            alt="Welcome"
                                            className="w-[65px] h-[65px] mx-auto mb-6"
                                        />

                                        <h2 className="text-[26px] font-medium mb-1">Request Approved</h2>

                                        <p className="text-[15px] mb-8">
                                            Your request has been approved. You can now login using your credentials.
                                        </p>

                                        <button
                                            onClick={() => setSignInModal(false)}
                                            className={`w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md transition hover:bg-[#000000]`}
                                        >
                                            Back To Login
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
                : <Login />
            }
        </>
    );
}