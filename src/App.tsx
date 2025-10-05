import { useEffect, useState } from 'react';
import { initDatabase } from './lib/database';
import { CharacterListSimple } from './components/CharacterListSimple';
import { SkillsDisplay } from './components/SkillsDisplay';
import { Trash2, Shield, Zap, Footprints, Award, Swords, Sparkles, Star, Backpack, Menu, Scroll } from 'lucide-react';

interface FullCharacter {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiency_bonus: number;
  hit_points_current: number;
  hit_points_max: number;
  hit_points_temporary: number;
  armor_class: number;
  speed: number;
}

interface Skill {
  id: string;
  character_id: string;
  name: string;
  attribute: string;
  proficient: number;
  expertise: number;
  bonus: number;
  is_custom: number;
}

// Type for the active tab in the character sheet
type CharacterTab = 'skills' | 'actions' | 'spells' | 'features' | 'traits' | 'inventory';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<FullCharacter | null>(null);
  const [characterSkills, setCharacterSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState<CharacterTab>('skills');
  const [hpChangeAmount, setHpChangeAmount] = useState<string>('');
  const [tempHpChangeAmount, setTempHpChangeAmount] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState(false);

  const updateHP = async (newHP: number) => {
    if (!selectedCharacter) return;

    try {
      const db = await initDatabase();
      await db.execute(
        'UPDATE characters SET hit_points_current = ?, updated_at = ? WHERE id = ?',
        [newHP, new Date().toISOString(), selectedCharacter.id]
      );

      // Update local state
      setSelectedCharacter({ ...selectedCharacter, hit_points_current: newHP });
    } catch (error) {
      console.error('Failed to update HP:', error);
      alert('Failed to update HP');
    }
  };

  const updateTempHP = async (newTempHP: number) => {
    if (!selectedCharacter) return;

    try {
      const db = await initDatabase();
      await db.execute(
        'UPDATE characters SET hit_points_temporary = ?, updated_at = ? WHERE id = ?',
        [newTempHP, new Date().toISOString(), selectedCharacter.id]
      );

      // Update local state
      setSelectedCharacter({ ...selectedCharacter, hit_points_temporary: newTempHP });
    } catch (error) {
      console.error('Failed to update Temp HP:', error);
      alert('Failed to update Temp HP');
    }
  };

  const deleteCharacter = async () => {
    if (!selectedCharacter) return;

    const confirmed = confirm(`Delete ${selectedCharacter.name}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      const db = await initDatabase();
      await db.execute('DELETE FROM characters WHERE id = ?', [selectedCharacter.id]);

      setSelectedCharacter(null);
      setCharacterSkills([]);
      // Reload the page to refresh the character list
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete character:', error);
      alert('Failed to delete character');
    }
  };

  /**
   * Loads skills for the selected character from the database
   * Called when a character is selected or when skills are updated
   */
  const loadCharacterSkills = async (characterId: string) => {
    try {
      const db = await initDatabase();
      const skills = await db.select<Skill[]>(
        'SELECT * FROM skills WHERE character_id = ? ORDER BY name ASC',
        [characterId]
      );
      setCharacterSkills(skills);
    } catch (error) {
      console.error('Failed to load skills:', error);
      setCharacterSkills([]);
    }
  };

  /**
   * Handles character selection and loads associated skills
   */
  const handleSelectCharacter = async (character: FullCharacter) => {
    setSelectedCharacter(character);
    await loadCharacterSkills(character.id);
  };

  /**
   * Reloads the current character's skills
   * Called when skills are toggled or new skills are added
   */
  const handleSkillsUpdate = async () => {
    if (selectedCharacter) {
      await loadCharacterSkills(selectedCharacter.id);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing database...');
        await initDatabase();
        console.log('App initialized successfully');
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        const errorMessage = error instanceof Error
          ? `${error.message}\n\nStack: ${error.stack}`
          : `Unknown error: ${JSON.stringify(error)}`;
        setInitError(errorMessage);
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Loading...</div>
          <div className="text-slate-400">Initializing database</div>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-2xl">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Initialization Error</h1>
          <p className="text-slate-300 mb-2">Failed to initialize the database:</p>
          <pre className="bg-slate-800 p-4 rounded overflow-auto text-sm text-red-300">
            {initError}
          </pre>
        </div>
      </div>
    );
  }

  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="flex h-screen">
        {/* Sidebar - Character List (toggleable when character is selected) */}
        {(!selectedCharacter || showSidebar) && (
          <aside className="w-80 border-r border-slate-700 bg-slate-800 overflow-y-auto">
            <CharacterListSimple onSelectCharacter={handleSelectCharacter} selectedId={selectedCharacter?.id} />
          </aside>
        )}

        {/* Main Content - Character Sheet */}
        <main className="flex-1 overflow-y-auto">
          {selectedCharacter ? (
            <div className="p-6 max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-4 pb-4 border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowSidebar(!showSidebar)}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      title={showSidebar ? "Hide Character List" : "Show Character List"}
                    >
                      <Menu className="w-5 h-5" />
                    </button>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{selectedCharacter.name}</h1>
                      <div className="flex gap-4 text-slate-400">
                        <span>Level {selectedCharacter.level} {selectedCharacter.class}</span>
                        <span>•</span>
                        <span>{selectedCharacter.race}</span>
                        <span>•</span>
                        <span>{selectedCharacter.background}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-stretch gap-2">
                    {/* Core Stats */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 flex flex-col items-center justify-center w-20">
                      <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                        <Shield className="w-3 h-3" />
                        <span>AC</span>
                      </div>
                      <div className="text-lg font-bold">{selectedCharacter.armor_class}</div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 flex flex-col items-center justify-center w-20">
                      <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                        <Zap className="w-3 h-3" />
                        <span>Init</span>
                      </div>
                      <div className="text-lg font-bold">{getModifier(selectedCharacter.dexterity)}</div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 flex flex-col items-center justify-center w-20">
                      <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                        <Footprints className="w-3 h-3" />
                        <span>Speed</span>
                      </div>
                      <div className="text-lg font-bold flex items-baseline gap-1">
                        {selectedCharacter.speed}
                        <span className="text-xs text-slate-500">ft</span>
                      </div>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 flex flex-col items-center justify-center w-20">
                      <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                        <Award className="w-3 h-3" />
                        <span>Prof</span>
                      </div>
                      <div className="text-lg font-bold">+{selectedCharacter.proficiency_bonus}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* HP and [Future Content] Row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Hit Points - Half Width */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-400">HP</div>
                      <div className="text-2xl font-bold">
                        {selectedCharacter.hit_points_current} / {selectedCharacter.hit_points_max}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={hpChangeAmount}
                        onChange={(e) => setHpChangeAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-24 px-3 bg-slate-900 border border-slate-600 rounded text-sm text-center focus:outline-none focus:border-blue-500 h-[72px]"
                        min="0"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            const amount = parseInt(hpChangeAmount);
                            if (amount && amount > 0) {
                              const newHP = Math.min(selectedCharacter.hit_points_max, selectedCharacter.hit_points_current + amount);
                              updateHP(newHP);
                              setHpChangeAmount(''); // Clear input after use
                            }
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors w-24"
                        >
                          Heal
                        </button>
                        <button
                          onClick={() => {
                            const amount = parseInt(hpChangeAmount);
                            if (amount && amount > 0) {
                              const newHP = Math.max(0, selectedCharacter.hit_points_current - amount);
                              updateHP(newHP);
                              setHpChangeAmount(''); // Clear input after use
                            }
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors w-24"
                        >
                          Damage
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Temporary HP - Half Width */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-slate-400">Temp HP</div>
                      <div className="text-2xl font-bold">
                        {selectedCharacter.hit_points_temporary}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempHpChangeAmount}
                        onChange={(e) => setTempHpChangeAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-24 px-3 bg-slate-900 border border-slate-600 rounded text-sm text-center focus:outline-none focus:border-blue-500 h-[72px]"
                        min="0"
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => {
                            const amount = parseInt(tempHpChangeAmount);
                            if (amount && amount > 0) {
                              const newTempHP = selectedCharacter.hit_points_temporary + amount;
                              updateTempHP(newTempHP);
                              setTempHpChangeAmount(''); // Clear input after use
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors w-24"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            const amount = parseInt(tempHpChangeAmount);
                            if (amount && amount > 0) {
                              const newTempHP = Math.max(0, selectedCharacter.hit_points_temporary - amount);
                              updateTempHP(newTempHP);
                              setTempHpChangeAmount(''); // Clear input after use
                            }
                          }}
                          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm font-medium transition-colors w-24"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabbed Navigation */}
              <div className="flex gap-2 mb-4 border-b border-slate-700">
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === 'skills'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Skills
                </button>
                <button
                  onClick={() => setActiveTab('actions')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === 'actions'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Swords className="w-4 h-4" />
                  Actions
                </button>
                <button
                  onClick={() => setActiveTab('spells')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === 'spells'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Spells
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === 'features'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Features
                </button>
                <button
                  onClick={() => setActiveTab('traits')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === 'traits'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Scroll className="w-4 h-4" />
                  Traits
                </button>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                    activeTab === 'inventory'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Backpack className="w-4 h-4" />
                  Inventory
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'skills' && (
                <SkillsDisplay
                  characterId={selectedCharacter.id}
                  skills={characterSkills}
                  abilityScores={{
                    strength: selectedCharacter.strength,
                    dexterity: selectedCharacter.dexterity,
                    constitution: selectedCharacter.constitution,
                    intelligence: selectedCharacter.intelligence,
                    wisdom: selectedCharacter.wisdom,
                    charisma: selectedCharacter.charisma,
                  }}
                  proficiencyBonus={selectedCharacter.proficiency_bonus}
                  onSkillsUpdate={handleSkillsUpdate}
                />
              )}

              {activeTab === 'actions' && (
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Swords className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">Actions coming soon...</p>
                  <p className="text-sm text-slate-500 mt-2">Combat actions, attacks, and special abilities</p>
                </div>
              )}

              {activeTab === 'spells' && (
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">Spells coming soon...</p>
                  <p className="text-sm text-slate-500 mt-2">Spell slots, prepared spells, and cantrips</p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Star className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">Features coming soon...</p>
                  <p className="text-sm text-slate-500 mt-2">Class features and special abilities</p>
                </div>
              )}

              {activeTab === 'traits' && (
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Scroll className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">Traits coming soon...</p>
                  <p className="text-sm text-slate-500 mt-2">Racial traits, personality traits, ideals, bonds, and flaws</p>
                </div>
              )}

              {activeTab === 'inventory' && (
                <div className="bg-slate-800 rounded-lg p-6 text-center">
                  <Backpack className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  <p className="text-slate-400">Inventory coming soon...</p>
                  <p className="text-sm text-slate-500 mt-2">Equipment, items, currency, and encumbrance tracking</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-400 mb-2">
                  No Character Selected
                </h2>
                <p className="text-slate-500">
                  Select a character from the sidebar or create a new one
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
