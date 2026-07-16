import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login, googleLoginUrl, signWithGoogle } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { loginSchema, validateWithZod } from '../validation/schemas';
import { loadGoogleIdentityScript } from '../utils/loadGoogleScript';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(
    searchParams.get('error') === 'google_auth_failed'
      ? 'Google sign-in failed. Please try again or use email/password.'
      : '',
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Google Identity Services "One Tap" — a passive prompt in the corner, not
  // a second competing button, so it coexists with the redirect-based
  // "Continue with Google" button above without cluttering the primary CTA.
  // Exercises the /auth/sign-with-google endpoint (idToken flow) as an
  // alternate path to the same login/signup outcome as the redirect flow.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          auto_select: false,
          callback: async (response) => {
            try {
              const { data } = await signWithGoogle(response.credential);
              loginUser(data.data.accesToken);
              navigate('/dashboard');
            } catch {
              setError('Google sign-in failed. Please try again or use email/password.');
            }
          },
        });
        window.google.accounts.id.prompt();
      })
      .catch(() => {
        /* One Tap is a bonus path; the redirect button below still works without it */
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors = validateWithZod(loginSchema, { email, password });
    if (errors) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const { data } = await login(email, password);
      loginUser(data.data.accesToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12 paper-grain">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div className="hidden lg:flex flex-col justify-center">
            <span className="font-display italic text-6xl text-pine-700 leading-none mb-4">“</span>
            <p className="font-display text-2xl text-ink-900 leading-snug max-w-sm text-balance">
              I never told her how much that conversation mattered. Sarihnaa is where I finally
              wrote it down.
            </p>
            <p className="mt-5 text-sm text-ink-500">— an anonymous note, sent last week</p>
          </div>

          <div className="card-paper rounded-2xl p-8 md:p-10 shadow-xl shadow-black/5">
            <div className="w-10 h-10 rounded-full bg-pine-800 flex items-center justify-center mx-auto mb-6">
              <span className="text-paper-50 font-display italic text-base">s</span>
            </div>

            <h1 className="font-display text-2xl md:text-3xl text-ink-900 text-center">
              Welcome back
            </h1>
            <p className="text-ink-500 text-center mt-2 mb-8 text-sm">
              Your inbox has been waiting.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-rose-700/10 border border-rose-700/20 rounded-xl text-rose-700 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@gmail.com"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs text-rose-700 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-rose-700 mt-1">{fieldErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-paper-300" />
              <span className="text-xs text-ink-400">or</span>
              <div className="flex-1 h-px bg-paper-300" />
            </div>

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
              Continue with Google
            </a>

            <p className="text-center text-sm text-ink-500 mt-8">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-pine-800 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
