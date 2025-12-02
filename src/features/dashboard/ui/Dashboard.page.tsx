import { useState } from 'react';
import { Navbar } from '../../../components/shared/Navbar.view';
import { Plus } from 'lucide-react';
import { AddListForm } from './AddListForm.view';
import { ListCard } from './ListCard.view';
import { useList } from '../hooks/useList';

interface Card {
  id: string;
  title: string;
  listId: string;
}

export default function DashboardPage() {
  const [isAddingList, setIsAddingList] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const { lists, loading, creating, error, createList } = useList();

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

  const handleAddCard = async (listId: string, cardTitle: string): Promise<boolean> => {
    // TODO: Implement card creation API call
    // For now, add card to local state
    const newCard: Card = {
      id: `${Date.now()}-${Math.random()}`,
      title: cardTitle,
      listId,
    };
    setCards((prev) => [...prev, newCard]);
    return true;
  };

  return (
    <div className="min-h-screen bg-[#DDC3C3] flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-8 overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarGutter: 'stable' }}>
        <div className="flex items-start gap-4 pb-4 min-w-max">
          {/* Display created lists */}
          {lists.map((list) => {
            const listCards = cards.filter((card) => card.listId === list.id);
            return (
              <ListCard
                key={list.id}
                listId={list.id}
                listTitle={list.title}
                cards={listCards}
                onAddCard={handleAddCard}
              />
            );
          })}
          
          {loading && lists.length === 0 && (
            <div className="w-72 flex-shrink-0 bg-[#8D5F8C]/40 backdrop-blur-md rounded-lg p-4 border border-[#8D5F8C]/40 shadow-lg">
              <p className="text-[#6B3F69] text-sm">Loading lists...</p>
            </div>
          )}
          
          {isAddingList && (
            <AddListForm 
              onAdd={handleListAdded} 
              onCancel={handleCancel}
              loading={creating}
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
                       flex items-center gap-2 shadow-lg whitespace-nowrap flex-shrink-0"
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

