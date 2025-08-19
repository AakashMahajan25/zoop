'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Search as SearchIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useRole } from '@/app/context/RoleContext';
import { useAuth } from '@/app/context/AuthContext';

// Import components
import HomeSection from '@/components/intimationSection/HomeSection';
import ClaimsDashboard from '@/components/intimationSection/ClaimsDashboard';
import AdminClaimsSection from '@/components/adminSection/AdminClaimsSection';
import AdminListView from './adminSection/AdminListView';
import Analytics from './adminSection/Analytics';
import Auditor from '@/components/auditorSection/Auditor';
import Notifications from './Notifications';

import logo from '../assets/smallLogo.svg';
import dasjboardIcon from '../assets/dasjboardIcon.svg';
import claimsIcon from '../assets/claimsIcon.svg';
import listIcon from '../assets/listIcon.svg';
import AnalyticsIcon from '../assets/AnalyticsIcon.svg';
import leftArrow from '../assets/leftArrow.svg';
import logo1 from '../assets/logo.svg';
import logoutIcon from '../assets/logoutIcon.svg';
import supportIcon from '../assets/supportIcon.svg';
import notificationIcon from '../assets/notificationIcon.svg';
import Avatar from '../assets/Avatar.svg';
import { useNotifications } from '@/app/context/NotificationContext';
import { AvatarDropdown } from './AvatarDropdown';

type TabName = 'Home' | 'Claims' | 'Lists' | 'Analytics';

interface TabItem {
  name: TabName;
  icon: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { role } = useRole();
  const { user, logout } = useAuth();

  const getInitialTab = (): TabName => {
    if (role === 'admin') {
      return 'Analytics';
    }
    if (role === 'auditor') {
      return 'Home';
    }
    if (role === 'claim-handler') {
      router.push('/upload-assessment');
      return 'Claims';
    }
    return 'Home';
  };

  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [notificationModal, setNotificationModal] = useState<boolean>(false);
  const [previousTab, setPreviousTab] = useState<TabName | null>(null);
  const { notifications } = useNotifications();
  console.log(notifications.length,"jhg")

  // Update activeTab when role changes
  useEffect(() => {
    if (role) {
      const initialTab = getInitialTab();
      setActiveTab(initialTab);
    }
  }, [role]);
  const allTabs: TabItem[] = [
    { name: 'Home', icon: dasjboardIcon },
    { name: 'Claims', icon: claimsIcon },
    { name: 'Lists', icon: listIcon },
    { name: 'Analytics', icon: AnalyticsIcon },
  ];

  const filteredTabs = (() => {
    switch (role) {
      case 'admin':
        return allTabs.filter(tab => ['Claims', 'Lists', 'Analytics'].includes(tab.name));
      case 'auditor':
        return allTabs.filter(tab => ['Home'].includes(tab.name));
      default: // claim-intimation and others
        return allTabs.filter(tab => ['Home', 'Lists'].includes(tab.name));
    }
  })();

  const notificationHandler = () => {
    if (!notificationModal) {
      setPreviousTab(activeTab); // Store current tab
      setNotificationModal(true);
    }
  };

  const closeNotifications = () => {
    setNotificationModal(false);
    if (previousTab) {
      setActiveTab(previousTab); // Restore previous tab
      setPreviousTab(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-[#FFFFFF] text-white transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col justify-between z-5 border border-[#EFEFEFE5]`}
      >
        <div>
          <div className={`flex items-center justify-between`}>
            {collapsed ? (
              <Image src={logo} alt="logo" className="p-2" width={50} height={50} />
            ) : (
              <Image src={logo1} alt="logo" className="h-14 w-auto" width={160} height={56} />
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`absolute ${
                collapsed ? 'left-12' : 'left-60'
              } bg-[#FFFFFF] border border-[#EEEEEE] p-2 z-10 rounded-full`}
            >
              <Image
                src={leftArrow}
                alt="leftArrow"
                className={collapsed ? 'rotate-180 h-4 w-4 cursor-pointer' : 'h-4 w-4 cursor-pointer'}
                width={16}
                height={16}
              />
            </button>
          </div>

          <nav className="mt-4">
            {filteredTabs.map((tab) => (
              <div
                key={tab.name}
                onClick={() => {
                  setActiveTab(tab.name);
                  setNotificationModal(false); // Close notifications when switching tabs
                  setPreviousTab(null);
                }}
                className={`cursor-pointer mx-2 px-2 py-3 flex items-center text-[#333333] hover:bg-[#F4FCF9] ${
                  activeTab === tab.name && !notificationModal
                    ? 'bg-[#F4FCF9] border border-[#21FF91] rounded-lg'
                    : ''
                }`}
              >
                <div className={`${collapsed ? '' : 'mr-4'}`}>
                  <Image src={tab.icon} alt={tab.name} width={24} height={24} />
                </div>
                {!collapsed && <span>{tab.name}</span>}
              </div>
            ))}
          </nav>
        </div>

        <div className="mb-4">
          <div className="flex items-center px-4 py-2 cursor-pointer text-[#333333] hover:bg-[#F4FCF9] hover:border border-[#21FF91] hover:rounded-lg">
            <Image src={supportIcon} alt="supportIcon" width={24} height={24} />
            {!collapsed && <span className="ml-3">Support</span>}
          </div>
          <div 
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="flex items-center px-4 py-2 cursor-pointer text-[#333333] hover:bg-[#F4FCF9] hover:border border-[#21FF91] hover:rounded-lg"
          >
            <Image src={logoutIcon} alt="logoutIcon" width={24} height={24} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-[#FBFBFB]">
                <div className="bg-[#FFFFFF] border-b border-[#EFEFEF] px-7 py-4 flex justify-between items-center flex-none">
                  <div className="flex border border-[#EFEFEF] p-1 rounded-[6px] text-sm w-full max-w-96 bg-[#FFFFFF]">
              <img src="/assets/searchIcon.svg" alt="search" className="ml-2" />
              <input
                type="text"
                placeholder="Search name & ID"
                className="flex-1 px-3 py-2 outline-none"
              />
            </div>
            {/* {activeTab !== 'Lists' ? (<div className="flex border border-[#EFEFEF] p-1 rounded-[6px] text-sm w-full max-w-96 bg-[#FFFFFF]">
              <img src="/assets/searchIcon.svg" alt="search" className="ml-2" />
              <input
                type="text"
                placeholder="Search name & ID"
                className="flex-1 px-3 py-2 outline-none"
              />
            </div>) :(<div className="flex text-sm w-full max-w-96 bg-[#FFFFFF]">
            </div>)} */}

          <div className="flex items-center gap-6">
            <button onClick={notificationHandler} className='cursor-pointer'>
              <span className='absolute top-4 bg-[#EA5455] rounded-xl px-1 text-sm text-[#FFFFFF]'>{notifications.length}</span><Image src={notificationIcon} alt="notificationIcon" width={24} height={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {user?.first_name} {user?.last_name}
              </span>
              <AvatarDropdown />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          {notificationModal ? (
            <Notifications onClose={closeNotifications} />
          ) : (
            <>
              {role === 'admin' && (
                <>
                  {activeTab === 'Lists' && <AdminClaimsSection />}
                  {activeTab === 'Claims' && <AdminListView />}
                  {activeTab === 'Analytics' && <Analytics />}
                </>
              )}

              {role === 'claim-intimation' && (
                <>
                  {activeTab === 'Home' && <HomeSection />}
                  {activeTab === 'Lists' && <ClaimsDashboard />}
                </>
              )}

              {role === 'auditor' && (
                <>
                  {activeTab === 'Home' && <Auditor />}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;