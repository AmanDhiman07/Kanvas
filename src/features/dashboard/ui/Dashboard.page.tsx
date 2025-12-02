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
    <div className="min-h-screen flex flex-col">
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
            <div className="w-72 flex-shrink-0 bg-white/40 backdrop-blur-2xl rounded-2xl p-4 border-2 border-white/40 shadow-lg">
              <p className="text-[var(--text-primary)] text-sm font-medium">Loading lists...</p>
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
            <div className="w-full p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/60 backdrop-blur-sm animate-fade-in">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-semibold">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleAddList}
            className="px-8 py-4 rounded-2xl font-semibold text-base text-white
                       bg-gradient-to-r from-[var(--primary-purple)] via-[var(--primary-magenta)] to-[var(--primary-rose)]
                       hover:shadow-[0_8px_24px_hsla(320,70%,60%,0.4)] hover:scale-105
                       transition-all duration-300
                       flex items-center gap-2 shadow-lg whitespace-nowrap flex-shrink-0
                       active:scale-100"
          >
            <Plus className="w-5 h-5" />
            <span>Add List</span>
          </button>
        </div>
      </main>
    </div>
  );
}

