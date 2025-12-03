import { User, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

export function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between backdrop-blur-2xl bg-white/30 border-b-2 border-white/40 shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <h1
          className="text-4xl font-bold gradient-text animate-fade-in"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Kanvas
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
}


