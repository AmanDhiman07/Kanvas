import { User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-[#DDC3C3] border-b border-[#8D5F8C]/20">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-[#6B3F69]" style={{ fontFamily: "'Dancing Script', cursive" }}>
          Kanvas
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#6B3F69] hover:bg-[#8D5F8C]/20 transition-colors">
          <User className="w-5 h-5" />
          <span>Login</span>
        </button>
      </div>
    </nav>
  );
}

