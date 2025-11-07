import { useState } from 'react';
import { Navbar } from '../../../components/shared/Navbar.view';
import { Plus } from 'lucide-react';
import { AddListForm } from './AddListForm.view';
import { useList } from '../hooks/useList';

export default function DashboardPage() {
  const [isAddingList, setIsAddingList] = useState(false);
  const { lists, loading, error, createList } = useList();

  const handleAddList = () => {
    setIsAddingList(true);
  };

  const handleCancel = () => {
    setIsAddingList(false);
  };

  const handleListAdded = async (title: string): Promise<boolean> => {
    const success = await createList({ title });
    if (success) {
      setIsAddingList(false);
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-[#DDC3C3]">
      <Navbar />
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-start gap-4 flex-wrap">
          {/* Display created lists */}
          {lists.map((list, index) => (
            <div
              key={index}
              className="w-72 bg-[#8D5F8C]/40 backdrop-blur-md rounded-lg p-4 border border-[#8D5F8C]/40 shadow-lg"
            >
              <h3 className="text-[#6B3F69] font-semibold text-lg">{list.title}</h3>
            </div>
          ))}
          
          {isAddingList && (
            <AddListForm 
              onAdd={handleListAdded} 
              onCancel={handleCancel}
              loading={loading}
            />
          )}
          
          {error && (
            <div className="w-full p-3 rounded-md bg-red-100/50 border border-red-300/40">
              <p className="text-sm text-red-700">Error: {error.message}</p>
            </div>
          )}
          
          <button
            onClick={handleAddList}
            className="px-8 py-4 rounded-xl text-[#6B3F69] font-medium text-lg
                       bg-[#8D5F8C]/30 backdrop-blur-md border border-[#8D5F8C]/40
                       hover:bg-[#8D5F8C]/40 transition-all duration-300
                       flex items-center gap-2 shadow-lg whitespace-nowrap"
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

