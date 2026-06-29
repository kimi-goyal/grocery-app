

import { useState, useCallback } from 'react';
import Input from '../common/Input';
import PasswordStrengthBar from './PasswordStrengthBar';
import { useAuthStore } from '../../store/authStore';



import {
  validateName,
  validateEmail,
  validateUsername,
  validatePassword,
  validateConfirmPassword,
  hasErrors,
} from '../../utils/validators';
import { useNavigate } from 'react-router-dom';

import GoogleButton from './GoogleButton';

interface Props {
  onSwitch: () => void;
  onRegistered: () => void;
}

export default function RegisterForm({ onSwitch, onRegistered }: Props) {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirm: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    username: false,
    password: false,
    confirm: false,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    loading,
    error,
    fieldErrors,
    clearError,
    clearFieldErrors,
  } = useAuthStore();

  const navigate = useNavigate();
  /* ---------------- Validation ---------------- */

  const liveErrors = {
    name: validateName(fields.name),
    email: validateEmail(fields.email),
    username: validateUsername(fields.username),
    password: validatePassword(fields.password),
    confirm: validateConfirmPassword(fields.password, fields.confirm),
  };

  // Server errors override client errors
  const resolvedErrors = {
    name: fieldErrors.name || liveErrors.name,
    email: fieldErrors.email || liveErrors.email,
    username: fieldErrors.username || liveErrors.username,
    password: fieldErrors.password || liveErrors.password,
    confirm: liveErrors.confirm,
  };

  /* ---------------- Helpers ---------------- */

  const setField =
    (key: keyof typeof fields) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        clearError();
        clearFieldErrors();
        setFields(prev => ({
          ...prev,
          [key]: e.target.value,
        }));
      };

  const touch =
    (key: keyof typeof touched) =>
      () =>
        setTouched(prev => ({
          ...prev,
          [key]: true,
        }));

  const touchAll = () =>
    setTouched({
      name: true,
      email: true,
      username: true,
      password: true,
      confirm: true,
    });

  /* ---------------- Submit ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchAll();

    if (hasErrors(liveErrors)) return;

    try {
      await register({
        name: fields.name.trim(),
        email: fields.email.trim().toLowerCase(),
        username: fields.username.trim(),
        password: fields.password,
      });

      onRegistered();
    } catch {
      // handled inside auth store
    }
  };

  /* ---------------- UI Helpers ---------------- */

  const EyeButton = ({
    show,
    toggle,
  }: {
    show: boolean;
    toggle: () => void;
  }) => (
    <button
      type="button"
      onClick={toggle}
      tabIndex={-1}
      className="text-gray-500 hover:text-gray-300 transition-colors p-0.5"
    >
      {show ? (
        <svg
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

  /* ---------------- JSX ---------------- */

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="text-gray-400 mt-1 text-sm">
          Join us and order groceries faster than ever.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-2 animate-fadeIn"
      >
        {/* Global API error */}
        {error && (
          <div className="flex gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fields.name}
          onChange={setField('name')}
          onBlur={touch('name')}
          touched={touched.name}
          error={resolvedErrors.name}
          autoComplete="name"
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          value={fields.email}
          onChange={setField('email')}
          onBlur={touch('email')}
          touched={touched.email}
          error={resolvedErrors.email}
          autoComplete="email"
        />

        <Input
          label="Username"
          type="text"
          placeholder="johndoe123"
          value={fields.username}
          onChange={setField('username')}
          onBlur={touch('username')}
          touched={touched.username}
          error={resolvedErrors.username}
          autoComplete="username"
          hint={!touched.username ? 'Letters, numbers, underscores only' : undefined}
        />

        <div className="flex flex-col gap-1">
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            value={fields.password}
            onChange={setField('password')}
            onBlur={touch('password')}
            touched={touched.password}
            error={resolvedErrors.password}
            autoComplete="new-password"
            rightEl={
              <EyeButton
                show={showPass}
                toggle={() => setShowPass(v => !v)}
              />
            }
          />

          {fields.password && (
            <PasswordStrengthBar password={fields.password} />
          )}
        </div>

        <Input
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repeat your password"
          value={fields.confirm}
          onChange={setField('confirm')}
          onBlur={touch('confirm')}
          touched={touched.confirm}
          error={resolvedErrors.confirm}
          autoComplete="new-password"
          rightEl={
            <EyeButton
              show={showConfirm}
              toggle={() => setShowConfirm(v => !v)}
            />
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-3 rounded-2xl font-semibold text-white transition-all disabled:opacity-60"
          style={{
            background: 'linear-gradient(135deg, #ff4d6d, #e63c5a)',
            boxShadow: loading ? 'none' : '0 8px 25px rgba(255,77,109,0.35)',
          }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
       <GoogleButton label="Sign up with Google" />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="text-[#ff4d6d] font-semibold hover:text-pink-300"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}