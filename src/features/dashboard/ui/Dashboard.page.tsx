import { useState } from 'react';
import { Navbar } from '../../../components/shared/Navbar.view';
import { Plus } from 'lucide-react';
import { AddListForm } from './AddListForm.view';
import { ListCard } from './ListCard.view';
import { useList } from '../hooks/useList';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { Card } from '../infrastructure/api/list.types';

export default function DashboardPage() {
  const [isAddingList, setIsAddingList] = useState(false);
  const { lists, setLists, loading, creating, error, createList, fetchLists } = useList();
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to activate drag
      },
    })
  );

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
    try {
      // Optimistically update the UI immediately
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  card: cardTitle,
                  _id: `temp-${Date.now()}-${Math.random()}`, // Temporary ID until server confirms
                  createdAt: new Date().toISOString(),
                },
              ],
            }
            : list
        )
      );

      // Save to server in the background
      const { cardClient } = await import('../infrastructure/api/card.client');
      await cardClient.addCard(listId, cardTitle);

      // TODO: Uncomment this once backend properly persists card/list positions
      // This will replace the temp ID with the real server ID
      // fetchLists();

      return true;
    } catch (error) {
      console.error('Failed to add card:', error);
      // Revert the optimistic update on error
      await fetchLists();
      return false;
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'card') {
      setActiveCard(activeData.card);
    }
  };

  const handleDragOver = () => {
    // Only used for visual feedback, no state changes here
    // The actual move happens in handleDragEnd
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle list reordering
    if (activeData?.type === 'list' && active.id !== over.id) {
      const oldIndex = lists.findIndex((list) => list.id === active.id);
      const newIndex = lists.findIndex((list) => list.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      // Update UI immediately
      const newLists = arrayMove(lists, oldIndex, newIndex);
      setLists(newLists);

      // Save to backend
      try {
        const { listClient } = await import('../infrastructure/api/list.client');
        await listClient.moveList({
          listId: active.id as string,
          newPosition: newIndex,
        });
        console.log('✅ List moved and saved to backend');
      } catch (error) {
        console.error('❌ Failed to save list position:', error);
        // Don't revert UI - keep the change visible
      }
      return;
    }

    // Handle card movement
    if (activeData?.type === 'card') {
      const fromListId = activeData.listId;
      let toListId = fromListId;

      // Determine target list
      if (overData?.type === 'list') {
        toListId = over.id as string;
      } else if (overData?.type === 'card') {
        toListId = overData.listId;
      }

      console.log('🔄 Drag End Debug:', {
        cardId: active.id,
        fromListId,
        toListId,
        isDifferentList: fromListId !== toListId,
        overType: overData?.type
      });

      // If moving between different lists
      if (fromListId !== toListId) {
        let newPosition = 0; // Default to top if not specified

        // Update UI immediately
        setLists((prevLists) => {
          const sourceList = prevLists.find((list) => list.id === fromListId);
          const targetList = prevLists.find((list) => list.id === toListId);

          if (!sourceList || !targetList) return prevLists;

          const cardToMove = sourceList.cards.find((c) => c._id === active.id);
          if (!cardToMove) return prevLists;

          return prevLists.map((list) => {
            if (list.id === fromListId) {
              return {
                ...list,
                cards: list.cards.filter((c) => c._id !== active.id),
              };
            } else if (list.id === toListId) {
              // If dropping on a specific card, insert at that position
              if (overData?.type === 'card') {
                const targetIndex = list.cards.findIndex((c) => c._id === over.id);
                newPosition = targetIndex; // Capture position for API
                const newCards = [...list.cards];
                newCards.splice(targetIndex, 0, cardToMove);
                return { ...list, cards: newCards };
              }
              // Otherwise, append to the end
              newPosition = list.cards.length; // Capture position for API
              return {
                ...list,
                cards: [...list.cards, cardToMove],
              };
            }
            return list;
          });
        });

        console.log('✅ Card moved in UI. Sending to backend...', {
          cardId: active.id,
          fromListId,
          toListId,
          newPosition
        });

        // Save to backend
        try {
          const { cardClient } = await import('../infrastructure/api/card.client');
          await cardClient.moveCard({
            cardId: active.id as string,
            fromListId,
            toListId,
            newPosition, // Send the new position!
          });
          console.log('✅ Card moved and saved to backend');
        } catch (error) {
          console.error('❌ Failed to save card position:', error);
          // Don't revert UI - keep the change visible
          // await fetchLists(); // Keep this commented out
        }
      } else if (overData?.type === 'card') {
        // Reordering within the same list
        const sourceList = lists.find((list) => list.id === fromListId);
        if (!sourceList) return;

        const oldIndex = sourceList.cards.findIndex((c) => c._id === active.id);
        const newIndex = sourceList.cards.findIndex((c) => c._id === over.id);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        // Optimistically update UI
        setLists((prevLists) =>
          prevLists.map((list) => {
            if (list.id === fromListId) {
              return {
                ...list,
                cards: arrayMove(list.cards, oldIndex, newIndex),
              };
            }
            return list;
          })
        );

        console.log('✅ Card reordered in UI. Sending to backend...', {
          cardId: active.id,
          listId: fromListId,
          newPosition: newIndex
        });

        // Save to backend
        try {
          const { cardClient } = await import('../infrastructure/api/card.client');
          await cardClient.moveCard({
            cardId: active.id as string,
            fromListId: fromListId,
            toListId: fromListId, // Same list
            newPosition: newIndex, // Send the new index!
          });
          console.log('✅ Card reorder saved to backend');
        } catch (error) {
          console.error('❌ Failed to save card reorder:', error);
          // Don't revert UI
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-8 overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarGutter: 'stable' }}>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex items-start gap-4 pb-4 min-w-max">
            <SortableContext items={lists.map((list) => list.id)} strategy={horizontalListSortingStrategy}>
              {/* Display created lists with their cards */}
              {lists.map((list) => (
                <ListCard
                  key={list.id}
                  listId={list.id}
                  listTitle={list.title}
                  cards={list.cards}
                  onAddCard={handleAddCard}
                />
              ))}
            </SortableContext>

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

          <DragOverlay>
            {activeCard && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border-2 border-purple-400 shadow-2xl rotate-3 cursor-grabbing">
                <p className="text-[var(--text-primary)] text-sm font-medium">{activeCard.card}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}

