import { create } from 'zustand';
import { Character } from '../types/character';
import { getDatabase } from '../lib/database';

interface CharacterState {
  currentCharacter: Character | null;
  characters: Character[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCharacters: () => Promise<void>;
  loadCharacter: (id: string) => Promise<void>;
  createCharacter: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCharacter: (character: Character) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  setCurrentCharacter: (character: Character | null) => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  currentCharacter: null,
  characters: [],
  isLoading: false,
  error: null,

  loadCharacters: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = await getDatabase();
      const result = await db.select<Character[]>('SELECT * FROM characters ORDER BY updated_at DESC');

      // Load associated data for each character
      const charactersWithData = await Promise.all(
        result.map(async (char) => {
          const skills = await db.select(`SELECT * FROM skills WHERE character_id = ?`, [char.id]);
          const savingThrows = await db.select(`SELECT * FROM saving_throws WHERE character_id = ?`, [char.id]);
          const features = await db.select(`SELECT * FROM features WHERE character_id = ?`, [char.id]);
          const traits = await db.select(`SELECT * FROM traits WHERE character_id = ?`, [char.id]);
          const inventory = await db.select(`SELECT * FROM inventory WHERE character_id = ?`, [char.id]);

          return {
            ...char,
            attributes: {
              strength: char.strength,
              dexterity: char.dexterity,
              constitution: char.constitution,
              intelligence: char.intelligence,
              wisdom: char.wisdom,
              charisma: char.charisma,
            },
            hitPoints: {
              current: char.hit_points_current,
              max: char.hit_points_max,
              temporary: char.hit_points_temporary,
            },
            skills: skills.map((s: any) => ({
              id: s.id,
              name: s.name,
              attribute: s.attribute,
              proficient: Boolean(s.proficient),
              expertise: Boolean(s.expertise),
              bonus: s.bonus,
              customModifier: s.custom_modifier,
              isCustom: Boolean(s.is_custom),
              description: s.description,
            })),
            savingThrows: savingThrows.map((st: any) => ({
              attribute: st.attribute,
              proficient: Boolean(st.proficient),
              bonus: st.bonus,
            })),
            features: features.map((f: any) => ({
              id: f.id,
              name: f.name,
              description: f.description,
              source: f.source,
              level: f.level,
              usesPerRest: f.uses_max ? {
                max: f.uses_max,
                current: f.uses_current,
                restType: f.rest_type,
              } : undefined,
              isCustom: Boolean(f.is_custom),
            })),
            traits: traits.map((t: any) => ({
              id: t.id,
              name: t.name,
              description: t.description,
              source: t.source,
              isCustom: Boolean(t.is_custom),
            })),
            inventory: inventory.map((i: any) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              weight: i.weight,
              value: {
                amount: i.value_amount,
                currency: i.value_currency,
              },
              description: i.description,
              equipped: Boolean(i.equipped),
              category: i.category,
              properties: i.properties ? JSON.parse(i.properties) : [],
              isCustom: Boolean(i.is_custom),
            })),
          } as Character;
        })
      );

      set({ characters: charactersWithData, isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  loadCharacter: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await getDatabase();
      const result = await db.select<Character[]>('SELECT * FROM characters WHERE id = ?', [id]);

      if (result.length === 0) {
        throw new Error('Character not found');
      }

      const char = result[0];
      const skills = await db.select(`SELECT * FROM skills WHERE character_id = ?`, [id]);
      const savingThrows = await db.select(`SELECT * FROM saving_throws WHERE character_id = ?`, [id]);
      const features = await db.select(`SELECT * FROM features WHERE character_id = ?`, [id]);
      const traits = await db.select(`SELECT * FROM traits WHERE character_id = ?`, [id]);
      const inventory = await db.select(`SELECT * FROM inventory WHERE character_id = ?`, [id]);

      const character: Character = {
        ...char,
        attributes: {
          strength: char.strength,
          dexterity: char.dexterity,
          constitution: char.constitution,
          intelligence: char.intelligence,
          wisdom: char.wisdom,
          charisma: char.charisma,
        },
        hitPoints: {
          current: char.hit_points_current,
          max: char.hit_points_max,
          temporary: char.hit_points_temporary,
        },
        skills: skills.map((s: any) => ({
          id: s.id,
          name: s.name,
          attribute: s.attribute,
          proficient: Boolean(s.proficient),
          expertise: Boolean(s.expertise),
          bonus: s.bonus,
          customModifier: s.custom_modifier,
          isCustom: Boolean(s.is_custom),
          description: s.description,
        })),
        savingThrows: savingThrows.map((st: any) => ({
          attribute: st.attribute,
          proficient: Boolean(st.proficient),
          bonus: st.bonus,
        })),
        features: features.map((f: any) => ({
          id: f.id,
          name: f.name,
          description: f.description,
          source: f.source,
          level: f.level,
          usesPerRest: f.uses_max ? {
            max: f.uses_max,
            current: f.uses_current,
            restType: f.rest_type,
          } : undefined,
          isCustom: Boolean(f.is_custom),
        })),
        traits: traits.map((t: any) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          source: t.source,
          isCustom: Boolean(t.is_custom),
        })),
        inventory: inventory.map((i: any) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          weight: i.weight,
          value: {
            amount: i.value_amount,
            currency: i.value_currency,
          },
          description: i.description,
          equipped: Boolean(i.equipped),
          category: i.category,
          properties: i.properties ? JSON.parse(i.properties) : [],
          isCustom: Boolean(i.is_custom),
        })),
      } as Character;

      set({ currentCharacter: character, isLoading: false });
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  createCharacter: async (characterData) => {
    set({ isLoading: true, error: null });
    try {
      const db = await getDatabase();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      await db.execute(
        `INSERT INTO characters (
          id, name, class, level, race, background,
          strength, dexterity, constitution, intelligence, wisdom, charisma,
          proficiency_bonus, hit_points_current, hit_points_max, hit_points_temporary,
          armor_class, initiative, speed, experience_points, notes,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          characterData.name,
          characterData.class,
          characterData.level,
          characterData.race,
          characterData.background,
          characterData.attributes.strength,
          characterData.attributes.dexterity,
          characterData.attributes.constitution,
          characterData.attributes.intelligence,
          characterData.attributes.wisdom,
          characterData.attributes.charisma,
          characterData.proficiencyBonus,
          characterData.hitPoints.current,
          characterData.hitPoints.max,
          characterData.hitPoints.temporary,
          characterData.armorClass,
          characterData.initiative,
          characterData.speed,
          characterData.experiencePoints,
          characterData.notes || null,
          now,
          now,
        ]
      );

      await get().loadCharacters();
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  updateCharacter: async (character) => {
    set({ isLoading: true, error: null });
    try {
      const db = await getDatabase();
      const now = new Date().toISOString();

      await db.execute(
        `UPDATE characters SET
          name = ?, class = ?, level = ?, race = ?, background = ?,
          strength = ?, dexterity = ?, constitution = ?, intelligence = ?, wisdom = ?, charisma = ?,
          proficiency_bonus = ?, hit_points_current = ?, hit_points_max = ?, hit_points_temporary = ?,
          armor_class = ?, initiative = ?, speed = ?, experience_points = ?, notes = ?,
          updated_at = ?
        WHERE id = ?`,
        [
          character.name,
          character.class,
          character.level,
          character.race,
          character.background,
          character.attributes.strength,
          character.attributes.dexterity,
          character.attributes.constitution,
          character.attributes.intelligence,
          character.attributes.wisdom,
          character.attributes.charisma,
          character.proficiencyBonus,
          character.hitPoints.current,
          character.hitPoints.max,
          character.hitPoints.temporary,
          character.armorClass,
          character.initiative,
          character.speed,
          character.experiencePoints,
          character.notes || null,
          now,
          character.id,
        ]
      );

      set({ currentCharacter: character, isLoading: false });
      await get().loadCharacters();
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  deleteCharacter: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const db = await getDatabase();
      await db.execute('DELETE FROM characters WHERE id = ?', [id]);

      if (get().currentCharacter?.id === id) {
        set({ currentCharacter: null });
      }

      await get().loadCharacters();
    } catch (error) {
      set({ error: String(error), isLoading: false });
    }
  },

  setCurrentCharacter: (character) => {
    set({ currentCharacter: character });
  },
}));
