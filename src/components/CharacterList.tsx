import { useState } from 'react';
import { Plus, User } from 'lucide-react';
import { useCharacterStore } from '../store/characterStore';
import { CreateCharacterModal } from './CreateCharacterModal';

export function CharacterList() {
  const { characters, currentCharacter, setCurrentCharacter, isLoading } = useCharacterStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Characters</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          title="Create new character"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <CreateCharacterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {isLoading && (
        <div className="text-center text-slate-400 py-8">Loading...</div>
      )}

      {!isLoading && characters.length === 0 && (
        <div className="text-center text-slate-500 py-8">
          <p>No characters yet</p>
          <p className="text-sm mt-2">Create your first character!</p>
        </div>
      )}

      <div className="space-y-2">
        {characters.map((character) => (
          <button
            key={character.id}
            onClick={() => setCurrentCharacter(character)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              currentCharacter?.id === character.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{character.name}</div>
                <div className="text-sm opacity-80 truncate">
                  Level {character.level} {character.class}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
