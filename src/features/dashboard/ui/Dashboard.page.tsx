import { Navbar } from '../../../components/shared/Navbar.view';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#DDC3C3]">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <button
            className="px-8 py-4 rounded-xl text-[#6B3F69] font-medium text-lg
                       bg-[#8D5F8C]/30 backdrop-blur-md border border-[#8D5F8C]/40
                       hover:bg-[#8D5F8C]/40 transition-all duration-300
                       flex items-center gap-2 shadow-lg"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            <Plus className="w-5 h-5" />
            <span>Add List</span>
          </button>
        </div>
      </main>
    </div>
  );
}

