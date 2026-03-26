import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiFetch } from '../lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/forgot-password/request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setStep(2);
      setInfo(data?.message || 'OTP sent. Check your email.');
      if (data?.devOtp) {
        setInfo(`${data.message} (Dev OTP: ${data.devOtp})`);
      }
    } catch (err: any) {
      setError(err?.error || err?.message || 'Could not send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });
      setInfo(data?.message || 'Password updated successfully.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      setError(err?.error || err?.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-7">
          <div className="bg-[#2A1B7A] p-3 rounded-2xl mb-4">
            <KeyRound className="h-7 w-7 text-[#F28C3A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2A1B7A]">Forgot Password</h1>
          <p className="text-gray-500 mt-2 text-center">
            {step === 1 ? 'We will send an OTP to your email.' : 'Enter OTP and set your new password.'}
          </p>
        </div>

        {error ? <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</div> : null}
        {info ? <div className="mb-4 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">{info}</div> : null}

        {step === 1 ? (
          <form onSubmit={requestOtp} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-xl pl-11"
                />
                <Mail className="h-4 w-4 text-gray-400 absolute left-4 top-4" />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">OTP Code</label>
              <div className="relative">
                <Input
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit OTP"
                  className="h-11 rounded-xl pl-11 tracking-widest"
                />
                <ShieldCheck className="h-4 w-4 text-gray-400 absolute left-4 top-3.5" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">New Password</label>
              <Input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
              <Input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="h-11 rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
              {loading ? 'Updating...' : 'Reset Password'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-[#2A1B7A] hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
