import { FileArray } from "./types";

export const validateFile = (file: File): string | null => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 5MB limit';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Only images and PDFs are allowed';
  }

  return null;
};

export const validateStep1 = (files: FileArray, selectedRole: 'customer' | 'workshop'): string[] => {
  const errors: string[] = [];
  
  if (selectedRole === 'customer') {
    files.forEach((fileGroup, index) => {
      if (fileGroup.length === 0) {
        errors[index] = 'This file is required';
      }
    });
  } else {
    if (files[0].length === 0) {
      errors[0] = 'Estimate document is required';
    }
  }
  
  return errors;
};

export const validatePersonalInfo = (firstName: string, lastName: string): { firstName?: string; lastName?: string } => {
  const errors: { firstName?: string; lastName?: string } = {};
  
  if (!firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  
  if (!lastName.trim()) {
    errors.lastName = 'Last name is required';
  }
  
  return errors;
};