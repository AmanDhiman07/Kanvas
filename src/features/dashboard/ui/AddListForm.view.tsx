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
    <div className="w-72 bg-[#8D5F8C]/40 backdrop-blur-md rounded-lg p-3 border border-[#8D5F8C]/40 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          placeholder="Enter list title..."
          autoFocus
          className="w-full bg-white/80 border-[#8D5F8C]/40 text-[#6B3F69] placeholder:text-[#6B3F69]/60 focus-visible:ring-[#8D5F8C]"
        />
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#8D5F8C] hover:bg-[#8D5F8C]/80 text-white px-4 py-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add List'}
          </Button>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 hover:bg-[#8D5F8C]/20 rounded transition-colors"
          >
            <X className="w-5 h-5 text-[#6B3F69]" />
          </button>
        </div>
      </form>
    </div>
  );
}

