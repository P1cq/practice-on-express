import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth';
import Header from '../components/Header';

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    gender: '0',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.rePassword) {
      setError('Passwords do not match');
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
    <div className="min-h-screen auth-gradient flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-sage-900 text-center">
            Create Account
          </h1>
          <p className="text-gray-500 text-center mt-2 mb-8">
            Join sarihnaa and start receiving honest messages
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-underline text-sage-900"
                placeholder="Your name"
                minLength={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-underline text-sage-900"
                placeholder="you@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full py-2 border-b border-gray-300 bg-transparent text-sage-900 outline-none"
              >
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input-underline text-sage-900"
                placeholder="Min 8 chars, upper, lower, digit, special"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="rePassword"
                value={form.rePassword}
                onChange={handleChange}
                className="input-underline text-sage-900"
                placeholder="Repeat password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-sage-900 text-white rounded-full font-semibold hover:bg-sage-950 transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-sage-900 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
