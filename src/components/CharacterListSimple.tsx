import { useState, useEffect } from 'react';
import { Plus, X, User } from 'lucide-react';
import { getDatabase } from '../lib/database';

interface SimpleCharacter {
  id: string;
  name: string;
  class: string;
  level: number;
}

interface CharacterListSimpleProps {
  onSelectCharacter: (character: any) => void;
  selectedId?: string;
}

export function CharacterListSimple({ onSelectCharacter, selectedId }: CharacterListSimpleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [charClass, setCharClass] = useState('');
  const [race, setRace] = useState('');
  const [level, setLevel] = useState(1);
  const [str, setStr] = useState(10);
  const [dex, setDex] = useState(10);
  const [con, setCon] = useState(10);
  const [int, setInt] = useState(10);
  const [wis, setWis] = useState(10);
  const [cha, setCha] = useState(10);
  const [hp, setHp] = useState(10);
  const [ac, setAc] = useState(10);
  const [speed, setSpeed] = useState(30);
  const [characters, setCharacters] = useState<SimpleCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate proficiency bonus based on level
  const profBonus = 2 + Math.floor((level - 1) / 4);
  // Calculate initiative (DEX modifier)
  const getModifier = (score: number) => Math.floor((score - 10) / 2);
  const initiative = getModifier(dex);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const db = await getDatabase();
      const result = await db.select<SimpleCharacter[]>('SELECT id, name, class, level FROM characters ORDER BY created_at DESC');
      console.log('Loaded characters:', result);
      setCharacters(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load characters:', error);
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Creating character:', { name, charClass, race });

    try {
      const db = await getDatabase();
      console.log('Got database');

      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      console.log('Executing insert...');
      const result = await db.execute(
        `INSERT INTO characters (
          id, name, class, level, race, background,
          strength, dexterity, constitution, intelligence, wisdom, charisma,
          proficiency_bonus, hit_points_current, hit_points_max, hit_points_temporary,
          armor_class, initiative, speed, experience_points,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, name, charClass, level, race, 'Background',
          str, dex, con, int, wis, cha,
          profBonus, hp, hp, 0,
          ac, initiative, speed, 0,
          now, now
        ]
      );

      console.log('Insert result:', result);
      alert('Character created successfully!');

      // Reload characters and close modal
      await loadCharacters();
      setIsModalOpen(false);
      // Reset form
      setName('');
      setCharClass('');
      setRace('');
      setLevel(1);
      setStr(10);
      setDex(10);
      setCon(10);
      setInt(10);
      setWis(10);
      setCha(10);
      setHp(10);
      setAc(10);
      setSpeed(30);
    } catch (error) {
      console.error('Failed to create character:', error);
      alert('Error creating character: ' + (error instanceof Error ? error.message : JSON.stringify(error)));
    }
  };

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold">Create New Character</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-300">Basic Information</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Class *</label>
                    <input
                      type="text"
                      value={charClass}
                      onChange={(e) => setCharClass(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Level *</label>
                    <input
                      type="number"
                      value={level}
                      onChange={(e) => setLevel(Number(e.target.value))}
                      min="1"
                      max="20"
                      required
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Race *</label>
                  <input
                    type="text"
                    value={race}
                    onChange={(e) => setRace(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                  />
                </div>
              </div>

              {/* Ability Scores */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-300">Ability Scores</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">STR</label>
                    <input
                      type="number"
                      value={str}
                      onChange={(e) => setStr(Number(e.target.value))}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">DEX</label>
                    <input
                      type="number"
                      value={dex}
                      onChange={(e) => setDex(Number(e.target.value))}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">CON</label>
                    <input
                      type="number"
                      value={con}
                      onChange={(e) => setCon(Number(e.target.value))}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">INT</label>
                    <input
                      type="number"
                      value={int}
                      onChange={(e) => setInt(Number(e.target.value))}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">WIS</label>
                    <input
                      type="number"
                      value={wis}
                      onChange={(e) => setWis(Number(e.target.value))}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">CHA</label>
                    <input
                      type="number"
                      value={cha}
                      onChange={(e) => setCha(Number(e.target.value))}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Core Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-300">Core Stats</h3>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Max HP</label>
                    <input
                      type="number"
                      value={hp}
                      onChange={(e) => setHp(Number(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">AC</label>
                    <input
                      type="number"
                      value={ac}
                      onChange={(e) => setAc(Number(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Speed</label>
                    <input
                      type="number"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                    />
                  </div>
                </div>

                {/* Auto-calculated stats */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <h4 className="text-sm font-medium text-slate-400 mb-2">Auto-Calculated</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Proficiency Bonus:</span>
                      <span className="font-medium text-blue-400">+{profBonus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Initiative:</span>
                      <span className="font-medium text-blue-400">
                        {initiative >= 0 ? '+' : ''}{initiative}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  Create Character
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-slate-400 py-8">Loading...</div>
      )}

      {!isLoading && characters.length === 0 && (
        <div className="text-center text-slate-500 py-8">
          <p>No characters yet</p>
          <p className="text-sm mt-2">Create your first character!</p>
        </div>
      )}

      {!isLoading && characters.length > 0 && (
        <div className="space-y-2">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={async () => {
                const db = await getDatabase();
                const result = await db.select('SELECT * FROM characters WHERE id = ?', [character.id]);
                if (result.length > 0) {
                  onSelectCharacter(result[0]);
                }
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedId === character.id
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
      )}
    </div>
  );
}
