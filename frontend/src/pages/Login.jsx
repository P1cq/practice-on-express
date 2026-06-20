import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await login(email, password);
      loginUser(data.data, data.data._id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen auth-gradient flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-sage-800">
              <div className="absolute inset-0 bg-gradient-to-t from-sage-950/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex -space-x-3 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-sage-600 border-2 border-sage-800"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-sage-100 mr-2">5.0 from 350+ reviews</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-sage-900 flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-display text-sm">s</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-sage-900 text-center">
              Welcome back
            </h1>
            <p className="text-gray-500 text-center mt-2 mb-8">
              Please enter your details
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-underline text-sage-900"
                  placeholder="you@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-underline text-sage-900 pr-8"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Remember me
                </label>
                <span className="text-sage-900 font-medium cursor-pointer">Forgot password?</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-sage-900 text-white rounded-full font-semibold hover:bg-sage-950 transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-sage-900 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
