import React, { useState } from 'react';

import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react';

import {
  login as loginApi,
  signup as signupApi,
} from '../services/authService';
import Input from './ui/Input';

function getApiErrorMessage(err, fallback) {
  const msg = err?.response?.data?.message;
  if (msg) return msg;
  if (err?.response?.status) return `Request failed (${err.response.status}). Please try again.`;
  if (err?.message?.toLowerCase?.().includes('network')) {
    return 'Cannot connect to the server. Make sure backend is running on port 5000.';
  }
  return fallback;
}

function Login({ setIsLoggedIn }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    const newErrors = {};
    if (isLoginView) {
      if (!email.trim()) newErrors.email = isAdmin ? 'Admin ID is required' : 'Email is required';
      if (!password) newErrors.password = 'Password is required';
    } else {
      if (!name.trim()) newErrors.name = 'Full name is required';
      if (!email.trim()) newErrors.email = 'Email is required';
      if (!password) newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setSuccess('');

    if (!validate()) return;

    setLoading(true);

    try {
      if (isLoginView) {
        const data = await loginApi(email, password);

        if (isAdmin && data.role !== 'admin') {
          setGlobalError('Admin access required');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        setIsLoggedIn(true);
      } else {
        await signupApi(name, email, password);
        setSuccess('Account created successfully!');
        setTimeout(() => setIsLoginView(true), 1500);
      }
    } catch (err) {
      setGlobalError(getApiErrorMessage(err, 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-purple-50 text-gray-900">

      <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Shield className="h-10 w-10 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isLoginView
              ? (isAdmin ? 'Admin login panel' : 'Login to your account')
              : 'Sign up to continue'}
          </p>
        </div>

        {/* Admin/User Toggle */}
        {isLoginView && (
          <div className="mb-5 flex justify-center gap-3">

            <button
              type="button"
              onClick={() => setIsAdmin(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition 
              ${!isAdmin ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              User Login
            </button>

            <button
              type="button"
              onClick={() => setIsAdmin(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition 
              ${isAdmin ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Admin Login
            </button>

          </div>
        )}

        {/* Errors */}
        {globalError && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {globalError}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLoginView && (
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              leftIcon={User}
            />
          )}

          <Input
            label={isAdmin ? 'Admin Email / ID' : 'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            leftIcon={Mail}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={Lock}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center"
          >
            {loading && <Loader2 className="animate-spin mr-2" />}
            {isLoginView ? 'Login' : 'Sign Up'}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </button>

        </form>

        {/* Switch */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLoginView ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="ml-2 text-indigo-600 hover:text-indigo-500"
          >
            {isLoginView ? 'Sign up' : 'Login'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;