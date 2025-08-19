'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Snackbar } from '@mui/material';
import { completeProfile, type CompleteProfilePayload } from '@/utils/api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface ProfileFormErrors {
  department?: string;
  responsibility?: string;
  experience_years?: string;
}

export default function ProfileCompletionPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [completeProfileData, setCompleteProfileData] = useState({
    department: '',
    responsibility: '',
    experience_years: '',
  });
  const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  console.log('ProfileCompletionPage: Component rendered');

  useEffect(() => {
    console.log('ProfileCompletionPage: useEffect triggered');
    // Check if user came from login with null role
    const userData = localStorage.getItem('profile_completion_user');
    const token = localStorage.getItem('access_token');
    
    console.log('ProfileCompletionPage: userData from localStorage:', userData);
    console.log('ProfileCompletionPage: token from localStorage:', token);
    
    if (!userData || !token) {
      // No profile completion data, redirect to login
      console.log('ProfileCompletionPage: No user data or token, redirecting to login');
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Also check if the user actually has a null role
      if (parsedUser.role !== null && parsedUser.role !== undefined) {
        // User already has a role, redirect to login
        localStorage.removeItem('profile_completion_user');
        localStorage.removeItem('access_token');
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Invalid user data in localStorage:', error);
      router.push('/login');
    }
  }, [router]);

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
    
    return profileErrs;
  };

  const handleProfileChange = (field: keyof typeof completeProfileData, value: string) => {
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
      setIsLoading(true);
      setApiError(null);
      
      const payload: CompleteProfilePayload = {
        department: completeProfileData.department,
        responsibility: completeProfileData.responsibility,
        experience_years: parseInt(completeProfileData.experience_years)
      };

      await completeProfile(payload);
      
      // Profile completed successfully
      // Clean up localStorage and redirect to login
      localStorage.removeItem('profile_completion_user');
      localStorage.removeItem('access_token');
      
      // Show success message and redirect
      setShowSuccessAlert(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Profile submission error:', error);
      setApiError(error instanceof Error ? error.message : 'An error occurred while submitting your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="h-screen bg-[#EDFFF6] font-Geist text-[#4B465C] relative">
        <img
          src='/assets/Group.svg'
          alt="Background"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="bg-[#FFFFFF] w-[360px] lg:w-[450px] rounded-lg border border-[#E5E5E5] absolute top-[150px] lg:top-[100px] left-1/2 transform -translate-x-1/2 z-20">
          <div className="p-4 lg:p-8 bg-white rounded-xl shadow-md lg:w-full lg:max-w-lg">
            <div className="flex justify-center mb-4">
              <img src='/assets/logo.svg' alt="Logo" className="h-[43px] w-[157px]" />
            </div>
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#000000] mx-auto mb-6"></div>
              <h2 className="text-[26px] font-medium mb-1 text-[#726E7D]">Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <div className='text-center'>
            <h2 className="text-[26px] font-medium mb-1 text-[#726E7D]">Complete Your Profile</h2>
            <p className="text-[15px] mb-6 text-[#726E7D]">
              Hello {user.first_name}! Please complete your profile to access the system.
            </p>
          </div>

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
                <option value="admin">Administrator</option>
                <option value="claim-handler">Claim Handler</option>
                <option value="auditor">Auditor</option>
                <option value="claim-intimation">Claim Intimation</option>
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
                <option value="Mechanic">Mechanic</option>
                <option value="Inspector">Inspector</option>
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

          <button
            onClick={submitProfileData}
            disabled={!isProfileDataFormValid() || isLoading}
            className={`w-full text-lg font-medium py-2 rounded-md transition ${
              isProfileDataFormValid() && !isLoading
                ? 'bg-[#000000] text-[#21FF91] hover:bg-[#000000] cursor-pointer' 
                : 'bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Complete Profile'}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                localStorage.removeItem('profile_completion_user');
                localStorage.removeItem('access_token');
                router.push('/login');
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>

      {/* Success Alert Snackbar */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={2000}
        onClose={handleCloseSuccessAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccessAlert}
          severity="success"
          variant="filled"
          className="shadow-lg"
        >
          Profile completed successfully! Please login again with your new role.
        </Alert>
      </Snackbar>
    </div>
  );
}
