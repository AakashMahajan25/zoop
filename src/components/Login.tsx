'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { useRole } from '@/app/context/RoleContext';
import { useAuth } from '@/app/context/AuthContext';
import { Spinner } from '@/components/Spinner';
import { getContextualErrorMessage } from '@/utils/errorMessages';

type LoginStep = 'signIn' | 'forgotPassword' | 'checkEmail' | 'resetPassword' | 'resetsuccessfully';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<LoginStep>('signIn');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState<boolean>(false);
  const router = useRouter();
  // const { role, setRole } = useRole();
  const { login, forgotPassword: handleForgotPassword, resetPassword: handleResetPassword, error: authError, clearError, isLoading } = useAuth();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const validate = (field?: keyof FormErrors, step: LoginStep = 'signIn'): FormErrors => {
    const errs: FormErrors = {};
    if (!field || field === 'email') {
      if (!email) errs.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email address';
    }
    if (step === 'signIn' && (!field || field === 'password')) {
      if (!password) errs.password = 'Password is required';
    }
    if (step === 'resetPassword') {
      if (!field || field === 'password') {
        if (!password) errs.password = 'Password is required';
        else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
        else if (!/[A-Z]/.test(password)) errs.password = 'Password must contain at least one uppercase letter';
        else if (!/[a-z]/.test(password)) errs.password = 'Password must contain at least one lowercase letter';
        else if (!/[0-9]/.test(password)) errs.password = 'Password must contain at least one number';
        else if (/[^A-Za-z0-9]/.test(password)) errs.password = 'Password cannot contain special characters';
      }
      if (!field || field === 'confirmPassword') {
        if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
        else if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match';
      }
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(undefined, 'signIn');
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      clearError();
      const success = await login({ email, password });
      if (success) {
        router.push('/dashboard');
      }
    }
  };

  // const getRoleId = (role: string): number => {
  //   switch (role) {
  //     case 'admin': return 1;
  //     case 'intimation': return 2;
  //     case 'auditor': return 3;
  //     case 'workshopAndcustomer': return 4;
  //     default: return 1;
  //   }
  // };

  const maskEmail = (email: string): string => {
    const [user, domain] = email.split('@');
    const maskedUser = user[0] + '*'.repeat(user.length - 2) + user.slice(-1);
    const [domainName, domainExt] = domain.split('.');
    const maskedDomain = domainName[0] + '*'.repeat(domainName.length - 2) + domainName.slice(-1);
    return `${maskedUser}@${maskedDomain}.${domainExt}`;
  };

  // const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setRole(event.target.value as 'admin' | 'intimation' | 'auditor' | 'workshopAndcustomer');
  // };

  const isResetPasswordValid = !errors.password && !errors.confirmPassword && password && confirmPassword;

  return (
    <div className="h-screen bg-[#EDFFF6] font-Geist text-[#4B465C] relative">
      <img src="../assets/Group.svg" alt="Background" className="w-full h-full object-cover" />
      <img src="../assets/loginBg.svg" alt="Login Background" className="absolute top-3 lg:top-6 lg:left-[28rem] z-10" />
      <img
        src="../assets/loginBg.svg"
        alt="Login Background"
        className="absolute bottom-28 right-[1px] lg:bottom-8 lg:right-[28rem] z-10 rotate-180"
      />
      <div className="bg-[#FFFFFF] w-[350px] lg:w-[450px] rounded-lg border border-[#E5E5E5] absolute top-[100px] left-1/2 transform -translate-x-1/2 z-20">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="flex justify-center mb-4">
            <img src="../assets/logo.svg" alt="Logo" className="h-[43px] w-[157px]" />
          </div>
          {step === 'signIn' && (
            <>
              <h2 className="text-2xl font-medium mb-1 text-center">Welcome to Zoop!</h2>
              <p className="text-[14px] mb-6 text-center">Please sign in to your account and start the adventure</p>
              <div className="mb-4">
                <label className="block text-[14px] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] ${errors.email ? 'border-red-500' : email && !errors.email ? 'border-green-500' : 'border-[#E5E5E5]'
                    }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                {email && !/\S+@\S+\.\S+/.test(email) && !errors.email && (
                  <div className="text-xs text-gray-500 mt-1">
                    Email must:
                    <ul className="list-disc pl-5">
                      <li className="text-red-400">Be a valid email address</li>
                    </ul>
                  </div>
                )}

              </div>
              <div className="mb-2 relative">
                <label className="block text-[14px] mb-1">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-[14px] ${errors.password ? 'border-red-500' : password && !errors.password ? 'border-green-500' : 'border-[#E5E5E5]'
                    }`}
                  placeholder="Enter your password"
                />
                <button type="button" onClick={togglePassword} className="absolute right-3 top-8">
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                <div className="mb-4 text-right">
                  <button
                    type="button"
                    onClick={() => setStep('forgotPassword')}
                    className="text-[#000000] text-[12px] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              {/* Role dropdown commented out
              <div className="flex items-center gap-2 mb-4">
                <label htmlFor="role-select" className="text-[14px]">
                  Select Role:
                </label>
                <select
                  id="role-select"
                  value="admin"
                  onChange={() => {}}
                  className="border px-2 py-1 rounded outline-none border-gray-300 w-24 text-[14px]"
                >
                  <option value="admin">Admin</option>
                  <option value="intimation">Intimation</option>
                  <option value="auditor">Auditor</option>
                  <option value="workshopAndcustomer">Workshop</option>
                </select>
              </div>
              */}
              {authError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {getContextualErrorMessage(authError, 'login')}
                </div>
              )}
              <button
                type="submit"
                aria-busy={isLoading}
                className={`w-full text-lg font-medium py-2 rounded-md transition flex items-center justify-center gap-2 ${Object.keys(validate(undefined, 'signIn')).length === 0 && !isLoading ? 'hover:bg-[#000000] text-[#21FF91] bg-[#000000]' : 'bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed'
                  }`}
                disabled={Object.keys(validate(undefined, 'signIn')).length > 0 || isLoading}
              >
                {isLoading ? (<><Spinner size="sm" /><span>Signing In...</span></>) : 'Sign In'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-6">
                <span className="opacity-75">New on our platform?</span>{' '}
                <button
                  type="button"
                  onClick={() => router.push('/sign-up')}
                  className="
                    text-black 
                    font-medium 
                    underline 
                    underline-offset-2 
                    hover:text-green-600
                    transition-colors
                  "
                >
                  Sign Up
                </button>
              </p>

            </>
          )}
          {step === 'forgotPassword' && (
            <>
              <h2 className="text-[24px] font-medium mb-1 text-center">Forgot password?</h2>
              <p className="text-[14px] mb-6 text-[#726E7D]">
                Enter your email address to get link to reset your password
              </p>
              <div className="mb-4">
                <label className="block text-[12px] mb-1 text-[#726E7D]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[14px] ${errors.email ? 'border-red-500' : email && !errors.email ? 'border-green-500' : 'border-[#E5E5E5]'
                    }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                {email && !/\S+@\S+\.\S+/.test(email) && !errors.email && (
                  <div className="text-xs text-gray-500 mt-1">
                    Email must:
                    <ul className="list-disc pl-5">
                      <li className="text-red-400">Be a valid email address</li>
                    </ul>
                  </div>
                )}

              </div>
              {authError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {getContextualErrorMessage(authError, 'forgotPassword')}
                </div>
              )}
              <button
                type="button"
                onClick={async () => {
                  clearError();
                  setForgotPasswordLoading(true);
                  try {
                    const success = await handleForgotPassword(email);
                    if (success) {
                      setStep('checkEmail');
                    }
                  } finally {
                    setForgotPasswordLoading(false);
                  }
                }}
                aria-busy={forgotPasswordLoading}
                className={`w-full text-lg font-medium py-2 rounded-md transition flex items-center justify-center gap-2 ${email && /\S+@\S+\.\S+/.test(email) && !errors.email && !forgotPasswordLoading
                    ? 'hover:bg-[#000000] text-[#21FF91] bg-[#000000]'
                    : 'bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed'
                  }`}
                disabled={!email || !/\S+@\S+\.\S+/.test(email) || !!errors.email || forgotPasswordLoading}
              >
                {forgotPasswordLoading ? (<><Spinner size="sm" /><span>Sending...</span></>) : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                <span className="opacity-75">New on our platform?</span>{' '}
                <button
                  type="button"
                  onClick={() => router.push('/sign-up')}
                  className="
                    text-black 
                    font-medium 
                    underline 
                    underline-offset-2 
                    hover:text-green-600
                    transition-colors
                  "
                >
                  Sign Up
                </button>
              </p>
            </>
          )}
          {step === 'checkEmail' && (
            <>
              <h2 className="text-[24px] font-medium mb-1 text-center">Check your Email</h2>
              <p className="text-[15px] mb-6 text-[#726E7D]">
                We have sent an email with password reset information to{' '}
                <span className="font-medium">{maskEmail(email)}</span>
              </p>
              <div className="mb-4 text-[12px] text-[#6F6B7D]">
                <p>Didn&apos;t receive the email? Please check your spam folder.</p>
              </div>
              <button
                onClick={() => setStep('signIn')}
                type="button"
                className="w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md hover:bg-[#000000] transition"
              >
                Go to Login
              </button>
              <p className="text-center text-sm text-gray-500 mt-6">
                <span className="opacity-75">New on our platform?</span>{' '}
                <button
                  type="button"
                  onClick={() => router.push('/sign-up')}
                  className="
                    text-black 
                    font-medium 
                    underline 
                    underline-offset-2 
                    hover:text-green-600
                    transition-colors
                  "
                >
                  SignUp
                </button>
              </p>
            </>
          )}
          {step === 'resetPassword' && (
            <>
              <h2 className="text-[24px] font-medium mb-1 text-center">Reset Password</h2>
              <p className="text-[14px] mb-8 text-[#726E7D]">
                Choose a new password for your account
              </p>
              <div className="mb-2 relative">
                <label className="block text-[12px] mb-1">Your new password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-[14px] ${errors.password ? 'border-red-500' : password && !errors.password ? 'border-green-500' : 'border-[#E5E5E5]'
                    }`}
                  placeholder="Enter new password"
                />
                <button type="button" onClick={togglePassword} className="absolute right-3 top-8 text-gray-600">
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                {password && !errors.password && (
                  !/^.{8,}$/.test(password) ||
                  !/[A-Z]/.test(password) ||
                  !/[a-z]/.test(password) ||
                  !/[0-9]/.test(password) ||
                  /[^A-Za-z0-9]/.test(password)
                ) && (
                    <div className="text-xs text-gray-500 mt-1">
                      Password must contain:
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
                <label className="block text-[12px] mb-1">Confirm your new password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-[14px] ${errors.confirmPassword
                      ? 'border-red-500'
                      : confirmPassword && !errors.confirmPassword
                        ? 'border-green-500'
                        : 'border-[#E5E5E5]'
                    }`}
                  placeholder="Confirm new password"
                />
                <button type="button" onClick={togglePassword} className="absolute right-3 top-7 text-gray-600">
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
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
                  {getContextualErrorMessage(authError, 'resetPassword')}
                </div>
              )}
              <button
                onClick={async () => {
                  clearError();
                  const success = await handleResetPassword({
                    token: 'reset-token', // You'll need to get this from URL params or state
                    password
                  });
                  if (success) {
                    setStep('resetsuccessfully');
                  }
                }}
                type="button"
                disabled={!isResetPasswordValid || isLoading}
                aria-busy={isLoading}
                className={`w-full text-lg font-medium py-2 rounded-md transition flex items-center justify-center gap-2 ${isResetPasswordValid && !isLoading
                    ? 'bg-[#000000] text-[#21FF91] hover:bg-[#000000]'
                    : 'bg-[#F6F7F7] shadow-[0_4px_6px_-1px_rgba(165,163,174,0.3)] border border-[#A5A3AE4D] text-[#A7AAAD] cursor-not-allowed'
                  }`}
              >
                {isLoading ? (<><Spinner size="sm" /><span>Resetting...</span></>) : 'Reset Password'}
              </button>
              <p className="text-center text-sm text-gray-500 mt-6">
                <span className="opacity-75">New on our platform?</span>{' '}
                <button
                  type="button"
                  onClick={() => router.push('/sign-up')}
                  className="
                    text-black 
                    font-medium 
                    underline 
                    underline-offset-2 
                    hover:text-green-600
                    transition-colors
                  "
                >
                  SignUp
                </button>
              </p>
            </>
          )}
          {step === 'resetsuccessfully' && (
            <>
              <div className="text-center">
                <img src="../assets/successIcon.svg" alt="Success" className="w-[120px] h-[120px] mx-auto mb-6" />
                <p className="text-[15px] mb-6">Password reset successfully</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md transition hover:bg-[#000000]"
                >
                  Sign In
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}