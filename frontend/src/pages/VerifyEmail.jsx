import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { verifyEmail, resendOtp } from '../api/auth';
import OtpInput from '../components/OtpInput';
import Header from '../components/Header';
import { otpSchema, emailSchema, validateWithZod } from '../validation/schemas';

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
    setError('');

    const errors = validateWithZod(otpSchema, otp) || (!emailSchema.safeParse(email).success ? { email: 'invalid' } : null);
    if (errors) {
      setError(errors.email ? 'Please enter a valid email' : 'Please enter the full 6-digit code');
      return;
    }

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
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 paper-grain">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden shadow-xl shadow-black/5">
          <div className="hidden lg:flex lg:col-span-2 pine-panel flex-col items-center justify-center p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-pine-700 border border-pine-500/40 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-paper-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
              </svg>
            </div>
            <h2 className="font-display italic text-2xl text-paper-50">Almost there</h2>
            <p className="text-pine-200 text-sm mt-4 max-w-[22ch] leading-relaxed">
              One code confirms the address, so your notes always find their way home.
            </p>
          </div>

          <div className="lg:col-span-3 card-paper p-8 md:p-10">
            <Link
              to="/signup"
              className="text-sm text-ink-500 hover:text-pine-800 flex items-center gap-1 mb-6"
            >
              <span>&lt;</span> Go back and edit
            </Link>

            <h1 className="font-display text-2xl text-ink-900">Verify your email</h1>
            <p className="text-ink-500 text-sm mt-2 mb-2">
              Enter the verification code we sent to
            </p>

            {!location.state?.email && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mb-4"
                placeholder="your@gmail.com"
                required
              />
            )}

            {location.state?.email && (
              <p className="text-ink-900 font-medium text-sm mb-6">{email}</p>
            )}

            {error && (
              <div className="mb-4 p-3 bg-rose-700/10 border border-rose-700/20 rounded-xl text-rose-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-pine-100 border border-pine-200 rounded-xl text-pine-800 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleVerify}>
              <p className="text-sm font-medium text-ink-700 mb-4">Please enter the code</p>

              <OtpInput value={otp} onChange={setOtp} length={6} />

              <p className="text-center text-ochre-700 font-display text-lg my-6">{formatTime(timer)}</p>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className="flex-1 py-3 border border-pine-700 text-pine-800 rounded-xl font-medium hover:bg-pine-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer disabled:cursor-not-allowed"
                >
                  Resend code
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-primary flex-1 py-3 text-sm rounded-xl"
                >
                  {loading ? 'Verifying...' : 'Verify code'}
                </button>
              </div>
            </form>

            <Link
              to="/login"
              className="block text-center mt-6 text-sm text-ink-500 border border-paper-300 rounded-xl py-2.5 hover:bg-paper-100 transition-colors"
            >
              Login with another account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
