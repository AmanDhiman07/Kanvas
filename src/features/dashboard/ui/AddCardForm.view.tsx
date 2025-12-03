import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface AddCardFormProps {
  onAdd: (title: string) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

export function AddCardForm({ onAdd, onCancel, loading = false }: AddCardFormProps) {
  const [cardTitle, setCardTitle] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cardTitle.trim() && !loading) {
      const success = await onAdd(cardTitle.trim());
      if (success) {
        setCardTitle('');
      }
    }
  };

  const handleCancel = () => {
    setCardTitle('');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="text"
        value={cardTitle}
        onChange={(e) => setCardTitle(e.target.value)}
        placeholder="Enter card title..."
        autoFocus
      />
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          disabled={loading}
          size="sm"
        >
          {loading ? 'Adding...' : 'Add Card'}
        </Button>
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 hover:bg-[var(--primary-purple)]/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-[var(--text-primary)]" />
        </button>
      </div>
    </form>
  );
}

