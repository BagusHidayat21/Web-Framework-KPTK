'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import { api } from '@/lib/api';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rightElement?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  icon,
  onChange,
  rightElement,
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">
        {icon}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white/70 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {rightElement && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </span>
      )}
    </div>
  </div>
);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/register', formData);
      alert('Register berhasil! Silakan login.');
      router.push('/auth/login');
    } catch (error) {
      console.error('Register failed:', error);
      alert('Gagal register. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { text: '', color: '' };
    if (password.length < 6) return { text: 'Weak', color: 'text-red-500' };
    if (password.length < 10) return { text: 'Medium', color: 'text-yellow-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const isPasswordMatch = formData.password && formData.password === formData.confirmPassword;
  const isFormValid = acceptedTerms && isPasswordMatch && !!formData.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 rounded-2xl" />
          <div className="relative z-10">
            {/* Back Link */}
            <a href="/auth/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Login</span>
            </a>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600">Join us today and get started</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                placeholder="Your name"
                icon={<User />}
                onChange={handleInputChange}
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                icon={<Mail />}
                onChange={handleInputChange}
              />

              <div className="space-y-2">
                <InputField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  placeholder="Create a strong password"
                  icon={<Lock />}
                  onChange={handleInputChange}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
                {formData.password && (
                  <div className={`text-xs font-medium mt-1 ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  placeholder="Confirm your password"
                  icon={<Lock />}
                  onChange={handleInputChange}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                />
                {formData.confirmPassword && (
                  isPasswordMatch ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                      <Check className="w-4 h-4" />
                      Passwords match
                    </div>
                  ) : (
                    <div className="text-red-500 text-xs mt-1">Passwords do not match</div>
                  )
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  required
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a> and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium 
                           hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] 
                           shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Account'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?
                  <a href="/auth/login" className="ml-1 text-blue-600 hover:text-blue-700 font-medium">Sign in</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}