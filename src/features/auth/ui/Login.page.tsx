import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden px-4">
      {/* Animated Gradient Background with Floating Orbs */}
      <div className="absolute inset-0 -z-10">
        {/* Floating Decorative Orbs */}
        <div
          className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-40 blur-3xl animate-[float_8s_ease-in-out_infinite]"
          style={{
            background: 'radial-gradient(circle, hsl(290, 70%, 65%) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-40 blur-3xl animate-[float_10s_ease-in-out_infinite_2s]"
          style={{
            background: 'radial-gradient(circle, hsl(340, 70%, 65%) 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl animate-[float_12s_ease-in-out_infinite_4s]"
          style={{
            background: 'radial-gradient(circle, hsl(320, 70%, 60%) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md relative animate-fade-in">
        {/* Brand Title */}
        <div className="text-center mb-8 animate-slide-in">
          <h1
            className="text-6xl font-bold mb-2 gradient-text"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Kanvas
          </h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium">
            Welcome back! Sign in to continue
          </p>
        </div>

        {/* Glassmorphism Login Card */}
        <div
          className="relative bg-white/40 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_hsla(280,40%,25%,0.12)] border border-white/50"
          style={{
            animationDelay: '0.2s',
            opacity: 0,
          }}
        >
          {/* Card Glow Effect */}
          <div
            className="absolute -inset-0.5 bg-gradient-to-r from-[var(--primary-purple)] via-[var(--primary-magenta)] to-[var(--primary-rose)] rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30 -z-10"
          />

          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 text-center">
            Sign In
          </h2>

          {/* Demo Credentials Hint */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200/40 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-xs font-semibold text-purple-800 mb-1">Demo Credentials</p>
                <div className="space-y-1">
                  <p className="text-xs text-purple-700">
                    <span className="font-medium">Email:</span> user@123 or user@you.com
                  </p>
                  <p className="text-xs text-purple-700">
                    <span className="font-medium">Password:</span> 12345
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[var(--text-primary)]"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="transition-all duration-300"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[var(--text-primary)]"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="transition-all duration-300"
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 backdrop-blur-sm animate-fade-in">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-semibold">{error.message}</p>
                    {error.status && (
                      <p className="text-xs text-red-600 mt-1">Error Code: {error.status}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-6 group relative overflow-hidden"
              size="lg"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </span>
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-[var(--primary-purple)] hover:text-[var(--primary-magenta)] font-medium transition-colors duration-300 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <a
              href="#"
              className="font-semibold text-[var(--primary-purple)] hover:text-[var(--primary-magenta)] transition-colors duration-300 hover:underline"
            >
              Sign up for free
            </a>
          </p>
        </div>
      </div>

      {/* Add animation for the card */}
      <style>{`
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .relative.bg-white\\/40 {
          animation: cardFadeIn 0.6s ease-out 0.2s forwards;
        }
      `}</style>
    </div>
  );
}


