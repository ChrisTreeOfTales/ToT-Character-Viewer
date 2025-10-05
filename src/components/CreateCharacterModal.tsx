import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { createCharacterSchema, CreateCharacterFormData } from '../lib/validations';
import { useCharacterStore } from '../store/characterStore';
import { Character } from '../types/character';

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCharacterModal({ isOpen, onClose }: CreateCharacterModalProps) {
  const { createCharacter, loadCharacter } = useCharacterStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CreateCharacterFormData>({
    resolver: zodResolver(createCharacterSchema),
    defaultValues: {
      name: '',
      class: '',
      race: '',
      background: '',
      level: 1,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      hitPointsMax: 10,
      armorClass: 10,
      speed: 30,
    },
  });

  const level = watch('level');
  const dexterity = watch('dexterity');

  // Calculate proficiency bonus based on level
  const proficiencyBonus = 2 + Math.floor((level - 1) / 4);

  // Calculate initiative (DEX modifier)
  const getModifier = (score: number): number => Math.floor((score - 10) / 2);
  const initiative = getModifier(dexterity);

  const onSubmit = async (data: CreateCharacterFormData) => {
    try {
      const characterData: Omit<Character, 'id' | 'createdAt' | 'updatedAt'> = {
        name: data.name,
        class: data.class,
        race: data.race,
        background: data.background,
        level: data.level,
        attributes: {
          strength: data.strength,
          dexterity: data.dexterity,
          constitution: data.constitution,
          intelligence: data.intelligence,
          wisdom: data.wisdom,
          charisma: data.charisma,
        },
        proficiencyBonus,
        hitPoints: {
          current: data.hitPointsMax,
          max: data.hitPointsMax,
          temporary: 0,
        },
        armorClass: data.armorClass,
        initiative,
        speed: data.speed,
        skills: [],
        savingThrows: [],
        features: [],
        traits: [],
        inventory: [],
        experiencePoints: 0,
      };

      await createCharacter(characterData);

      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold">Create New Character</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-300">Basic Information</h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                Character Name *
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter character name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-slate-300 mb-1">
                  Class *
                </label>
                <input
                  {...register('class')}
                  id="class"
                  type="text"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Investigator"
                />
                {errors.class && (
                  <p className="mt-1 text-sm text-red-400">{errors.class.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-slate-300 mb-1">
                  Level *
                </label>
                <input
                  {...register('level', { valueAsNumber: true })}
                  id="level"
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.level && (
                  <p className="mt-1 text-sm text-red-400">{errors.level.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="race" className="block text-sm font-medium text-slate-300 mb-1">
                  Race *
                </label>
                <input
                  {...register('race')}
                  id="race"
                  type="text"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Human"
                />
                {errors.race && (
                  <p className="mt-1 text-sm text-red-400">{errors.race.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="background" className="block text-sm font-medium text-slate-300 mb-1">
                  Background *
                </label>
                <input
                  {...register('background')}
                  id="background"
                  type="text"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Detective"
                />
                {errors.background && (
                  <p className="mt-1 text-sm text-red-400">{errors.background.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Attributes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-300">Ability Scores</h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="strength" className="block text-sm font-medium text-slate-300 mb-1">
                  Strength (STR)
                </label>
                <input
                  {...register('strength', { valueAsNumber: true })}
                  id="strength"
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.strength && (
                  <p className="mt-1 text-sm text-red-400">{errors.strength.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="dexterity" className="block text-sm font-medium text-slate-300 mb-1">
                  Dexterity (DEX)
                </label>
                <input
                  {...register('dexterity', { valueAsNumber: true })}
                  id="dexterity"
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dexterity && (
                  <p className="mt-1 text-sm text-red-400">{errors.dexterity.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="constitution" className="block text-sm font-medium text-slate-300 mb-1">
                  Constitution (CON)
                </label>
                <input
                  {...register('constitution', { valueAsNumber: true })}
                  id="constitution"
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.constitution && (
                  <p className="mt-1 text-sm text-red-400">{errors.constitution.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="intelligence" className="block text-sm font-medium text-slate-300 mb-1">
                  Intelligence (INT)
                </label>
                <input
                  {...register('intelligence', { valueAsNumber: true })}
                  id="intelligence"
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.intelligence && (
                  <p className="mt-1 text-sm text-red-400">{errors.intelligence.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="wisdom" className="block text-sm font-medium text-slate-300 mb-1">
                  Wisdom (WIS)
                </label>
                <input
                  {...register('wisdom', { valueAsNumber: true })}
                  id="wisdom"
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.wisdom && (
                  <p className="mt-1 text-sm text-red-400">{errors.wisdom.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="charisma" className="block text-sm font-medium text-slate-300 mb-1">
                  Charisma (CHA)
                </label>
                <input
                  {...register('charisma', { valueAsNumber: true })}
                  id="charisma"
                  type="number"
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.charisma && (
                  <p className="mt-1 text-sm text-red-400">{errors.charisma.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Core Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-300">Core Stats</h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="hitPointsMax" className="block text-sm font-medium text-slate-300 mb-1">
                  Max Hit Points
                </label>
                <input
                  {...register('hitPointsMax', { valueAsNumber: true })}
                  id="hitPointsMax"
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.hitPointsMax && (
                  <p className="mt-1 text-sm text-red-400">{errors.hitPointsMax.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="armorClass" className="block text-sm font-medium text-slate-300 mb-1">
                  Armor Class
                </label>
                <input
                  {...register('armorClass', { valueAsNumber: true })}
                  id="armorClass"
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.armorClass && (
                  <p className="mt-1 text-sm text-red-400">{errors.armorClass.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="speed" className="block text-sm font-medium text-slate-300 mb-1">
                  Speed (ft)
                </label>
                <input
                  {...register('speed', { valueAsNumber: true })}
                  id="speed"
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.speed && (
                  <p className="mt-1 text-sm text-red-400">{errors.speed.message}</p>
                )}
              </div>
            </div>

            {/* Calculated Stats Display */}
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-sm font-medium text-slate-400 mb-2">Auto-Calculated</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Proficiency Bonus:</span>
                  <span className="font-medium text-blue-400">+{proficiencyBonus}</span>
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

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
            >
              {isSubmitting ? 'Creating...' : 'Create Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
