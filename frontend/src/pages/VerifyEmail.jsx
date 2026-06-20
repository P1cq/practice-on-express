import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail, resendOtp } from '../api/auth';
import OtpInput from '../components/OtpInput';
import Header from '../components/Header';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await verifyEmail(email, otp);
      setSuccess('Email verified! You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await resendOtp(email);
      setTimer(120);
      setCanResend(false);
      setSuccess('A new OTP has been sent to your email');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen auth-gradient flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-3xl overflow-hidden shadow-2xl">
          <div className="hidden lg:flex lg:col-span-2 bg-sage-950 flex-col items-center justify-center p-10">
            <div className="text-5xl text-white mb-4 font-display">∞</div>
            <h2 className="font-display text-xl text-white tracking-widest">sarihnaa</h2>
            <p className="text-sage-400 text-sm mt-4 text-center">
              Verify your identity to start your honest journey
            </p>
          </div>

          <div className="lg:col-span-3 glass-card p-8 md:p-10">
            <Link
              to="/signup"
              className="text-sm text-gray-500 hover:text-sage-900 flex items-center gap-1 mb-6"
            >
              <span>&lt;</span> Go back and edit
            </Link>

            <h1 className="text-2xl font-bold text-sage-900">Verify your email</h1>
            <p className="text-gray-500 text-sm mt-2 mb-2">
              Enter the verification code we sent to
            </p>

            {!location.state?.email && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-underline text-sage-900 mb-4"
                placeholder="your@gmail.com"
                required
              />
            )}

            {location.state?.email && (
              <p className="text-sage-900 font-medium text-sm mb-6">{email}</p>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleVerify}>
              <p className="text-sm font-medium text-sage-800 mb-4">Please Enter OTP</p>

              <OtpInput value={otp} onChange={setOtp} length={6} />

              <p className="text-center text-sky-500 font-mono text-lg my-6">{formatTime(timer)}</p>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className="flex-1 py-3 border border-sky-300 text-sky-600 rounded-xl font-medium hover:bg-sky-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 py-3 bg-gradient-to-l from-orange-300 to-pink-400 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>

            <Link
              to="/login"
              className="block text-center mt-6 text-sm text-gray-500 border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 transition-colors"
            >
              Login with another account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
