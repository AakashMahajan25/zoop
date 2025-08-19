'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '@/app/context/AuthContext';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPassword() {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword: handleResetPassword, error: authError, clearError, isLoading } = useAuth();

  useEffect(() => {
    if (!searchParams) {
      // Redirect to login if searchParams is null
      router.push('/login');
      return;
    }
    
    const tokenParam = searchParams.get('token');
    if (tokenParam && tokenParam.trim()) {
      setToken(tokenParam.trim());
    } else {
      // Redirect to login if no token
      router.push('/login');
    }
  }, [searchParams, router]);

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const validate = (field?: keyof FormErrors): FormErrors => {
    const errs: FormErrors = {};
    
    if (!field || field === 'password') {
      if (!password) {
        errs.password = 'Password is required';
      } else if (password.length < 8) {
        errs.password = 'Password must be at least 8 characters';
      } else if (!/[A-Z]/.test(password)) {
        errs.password = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(password)) {
        errs.password = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(password)) {
        errs.password = 'Password must contain at least one number';
      } else if (/[^A-Za-z0-9]/.test(password)) {
        errs.password = 'Password cannot contain special characters';
      }
    }
    
    if (!field || field === 'confirmPassword') {
      if (!confirmPassword) {
        errs.confirmPassword = 'Please confirm your password';
      } else if (confirmPassword !== password) {
        errs.confirmPassword = 'Passwords do not match';
      }
    }
    
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0 && token) {
      clearError();
      const success = await handleResetPassword({
        token,
        password
      });
      
      if (success) {
        setIsSuccess(true);
      } else {
        // If the API call fails, it might be due to an invalid/expired token
        // The error will be displayed by the authError from the context
        console.error('Password reset failed');
      }
    }
  };

  const isFormValid = !errors.password && !errors.confirmPassword && password && confirmPassword && password === confirmPassword && 
    password.length >= 8 && 
    /[A-Z]/.test(password) && 
    /[a-z]/.test(password) && 
    /[0-9]/.test(password) && 
    !/[^A-Za-z0-9]/.test(password);

  if (!token) {
    return (
      <div className="h-screen bg-[#EDFFF6] font-Geist text-[#4B465C] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000000] mx-auto mb-4"></div>
          <p className="text-[#726E7D]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="h-screen bg-[#EDFFF6] font-Geist text-[#4B465C] relative">
              <img src="/assets/Group.svg" alt="Background" className="w-full h-full object-cover" />
      <img src="/assets/loginBg.svg" alt="Login Background" className="absolute top-3 lg:top-6 lg:left-[28rem] z-10" />
      <img
        src="/assets/loginBg.svg"
        alt="Login Background"
        className="absolute bottom-28 right-[1px] lg:bottom-8 lg:right-[28rem] z-10 rotate-180"
      />
      <div className="bg-[#FFFFFF] w-[350px] lg:w-[450px] rounded-lg border border-[#E5E5E5] absolute top-[100px] left-1/2 transform -translate-x-1/2 z-20">
        <div className="p-8 text-center">
          <img src="/assets/successIcon.svg" alt="Success" className="w-[120px] h-[120px] mx-auto mb-6" />
            <h2 className="text-2xl font-medium mb-4">Password Changed Successfully!</h2>
            <p className="text-[15px] mb-6 text-[#726E7D]">
              Your password has been changed successfully. You can now login with your new password.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md transition hover:bg-[#000000]"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#EDFFF6] font-Geist text-[#4B465C] relative">
      <img src="/assets/Group.svg" alt="Background" className="w-full h-full object-cover" />
      <img src="/assets/loginBg.svg" alt="Login Background" className="absolute top-3 lg:top-6 lg:left-[28rem] z-10" />
      <img
        src="/assets/loginBg.svg"
        alt="Login Background"
        className="absolute bottom-28 right-[1px] lg:bottom-8 lg:right-[28rem] z-10 rotate-180"
      />
      <div className="bg-[#FFFFFF] w-[350px] lg:w-[450px] rounded-lg border border-[#E5E5E5] absolute top-[100px] left-1/2 transform -translate-x-1/2 z-20">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-center mb-4">
            <img src="/assets/logo.svg" alt="Logo" className="h-[43px] w-[157px]" />
          </div>
          
          <h2 className="text-2xl font-medium mb-1 text-center">Reset Password</h2>
          <p className="text-[14px] mb-8 text-center text-[#726E7D]">
            Choose a new password for your account
          </p>
          
          <div className="mb-4 relative">
            <label className="block text-[14px] mb-1">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: undefined }));
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-[14px] ${
                errors.password ? 'border-red-500' : password && !errors.password ? 'border-green-500' : 'border-[#E5E5E5]'
              }`}
              placeholder="Enter new password"
              aria-label="New password"
              aria-describedby={errors.password ? "password-error" : "password-requirements"}
            />
            <button 
              type="button" 
              onClick={togglePassword} 
              className="absolute right-3 top-8 text-gray-600"
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </button>
            {errors.password && <p id="password-error" className="text-red-500 text-sm mt-1">{errors.password}</p>}
            {password && !errors.password && (
              !/^.{8,}$/.test(password) ||
              !/[A-Z]/.test(password) ||
              !/[a-z]/.test(password) ||
              !/[0-9]/.test(password) ||
              /[^A-Za-z0-9]/.test(password)
            ) && (
              <div id="password-requirements" className="text-xs text-gray-500 mt-1">
                Password requirements:
                <ul className="list-disc pl-5">
                  {!/^.{8,}$/.test(password) && (
                    <li className="text-red-400">At least 8 characters</li>
                  )}
                  {!/[A-Z]/.test(password) && (
                    <li className="text-red-400">One uppercase letter</li>
                  )}
                  {!/[a-z]/.test(password) && (
                    <li className="text-red-400">One lowercase letter</li>
                  )}
                  {!/[0-9]/.test(password) && (
                    <li className="text-red-400">One number</li>
                  )}
                  {/[^A-Za-z0-9]/.test(password) && (
                    <li className="text-red-400">No special characters allowed</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mb-6 relative">
            <label className="block text-[14px] mb-1">Confirm New Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) {
                  setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-[14px] ${
                errors.confirmPassword
                  ? 'border-red-500'
                  : confirmPassword && !errors.confirmPassword
                    ? 'border-green-500'
                    : 'border-[#E5E5E5]'
              }`}
              placeholder="Confirm new password"
              aria-label="Confirm new password"
              aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            />
            <button 
              type="button" 
              onClick={toggleConfirmPassword} 
              className="absolute right-3 top-7 text-gray-600"
            >
              {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </button>
            {errors.confirmPassword && <p id="confirm-password-error" className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            {confirmPassword && confirmPassword !== password && !errors.confirmPassword && (
              <div className="text-xs text-gray-500 mt-1">
                Confirm password must:
                <ul className="list-disc pl-5">
                  <li className="text-red-400">Match the new password</li>
                </ul>
              </div>
            )}
          </div>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {authError}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full text-lg font-medium py-2 rounded-md transition ${
              isFormValid && !isLoading
                ? 'bg-[#000000] text-[#21FF91] hover:bg-[#000000]'
                : 'bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
          
          <p className="text-center text-sm text-gray-500 mt-6">
            <span className="opacity-75">Remember your password?</span>{' '}
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
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
