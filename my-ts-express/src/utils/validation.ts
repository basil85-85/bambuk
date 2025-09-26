// src/utils/validation.ts

/**
 * Validates email format using regex
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  if (trimmedEmail.length > 254) {
    return false;
  }
  
  if (trimmedEmail.includes('..')) {
    return false;
  }
  
  const [localPart] = trimmedEmail.split('@');
  if (localPart.length > 64) {
    return false;
  }
  
  return true;
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function processEmail(email: string): { isValid: boolean; email: string; error?: string } {
  if (!email) {
    return { isValid: false, email: '', error: 'Email is required' };
  }

  const sanitizedEmail = sanitizeEmail(email);
  const isValid = validateEmail(sanitizedEmail);
  
  return {
    isValid,
    email: sanitizedEmail,
    error: isValid ? undefined : 'Please provide a valid email address'
  };
}