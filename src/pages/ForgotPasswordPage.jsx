import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { Link } from 'react-router-dom';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await apiClient.forgotPassword({ email });
      setMessage('If that email exists, a reset link has been sent');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-accent flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">Forgot Password</h1>
        <p className="text-tertiary_text mb-6">Enter your email to receive a password reset link.</p>

        {message && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">{message}</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-primary_text mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-900 text-white py-2 rounded-lg font-semibold hover:bg-primary-900/90 disabled:opacity-50 transition-colors mt-6"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className="text-center text-tertiary_text mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-accent font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
