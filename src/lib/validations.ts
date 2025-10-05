import { z } from 'zod';

export const createCharacterSchema = z.object({
  // Basic Info
  name: z.string()
    .min(1, 'Character name is required')
    .max(50, 'Character name must be 50 characters or less'),

  class: z.string()
    .min(1, 'Class is required')
    .max(50, 'Class name must be 50 characters or less'),

  race: z.string()
    .min(1, 'Race is required')
    .max(50, 'Race must be 50 characters or less'),

  background: z.string()
    .min(1, 'Background is required')
    .max(50, 'Background must be 50 characters or less'),

  level: z.number()
    .int('Level must be a whole number')
    .min(1, 'Level must be at least 1')
    .max(20, 'Level cannot exceed 20'),

  // Attributes
  strength: z.number()
    .int('Strength must be a whole number')
    .min(1, 'Strength must be at least 1')
    .max(20, 'Strength cannot exceed 20'),

  dexterity: z.number()
    .int('Dexterity must be a whole number')
    .min(1, 'Dexterity must be at least 1')
    .max(20, 'Dexterity cannot exceed 20'),

  constitution: z.number()
    .int('Constitution must be a whole number')
    .min(1, 'Constitution must be at least 1')
    .max(20, 'Constitution cannot exceed 20'),

  intelligence: z.number()
    .int('Intelligence must be a whole number')
    .min(1, 'Intelligence must be at least 1')
    .max(20, 'Intelligence cannot exceed 20'),

  wisdom: z.number()
    .int('Wisdom must be a whole number')
    .min(1, 'Wisdom must be at least 1')
    .max(20, 'Wisdom cannot exceed 20'),

  charisma: z.number()
    .int('Charisma must be a whole number')
    .min(1, 'Charisma must be at least 1')
    .max(20, 'Charisma cannot exceed 20'),

  // Core Stats
  hitPointsMax: z.number()
    .int('Max HP must be a whole number')
    .min(1, 'Max HP must be at least 1'),

  armorClass: z.number()
    .int('Armor Class must be a whole number')
    .min(1, 'Armor Class must be at least 1'),

  speed: z.number()
    .int('Speed must be a whole number')
    .min(0, 'Speed cannot be negative'),
});

export type CreateCharacterFormData = z.infer<typeof createCharacterSchema>;
