import { useEffect, useState } from 'react';
import { initDatabase } from './lib/database';
import { CharacterListSimple } from './components/CharacterListSimple';
import { SkillsDisplay } from './components/SkillsDisplay';
import { Trash2 } from 'lucide-react';

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

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<FullCharacter | null>(null);
  const [characterSkills, setCharacterSkills] = useState<Skill[]>([]);

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
        {/* Sidebar - Character List */}
        <aside className="w-80 border-r border-slate-700 bg-slate-800 overflow-y-auto">
          <CharacterListSimple onSelectCharacter={handleSelectCharacter} selectedId={selectedCharacter?.id} />
        </aside>

        {/* Main Content - Character Sheet */}
        <main className="flex-1 overflow-y-auto">
          {selectedCharacter ? (
            <div className="p-6 max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-4 pb-4 border-b border-slate-700">
                <div className="flex items-start justify-between">
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
                  <button
                    onClick={deleteCharacter}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    title="Delete Character"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Attributes - Compact at Top */}
              <div className="grid grid-cols-6 gap-3 mb-4">
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-slate-400 mb-1">STR</div>
                  <div className="text-2xl font-bold mb-1">{getModifier(selectedCharacter.strength)}</div>
                  <div className="text-xs text-slate-500">{selectedCharacter.strength}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-slate-400 mb-1">DEX</div>
                  <div className="text-2xl font-bold mb-1">{getModifier(selectedCharacter.dexterity)}</div>
                  <div className="text-xs text-slate-500">{selectedCharacter.dexterity}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-slate-400 mb-1">CON</div>
                  <div className="text-2xl font-bold mb-1">{getModifier(selectedCharacter.constitution)}</div>
                  <div className="text-xs text-slate-500">{selectedCharacter.constitution}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-slate-400 mb-1">INT</div>
                  <div className="text-2xl font-bold mb-1">{getModifier(selectedCharacter.intelligence)}</div>
                  <div className="text-xs text-slate-500">{selectedCharacter.intelligence}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-slate-400 mb-1">WIS</div>
                  <div className="text-2xl font-bold mb-1">{getModifier(selectedCharacter.wisdom)}</div>
                  <div className="text-xs text-slate-500">{selectedCharacter.wisdom}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-xs font-semibold text-slate-400 mb-1">CHA</div>
                  <div className="text-2xl font-bold mb-1">{getModifier(selectedCharacter.charisma)}</div>
                  <div className="text-xs text-slate-500">{selectedCharacter.charisma}</div>
                </div>
              </div>

              {/* Core Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-sm text-slate-400 mb-1">Armor Class</div>
                  <div className="text-3xl font-bold">{selectedCharacter.armor_class}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-sm text-slate-400 mb-1">Initiative</div>
                  <div className="text-3xl font-bold">{getModifier(selectedCharacter.dexterity)}</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-sm text-slate-400 mb-1">Speed</div>
                  <div className="text-3xl font-bold">{selectedCharacter.speed} ft</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                  <div className="text-sm text-slate-400 mb-1">Prof. Bonus</div>
                  <div className="text-3xl font-bold">+{selectedCharacter.proficiency_bonus}</div>
                </div>
              </div>

              {/* Hit Points */}
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Hit Points</div>
                    <div className="text-2xl font-bold">
                      {selectedCharacter.hit_points_current} / {selectedCharacter.hit_points_max}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const damage = prompt('Damage amount:');
                        if (damage) {
                          const newHP = Math.max(0, selectedCharacter.hit_points_current - parseInt(damage));
                          updateHP(newHP);
                        }
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition-colors"
                    >
                      Damage
                    </button>
                    <button
                      onClick={() => {
                        const heal = prompt('Heal amount:');
                        if (heal) {
                          const newHP = Math.min(selectedCharacter.hit_points_max, selectedCharacter.hit_points_current + parseInt(heal));
                          updateHP(newHP);
                        }
                      }}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm font-medium transition-colors"
                    >
                      Heal
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
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
