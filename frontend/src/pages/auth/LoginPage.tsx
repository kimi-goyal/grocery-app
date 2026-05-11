// import AuthLayout from '../../layouts/AuthLayout'
// import LoginForm from '../../components/auth/LoginForm'

// const LoginPage = () => {
//   return (
//     <AuthLayout>
//       <LoginForm />
//     </AuthLayout>
//   )
// }

// export default LoginPage
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username: email, password });
    navigate('/home');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
      <Input
        label="Email / Phone"
        type="email"
        placeholder="Enter email or phone"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        label="Password"
        type={showPass ? 'text' : 'password'}
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        rightEl={
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPass ? '🙈' : '👁️'}
          </button>
        }
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="text-xs text-[#ff4d6d] hover:text-pink-300 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" variant="primary" className="mt-1 glow-pink-sm">
        Login
      </Button>

      <p className="text-center text-sm text-gray-500 mt-1">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-[#ff4d6d] hover:text-pink-300 font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
