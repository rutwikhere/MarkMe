import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import iiitaLogo from '../assets/iiita-logo.gif';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!email.endsWith('@iiita.ac.in')) {
      setErrorMessage('Please use your IIIT Allahabad email');
      setLoading(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) navigate('/');
      else setErrorMessage('Invalid email or password');
    } catch {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1f4f9] to-[#d6e0ef] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-lg sm:max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10 animate-fade-in-up border border-gray-200">
        <div className="flex flex-col items-center mb-8 text-center space-y-1">
          <img src={iiitaLogo} alt="IIIT Allahabad Logo" className="w-24 h-24 object-contain mb-3" />
          <h1 className="text-3xl font-semibold text-gray-800">IIIT Allahabad</h1>
          <h2 className="text-lg font-medium text-gray-700">Attendance Manager</h2>
          <p className="text-sm text-gray-500">Faculty & Teacher Assistant (TA) Login</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mb-6 flex items-start">
            <AlertCircle className="text-red-500 mr-2 mt-0.5" size={18} />
            <p className="text-sm text-red-700">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@iiita.ac.in"
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all sm:text-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all sm:text-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white py-3 rounded-lg text-sm font-semibold shadow-lg flex items-center justify-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Authenticating...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Access is limited to IIIT Allahabad faculty & TAs only.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
