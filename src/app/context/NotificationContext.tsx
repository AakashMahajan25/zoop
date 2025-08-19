// File: src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Notification {
  id: number;
  status: 'pending' | 'unsaved' | 'failed' | 'success';
  tag: string;
  title: string;
  message: string;
  date: string;
  time: string;
}

interface NotificationContextType {
  notifications: Notification[];
  notificationCount: number;
  // Add methods for dynamic updates if needed
  // addNotification: (notification: Notification) => void;
  // removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: 1,
    status: 'pending',
    tag: 'Reminder',
    title: 'Claim Under Review',
    message: 'Your claim is currently under review. Please wait.',
    date: '2025-06-04',
    time: '10:30 AM',
  },
  {
    id: 2,
    status: 'unsaved',
    tag: 'Warning',
    title: 'Draft Not Saved',
    message: 'You have unsaved changes in your application.',
    date: '2025-06-03',
    time: '4:15 PM',
  },
  {
    id: 3,
    status: 'failed',
    tag: 'Error',
    title: 'Payment Failed',
    message: 'Your recent payment could not be processed.',
    date: '2025-06-02',
    time: '11:00 AM',
  },
  {
    id: 4,
    status: 'success',
    tag: 'Completed',
    title: 'Claim Approved',
    message: 'Congratulations! Your claim has been approved.',
    date: '2025-06-01',
    time: '9:00 AM',
  },
];

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const value: NotificationContextType = {
    notifications,
    notificationCount: notifications.length,
    // addNotification: (notification) => setNotifications([...notifications, notification]),
    // removeNotification: (id) => setNotifications(notifications.filter(n => n.id !== id)),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};