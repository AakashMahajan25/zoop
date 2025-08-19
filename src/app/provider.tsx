'use client';

import { ReactNode, useEffect } from 'react';
import { LicenseManager } from '@ag-grid-enterprise/core';

export function AgGridLicenseProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_AG_GRID_LICENSE;
    console.log("key ", key);
    if (key) {
      LicenseManager.setLicenseKey(key);
    } else {
      console.log('AG-Grid license key is missing!');
    }
  }, []);

  return <>{children}</>;
}
