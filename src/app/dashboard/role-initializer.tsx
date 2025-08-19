'use client';

import { useEffect } from 'react';
import { useRole } from '@/app/context/RoleContext';
import { type Role } from '@/utils/roleMapping';

export default function RoleInitializer({ role }: { role: Role }) {
  const { setRole } = useRole();

  useEffect(() => {
    setRole(role);
  }, [role, setRole]);

  return null;
}


