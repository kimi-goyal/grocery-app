
export type FieldError = string | null;

export interface LoginErrors {
  identifier: FieldError;
  password: FieldError;
}

export interface RegisterErrors {
  name: FieldError;
  email: FieldError;
  username: FieldError;
  password: FieldError;
  confirm: FieldError;
}

// ─── Individual field validators ───────────────────────────────────────────

export const validateEmail = (v: string): FieldError => {
  if (!v.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(v.trim())) return 'Enter a valid email address';
  return null;
};

export const validateUsername = (v: string): FieldError => {
  if (!v.trim()) return 'Username is required';
  if (v.length < 3) return 'Username must be at least 3 characters';
  if (v.length > 30) return 'Username must be under 30 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(v)) return 'Only letters, numbers, and underscores allowed';
  return null;
};

export const validateName = (v: string): FieldError => {
  if (!v.trim()) return 'Full name is required';
  if (v.trim().length < 2) return 'Name must be at least 2 characters';
  if (v.trim().length > 60) return 'Name is too long';
  if (!/^[a-zA-Z\s'-]+$/.test(v.trim())) return 'Name contains invalid characters';
  return null;
};

export const validatePassword = (v: string): FieldError => {
  if (!v) return 'Password is required';
  if (v.length < 8) return 'Password must be at least 8 characters';
  if (v.length > 72) return 'Password must be under 72 characters';
  if (!/[A-Z]/.test(v)) return 'Include at least one uppercase letter';
  if (!/[0-9]/.test(v)) return 'Include at least one number';
  return null;
};

export const validateConfirmPassword = (password: string, confirm: string): FieldError => {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return null;
};

export const validateIdentifier = (v: string): FieldError => {
  if (!v.trim()) return 'Email or username is required';
  if (v.length < 3) return 'Must be at least 3 characters';
  return null;
};

export const validateLoginPassword = (v: string): FieldError => {
  if (!v) return 'Password is required';
  if (v.length < 1) return 'Password is required';
  return null;
};

// ─── Full form validators ───────────────────────────────────────────────────

export const validateLoginForm = (identifier: string, password: string): LoginErrors => ({
  identifier: validateIdentifier(identifier),
  password: validateLoginPassword(password),
});

export const validateRegisterForm = (
  name: string, email: string, username: string, password: string, confirm: string
): RegisterErrors => ({
  name: validateName(name),
  email: validateEmail(email),
  username: validateUsername(username),
  password: validatePassword(password),
  confirm: validateConfirmPassword(password, confirm),
});

export const hasErrors = (errors: Record<string, FieldError>| any): boolean =>
  Object.values(errors).some(e => e !== null);

// ─── Password strength ──────────────────────────────────────────────────────

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export const getPasswordStrength = (password: string): { strength: PasswordStrength; score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { strength: 'weak', score, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { strength: 'fair', score, label: 'Fair', color: '#f97316' };
  if (score === 3) return { strength: 'good', score, label: 'Good', color: '#eab308' };
  return { strength: 'strong', score, label: 'Strong', color: '#22c55e' };
};

