// src/components/Notifications.tsx
import React from 'react';
import { useNotifications } from '@/app/context/NotificationContext';

interface NotificationsProps {
  onClose: () => void;
}

const statusIcons: Record<string, string> = {
    pending: '/assets/pending.svg',
    unsaved: '/assets/unsaved.svg',
    failed: '/assets/error.svg',
    success: '/assets/success.svg',
};

const notificationColors: Record<string, string> = {
  pending: '#DBF6FD',
  unsaved: '#FFF6DB',
  failed: '#FDECED',
  success: '#CCFFE9',
};

const notificationTextColors: Record<string, string> = {
  pending: '#0CA0D7',
  unsaved: '#CCA400',
  failed: '#F04248',
  success: '#00DF80',
};

const timeIcon = '/assets/clock.svg';

const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const { notifications } = useNotifications();

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-[24px] px-8 py-4 font-medium text-[#5C5C5C]">
          Notifications and Alerts
        </h2>
        <button
          onClick={onClose}
          className="mr-8 outline-none cursor-pointer"
        >
          <img src="/assets/closeIcon.svg" alt="closeIcon" />
        </button>
      </div>
      {notifications.map((note) => (
        <div
          key={note.id}
          className="flex justify-between items-start border-b border-gray-200 px-8 py-4 bg-white"
        >
          <div className="flex items-start gap-4 justify-center">
            <div
              className="rounded-full p-3 flex items-center justify-center mt-3"
              style={{ border: `2px solid ${notificationColors[note.status]}` }}
            >
              <img
                src={statusIcons[note.status]}
                alt={note.status}
                className="w-6 h-6"
              />
            </div>
            <div>
              <p
                className="text-[10px] text-[#999] font-medium w-fit px-2 py-[2px] mb-1 rounded"
                style={{
                  backgroundColor: `${notificationColors[note.status]}`,
                  color: `${notificationTextColors[note.status]}`,
                }}
              >
                {note.tag}
              </p>
              <p className="text-[#212227] text-[20px]">{note.title}</p>
              <p className="text-[16px] text-[#5C5C5C]">{note.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <img src={timeIcon} alt="clock" className="w-4 h-4" />
            <span className="text-[#999999] text-[12px]">
              {note.time} at {note.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;