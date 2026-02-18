import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { navigate } = useRouter();
  const { login, register, isAuthenticated } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return false;
    }

    if (!isLoginMode) {
      if (!formData.name) {
        setError('Please enter your name.');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      let result;

      if (isLoginMode) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-850 pt-20">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="heading-xl text-white mb-4">
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            {isLoginMode
              ? 'Sign in to access your dashboard and manage your tours.'
              : 'Join our community of travelers and tour operators.'}
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-10 border border-slate-100 dark:border-slate-700 shadow-lg">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
                <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Register only) */}
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sand-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sand-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sand-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Register only) */}
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-750 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sand-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-sand-500 hover:bg-sand-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLoginMode ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-sand-600 dark:text-sand-400 font-bold hover:underline"
                >
                  {isLoginMode ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            {isLoginMode && (
              <div className="mt-8 p-4 bg-sand-50 dark:bg-sand-500/10 rounded-xl border border-sand-200 dark:border-sand-500/20">
                <p className="text-xs font-bold text-sand-700 dark:text-sand-300 mb-2 uppercase tracking-wider">
                  Demo Credentials
                </p>
                <div className="space-y-1 text-xs text-sand-600 dark:text-sand-400">
                  <p><strong>Admin:</strong> admin@kazakhstantours.com / admin123</p>
                  <p><strong>Operator:</strong> operator@nomadexpeditions.kz / operator123</p>
                  <p><strong>User:</strong> user@example.com / user123</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
