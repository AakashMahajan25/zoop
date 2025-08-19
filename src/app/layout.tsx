// app/layout.tsx
'use client';
import './globals.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReactNode } from 'react';
import { RoleProvider } from '@/app/context/RoleContext';
import { NotificationProvider } from '@/app/context/NotificationContext';
import { AuthProvider } from '@/app/context/AuthContext';
import { IntimationFormProvider } from '@/app/context/IntimationFormContext';
import { AgGridLicenseProvider } from './provider';
import { RouteGuard } from '@/components/RouteGuard';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <AgGridLicenseProvider>
              <RoleProvider>
                <NotificationProvider>
                  <IntimationFormProvider>
                    <RouteGuard>
                      {children}
                    </RouteGuard>
                  </IntimationFormProvider>
                </NotificationProvider>
              </RoleProvider>
            </AgGridLicenseProvider>
          </AuthProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}