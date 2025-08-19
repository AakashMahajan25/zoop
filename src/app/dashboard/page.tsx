'use client';

import { useEffect, useState } from 'react';
import Dashboard from "@/components/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import RoleInitializer from "./role-initializer";
import { getCurrentUserRole, type Role } from "@/utils/roleMapping";

export default function Page() {
  const [role, setRole] = useState<Role>('claim-intimation');

  useEffect(() => {
    const userRole = getCurrentUserRole();
    setRole(userRole);
  }, []);

  return (
    <>
      <RoleInitializer role={role} />
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </>
  );
}