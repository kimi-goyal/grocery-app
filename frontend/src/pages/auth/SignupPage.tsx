// import AuthLayout from '../../layouts/AuthLayout'
// import RegisterForm from '../../components/auth/RegisterForm'

// const SignupPage = () => {
//   return (
//     <AuthLayout>
//       <RegisterForm />
//     </AuthLayout>
//   )
// }

// export default SignupPage

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({ name, email, username: email, password });
    navigate('/auth');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

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
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" variant="primary" className="mt-1 glow-pink-sm">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-500 mt-1">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-[#ff4d6d] hover:text-pink-300 font-medium"
        >
          Login
        </button>
      </p>
    </form>
  );
}