import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { AddCardForm } from './AddCardForm.view';

interface Card {
  id: string;
  title: string;
}

interface ListCardProps {
  listId: string;
  listTitle: string;
  cards: Card[];
  onAddCard: (listId: string, cardTitle: string) => Promise<boolean>;
}

export function ListCard({ listId, listTitle, cards, onAddCard }: ListCardProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [addingCardLoading, setAddingCardLoading] = useState(false);

  const handleAddCard = async (title: string): Promise<boolean> => {
    setAddingCardLoading(true);
    try {
      const success = await onAddCard(listId, title);
      if (success) {
        setIsAddingCard(false);
      }
      return success;
    } finally {
      setAddingCardLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAddingCard(false);
  };

  return (
    <Card className="w-72 flex-shrink-0 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-[var(--text-primary)] font-bold text-lg">
          {listTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Display cards */}
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border-2 border-white/60 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          >
            <p className="text-[var(--text-primary)] text-sm font-medium">{card.title}</p>
          </div>
        ))}

        {/* Add Card Form */}
        {isAddingCard && (
          <AddCardForm
            onAdd={handleAddCard}
            onCancel={handleCancel}
            loading={addingCardLoading}
          />
        )}

        {/* Add Card Button */}
        {!isAddingCard && (
          <Button
            onClick={() => setIsAddingCard(true)}
            variant="ghost"
            className="w-full justify-start text-[var(--primary-purple)] hover:bg-[var(--primary-purple)]/10 hover:text-[var(--primary-magenta)] transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add a card
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

