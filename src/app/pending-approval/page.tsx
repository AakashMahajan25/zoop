'use client';
import { useRouter } from 'next/navigation';

export default function PendingApprovalPage() {
  const router = useRouter();

  const handleGoToLogin = () => {
    router.push('/login');
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

          <div className='text-center'>
            <img
              src='/assets/pendingIcon.svg'
              alt="Pending Approval"
              className="w-[65px] h-[65px] mx-auto mb-6"
            />

            <h2 className="text-[26px] font-medium mb-1 text-[#726E7D]">Pending Admin Approval</h2>

            <p className="text-[15px] mb-6 text-[#7C7C7A]">
              Your request has been submitted. You'll receive an update once approved.
            </p>

            <button
              onClick={handleGoToLogin}
              className="w-full bg-[#000000] text-lg text-[#21FF91] font-medium py-2 rounded-md transition hover:bg-[#000000]"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
