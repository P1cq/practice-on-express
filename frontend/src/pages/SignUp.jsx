import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, googleLoginUrl } from '../api/auth';
import Header from '../components/Header';
import { signupSchema, validateWithZod } from '../validation/schemas';

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    gender: '0',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = validateWithZod(signupSchema, {
      ...form,
      gender: Number(form.gender),
    });
    if (errors) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await signUp({
        name: form.name,
        email: form.email,
        password: form.password,
        rePassword: form.rePassword,
        gender: Number(form.gender),
        role: 0,
      });
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.details?.[0]?.message ||
          'Registration failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 paper-grain">
        <div className="card-paper rounded-2xl p-8 md:p-10 shadow-xl shadow-black/5 w-full max-w-md">
          <p className="text-xs tracking-[0.18em] uppercase text-ochre-700 font-semibold text-center mb-3">
            Join sarihnaa
          </p>
          <h1 className="font-display text-2xl md:text-3xl text-ink-900 text-center">
            Create your account
          </h1>
          <p className="text-ink-500 text-center mt-2 mb-8 text-sm">
            A few details, then a place to send and receive honest notes.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-rose-700/10 border border-rose-700/20 rounded-xl text-rose-700 text-sm text-center">
              {error}
            </div>
          )}

          <a
            href={googleLoginUrl}
            className="w-full flex items-center justify-center gap-3 py-3 border border-paper-300 rounded-full font-medium text-ink-900 hover:bg-paper-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.998 11.998 0 0 0 12 24Z" />
              <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z" />
            </svg>
            Sign up with Google
          </a>
          <p className="text-center text-xs text-ink-400 mt-2.5">
            One click — no OTP, no separate login, straight into your inbox.
          </p>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-paper-300" />
            <span className="text-xs text-ink-400">or fill in the details</span>
            <div className="flex-1 h-px bg-paper-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your name"
                minLength={3}
                required
              />
              {fieldErrors.name && (
                <p className="text-xs text-rose-700 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@gmail.com"
                required
              />
              {fieldErrors.email && (
                <p className="text-xs text-rose-700 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Min 8 chars, upper, lower, digit, special"
                required
              />
              {fieldErrors.password && (
                <p className="text-xs text-rose-700 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                name="rePassword"
                value={form.rePassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Repeat password"
                required
              />
              {fieldErrors.rePassword && (
                <p className="text-xs text-rose-700 mt-1">{fieldErrors.rePassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm mt-2"
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-pine-800 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
