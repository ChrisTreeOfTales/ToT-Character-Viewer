import { useState } from 'react';
import { Circle, Disc, Plus } from 'lucide-react';
import { getDatabase } from '../lib/database';

/**
 * Represents a single skill with its proficiency status
 */
interface Skill {
  id: string;
  character_id: string;
  name: string;
  attribute: string;  // 'strength', 'dexterity', 'intelligence', etc.
  proficient: number; // 0 = not proficient, 1 = proficient
  expertise: number;  // 0 = no expertise, 1 = expertise
  bonus: number;      // Total skill bonus
  is_custom: number;  // 0 = D&D 5e skill, 1 = custom/Valdas skill
}

interface SkillsDisplayProps {
  characterId: string;
  skills: Skill[];
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  proficiencyBonus: number;
  onSkillsUpdate: () => void; // Callback to reload character data
}

/**
 * Displays character skills with proficiency/expertise indicators
 * - Empty circle = not proficient
 * - Filled circle = proficient (add proficiency bonus)
 * - Double circle = expertise (add 2x proficiency bonus)
 */
export function SkillsDisplay({ characterId, skills, abilityScores, proficiencyBonus, onSkillsUpdate }: SkillsDisplayProps) {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillAttribute, setNewSkillAttribute] = useState('strength');

  // Debug: Log skills to console
  console.log('SkillsDisplay received skills:', skills);

  /**
   * Calculates the ability modifier from an ability score
   * Formula: (score - 10) / 2, rounded down
   */
  const getModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  /**
   * Gets the ability modifier for a given attribute name
   */
  const getAttributeModifier = (attribute: string): number => {
    const attrLower = attribute.toLowerCase();
    switch (attrLower) {
      case 'strength': return getModifier(abilityScores.strength);
      case 'dexterity': return getModifier(abilityScores.dexterity);
      case 'constitution': return getModifier(abilityScores.constitution);
      case 'intelligence': return getModifier(abilityScores.intelligence);
      case 'wisdom': return getModifier(abilityScores.wisdom);
      case 'charisma': return getModifier(abilityScores.charisma);
      default: return 0;
    }
  };

  /**
   * Calculates total skill bonus
   * = ability modifier + (proficiency bonus if proficient) + (proficiency bonus again if expertise)
   */
  const calculateSkillBonus = (skill: Skill): number => {
    const abilityMod = getAttributeModifier(skill.attribute);
    let totalBonus = abilityMod;

    if (skill.proficient) {
      totalBonus += proficiencyBonus;
    }

    if (skill.expertise) {
      totalBonus += proficiencyBonus; // Expertise adds another proficiency bonus
    }

    return totalBonus;
  };

  /**
   * Toggles skill proficiency/expertise
   * Cycles through: none -> proficient -> expertise -> none
   */
  const toggleProficiency = async (skill: Skill) => {
    try {
      const db = await getDatabase();
      let newProficient = skill.proficient;
      let newExpertise = skill.expertise;

      // Cycle through states: none (0,0) -> proficient (1,0) -> expertise (1,1) -> none (0,0)
      if (!skill.proficient && !skill.expertise) {
        // Currently none -> make proficient
        newProficient = 1;
        newExpertise = 0;
      } else if (skill.proficient && !skill.expertise) {
        // Currently proficient -> make expertise
        newProficient = 1;
        newExpertise = 1;
      } else {
        // Currently expertise -> make none
        newProficient = 0;
        newExpertise = 0;
      }

      await db.execute(
        'UPDATE skills SET proficient = ?, expertise = ? WHERE id = ?',
        [newProficient, newExpertise, skill.id]
      );

      // Reload character data to show updated skills
      onSkillsUpdate();
    } catch (error) {
      console.error('Failed to toggle skill proficiency:', error);
      alert('Failed to update skill proficiency');
    }
  };

  /**
   * Adds a custom skill to the character
   * Used for Valdas Spire of Secrets content or homebrew skills
   */
  const addCustomSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSkillName.trim()) {
      alert('Please enter a skill name');
      return;
    }

    try {
      const db = await getDatabase();
      await db.execute(
        `INSERT INTO skills (id, character_id, name, attribute, proficient, expertise, bonus, is_custom)
         VALUES (?, ?, ?, ?, 0, 0, 0, 1)`,
        [crypto.randomUUID(), characterId, newSkillName.trim(), newSkillAttribute]
      );

      // Reset form and reload
      setNewSkillName('');
      setNewSkillAttribute('strength');
      setIsAddingSkill(false);
      onSkillsUpdate();
    } catch (error) {
      console.error('Failed to add custom skill:', error);
      alert('Failed to add custom skill');
    }
  };

  /**
   * Renders the proficiency indicator icon
   * Empty circle = not proficient
   * Filled circle = proficient
   * Double filled circle (Disc) = expertise
   */
  const ProficiencyIcon = ({ skill }: { skill: Skill }) => {
    if (skill.expertise) {
      return <Disc className="w-4 h-4 text-yellow-400 fill-yellow-400" />;
    } else if (skill.proficient) {
      return <Circle className="w-4 h-4 text-blue-400 fill-blue-400" />;
    } else {
      return <Circle className="w-4 h-4 text-slate-500" />;
    }
  };

  /**
   * Adds all D&D 5e skills to this character
   * Used for characters created before the skills system was implemented
   */
  const addAllDndSkills = async () => {
    try {
      const db = await getDatabase();

      const DEFAULT_DND_SKILLS = [
        { name: 'Acrobatics', attribute: 'dexterity' },
        { name: 'Animal Handling', attribute: 'wisdom' },
        { name: 'Arcana', attribute: 'intelligence' },
        { name: 'Athletics', attribute: 'strength' },
        { name: 'Deception', attribute: 'charisma' },
        { name: 'History', attribute: 'intelligence' },
        { name: 'Insight', attribute: 'wisdom' },
        { name: 'Intimidation', attribute: 'charisma' },
        { name: 'Investigation', attribute: 'intelligence' },
        { name: 'Medicine', attribute: 'wisdom' },
        { name: 'Nature', attribute: 'intelligence' },
        { name: 'Perception', attribute: 'wisdom' },
        { name: 'Performance', attribute: 'charisma' },
        { name: 'Persuasion', attribute: 'charisma' },
        { name: 'Religion', attribute: 'intelligence' },
        { name: 'Sleight of Hand', attribute: 'dexterity' },
        { name: 'Stealth', attribute: 'dexterity' },
        { name: 'Survival', attribute: 'wisdom' },
      ];

      for (const skill of DEFAULT_DND_SKILLS) {
        await db.execute(
          `INSERT INTO skills (id, character_id, name, attribute, proficient, expertise, bonus, is_custom)
           VALUES (?, ?, ?, ?, 0, 0, 0, 0)`,
          [crypto.randomUUID(), characterId, skill.name, skill.attribute]
        );
      }

      onSkillsUpdate();
    } catch (error) {
      console.error('Failed to add D&D skills:', error);
      alert('Failed to add D&D skills');
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Skills</h2>
        <button
          onClick={() => setIsAddingSkill(!isAddingSkill)}
          className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          title="Add custom skill"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Show helper button if character has no skills */}
      {skills.length === 0 && (
        <div className="mb-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-sm text-slate-300 mb-3">
            This character has no skills. Add the standard D&D 5e skills to get started.
          </p>
          <button
            onClick={addAllDndSkills}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
          >
            Add D&D 5e Skills (18 skills)
          </button>
        </div>
      )}

      {/* Add Custom Skill Form */}
      {isAddingSkill && (
        <form onSubmit={addCustomSkill} className="mb-4 p-4 bg-slate-700 rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Skill Name</label>
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g., Forensics, Streetwise"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Ability</label>
              <select
                value={newSkillAttribute}
                onChange={(e) => setNewSkillAttribute(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="strength">Strength</option>
                <option value="dexterity">Dexterity</option>
                <option value="constitution">Constitution</option>
                <option value="intelligence">Intelligence</option>
                <option value="wisdom">Wisdom</option>
                <option value="charisma">Charisma</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Add Skill
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSkill(false)}
                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Skills List */}
      <div className="grid grid-cols-2 gap-2">
        {skills.map((skill) => {
          const bonus = calculateSkillBonus(skill);
          const bonusStr = bonus >= 0 ? `+${bonus}` : `${bonus}`;

          return (
            <button
              key={skill.id}
              onClick={() => toggleProficiency(skill)}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left"
              title={`Click to cycle: none → proficient → expertise`}
            >
              <div className="flex items-center gap-2">
                <ProficiencyIcon skill={skill} />
                <span className={skill.is_custom ? 'text-purple-400' : ''}>
                  {skill.name}
                </span>
              </div>
              <span className="font-mono font-bold">{bonusStr}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 text-slate-500" />
          <span>Not Proficient</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 text-blue-400 fill-blue-400" />
          <span>Proficient (+{proficiencyBonus})</span>
        </div>
        <div className="flex items-center gap-2">
          <Disc className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span>Expertise (+{proficiencyBonus * 2})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">Purple</span>
          <span>= Custom/Valdas Skill</span>
        </div>
      </div>
    </div>
  );
}
