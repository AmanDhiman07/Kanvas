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
    <div className="min-h-screen bg-[#DDC3C3] flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <h1 
          className="text-4xl font-bold text-[#6B3F69] mb-8 text-center" 
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Kanvas
        </h1>
        <div className="bg-[#8D5F8C]/20 backdrop-blur-md rounded-xl p-8 border border-[#8D5F8C]/40">
          <h2 className="text-2xl font-semibold text-[#6B3F69] mb-6 text-center">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#6B3F69] mb-2">
                Email
              </label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/50 border-[#8D5F8C]/40 text-[#6B3F69] placeholder:text-[#6B3F69]/60 focus-visible:ring-[#8D5F8C]"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#6B3F69] mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/50 border-[#8D5F8C]/40 text-[#6B3F69] placeholder:text-[#6B3F69]/60 focus-visible:ring-[#8D5F8C]"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-100/50 border border-red-300/40">
                <p className="text-sm text-red-700 font-medium">Error: {error.message}</p>
                {error.status && (
                  <p className="text-xs text-red-600 mt-1">Status: {error.status}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8D5F8C]/40 hover:bg-[#8D5F8C]/60 text-[#6B3F69] font-medium backdrop-blur-sm border border-[#8D5F8C]/40 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

