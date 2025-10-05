export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  race: string;
  background: string;

  // Core attributes
  attributes: Attributes;

  // Calculated values
  proficiencyBonus: number;
  hitPoints: {
    current: number;
    max: number;
    temporary: number;
  };
  armorClass: number;
  initiative: number;
  speed: number;

  // Skills and proficiencies
  skills: Skill[];
  savingThrows: SavingThrow[];

  // Features and traits
  features: Feature[];
  traits: Trait[];

  // Inventory
  inventory: InventoryItem[];

  // Experience
  experiencePoints: number;

  // Notes
  notes?: string;

  createdAt: string;
  updatedAt: string;
}

export interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Skill {
  id: string;
  name: string;
  attribute: keyof Attributes;
  proficient: boolean;
  expertise: boolean;
  bonus: number;
  customModifier?: number;
  isCustom: boolean;
  description?: string;
}

export interface SavingThrow {
  attribute: keyof Attributes;
  proficient: boolean;
  bonus: number;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  source: string; // e.g., "Class: Investigator", "Homebrew", "Valdas Spire of Secrets"
  level: number;
  usesPerRest?: {
    max: number;
    current: number;
    restType: 'short' | 'long';
  };
  isCustom: boolean;
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  source: string;
  isCustom: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  value: {
    amount: number;
    currency: 'cp' | 'sp' | 'gp' | 'pp';
  };
  description?: string;
  equipped: boolean;
  category: 'weapon' | 'armor' | 'tool' | 'consumable' | 'misc';
  properties?: string[];
  isCustom: boolean;
}

export interface Action {
  id: string;
  name: string;
  type: 'action' | 'bonus_action' | 'reaction' | 'free';
  description: string;
  attack?: {
    toHit: number;
    damage: string;
    damageType: string;
    range?: string;
  };
  save?: {
    attribute: keyof Attributes;
    dc: number;
  };
  source: string;
  isCustom: boolean;
}
