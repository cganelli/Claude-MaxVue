import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/welcome');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError('Error sending reset email. Please try again.');
      } else {
        setResetEmailSent(true);
        setError('');
      }
    } catch (err) {
      setError('Error sending reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] flex items-center justify-center px-4 font-garamond">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/maxvue_logo_transparent_bg.png" 
            alt="MaxVue" 
            className="h-24 w-auto mx-auto mb-2"
          />
          <h2 className="text-3xl font-bold text-black">Ready, Set, See!</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
              placeholder="Email"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {resetEmailSent && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-green-600 text-sm">
                Password reset email sent! Check your inbox.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-vivid-blue-500 text-white py-4 px-6 rounded-2xl text-lg font-semibold hover:bg-dark-blue-900 active:bg-dark-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            <span>{isLoading ? 'Logging in...' : 'Log in'}</span>
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-gray-600 underline hover:text-gray-800 transition-colors text-lg"
          >
            Forgot password?
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-900 text-lg">
            Don't have an account?{' '}
            <Link 
              to="/register"
              className="text-gray-600 underline hover:text-gray-800 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;