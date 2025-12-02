import { useState } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface AddListFormProps {
  onAdd: (title: string) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

export function AddListForm({ onAdd, onCancel, loading = false }: AddListFormProps) {
  const [listTitle, setListTitle] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (listTitle.trim() && !loading) {
      const success = await onAdd(listTitle.trim());
      if (success) {
        setListTitle('');
      }
    }
  };

  const handleCancel = () => {
    setListTitle('');
    onCancel();
  };

  return (
    <div className="w-72 flex-shrink-0 bg-white/40 backdrop-blur-2xl rounded-2xl p-4 border-2 border-white/40 shadow-lg animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          placeholder="Enter list title..."
          autoFocus
        />
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={loading}
            size="sm"
          >
            {loading ? 'Adding...' : 'Add List'}
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 hover:bg-[var(--primary-purple)]/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-primary)]" />
          </button>
        </div>
      </form>
    </div>
  );
}

