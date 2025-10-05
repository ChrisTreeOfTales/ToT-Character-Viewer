import { Character } from '../types/character';
import { AttributeBlock } from './AttributeBlock';
import { SkillsList } from './SkillsList';
import { InventoryList } from './InventoryList';
import { FeaturesList } from './FeaturesList';

interface CharacterSheetProps {
  character: Character;
}

export function CharacterSheet({ character }: CharacterSheetProps) {
  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 pb-6 border-b border-slate-700">
        <h1 className="text-4xl font-bold mb-2">{character.name}</h1>
        <div className="flex gap-4 text-slate-400">
          <span>Level {character.level} {character.class}</span>
          <span>•</span>
          <span>{character.race}</span>
          <span>•</span>
          <span>{character.background}</span>
        </div>
      </div>

      {/* Core Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Armor Class</div>
          <div className="text-3xl font-bold">{character.armorClass}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Initiative</div>
          <div className="text-3xl font-bold">{getModifier(character.attributes.dexterity)}</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Speed</div>
          <div className="text-3xl font-bold">{character.speed} ft</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <div className="text-sm text-slate-400 mb-1">Prof. Bonus</div>
          <div className="text-3xl font-bold">+{character.proficiencyBonus}</div>
        </div>
      </div>

      {/* Hit Points */}
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400 mb-1">Hit Points</div>
            <div className="text-2xl font-bold">
              {character.hitPoints.current} / {character.hitPoints.max}
            </div>
          </div>
          {character.hitPoints.temporary > 0 && (
            <div>
              <div className="text-sm text-slate-400 mb-1">Temporary HP</div>
              <div className="text-2xl font-bold text-blue-400">
                {character.hitPoints.temporary}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attributes */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {Object.entries(character.attributes).map(([key, value]) => (
          <AttributeBlock
            key={key}
            name={key.toUpperCase().slice(0, 3)}
            score={value}
            modifier={getModifier(value)}
          />
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">Skills</h2>
            <SkillsList skills={character.skills} />
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Features & Traits</h2>
            <FeaturesList features={character.features} traits={character.traits} />
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">Inventory</h2>
            <InventoryList inventory={character.inventory} />
          </section>

          {character.notes && (
            <section>
              <h2 className="text-xl font-bold mb-3">Notes</h2>
              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-slate-300 whitespace-pre-wrap">{character.notes}</p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
