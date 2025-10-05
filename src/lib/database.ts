import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  db = await Database.load('sqlite:character_viewer.db');

  // Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      level INTEGER NOT NULL DEFAULT 1,
      race TEXT NOT NULL,
      background TEXT NOT NULL,

      strength INTEGER NOT NULL DEFAULT 10,
      dexterity INTEGER NOT NULL DEFAULT 10,
      constitution INTEGER NOT NULL DEFAULT 10,
      intelligence INTEGER NOT NULL DEFAULT 10,
      wisdom INTEGER NOT NULL DEFAULT 10,
      charisma INTEGER NOT NULL DEFAULT 10,

      proficiency_bonus INTEGER NOT NULL DEFAULT 2,
      hit_points_current INTEGER NOT NULL DEFAULT 10,
      hit_points_max INTEGER NOT NULL DEFAULT 10,
      hit_points_temporary INTEGER NOT NULL DEFAULT 0,
      armor_class INTEGER NOT NULL DEFAULT 10,
      initiative INTEGER NOT NULL DEFAULT 0,
      speed INTEGER NOT NULL DEFAULT 30,

      experience_points INTEGER NOT NULL DEFAULT 0,
      notes TEXT,

      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      name TEXT NOT NULL,
      attribute TEXT NOT NULL,
      proficient INTEGER NOT NULL DEFAULT 0,
      expertise INTEGER NOT NULL DEFAULT 0,
      bonus INTEGER NOT NULL DEFAULT 0,
      custom_modifier INTEGER,
      is_custom INTEGER NOT NULL DEFAULT 0,
      description TEXT,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS saving_throws (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      attribute TEXT NOT NULL,
      proficient INTEGER NOT NULL DEFAULT 0,
      bonus INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS features (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      source TEXT NOT NULL,
      level INTEGER NOT NULL,
      uses_max INTEGER,
      uses_current INTEGER,
      rest_type TEXT,
      is_custom INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS traits (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      source TEXT NOT NULL,
      is_custom INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      weight REAL NOT NULL DEFAULT 0,
      value_amount REAL NOT NULL DEFAULT 0,
      value_currency TEXT NOT NULL DEFAULT 'gp',
      description TEXT,
      equipped INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL,
      properties TEXT,
      is_custom INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS actions (
      id TEXT PRIMARY KEY,
      character_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      attack_to_hit INTEGER,
      attack_damage TEXT,
      attack_damage_type TEXT,
      attack_range TEXT,
      save_attribute TEXT,
      save_dc INTEGER,
      source TEXT NOT NULL,
      is_custom INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    )
  `);

  return db;
}

export async function getDatabase(): Promise<Database> {
  if (!db) {
    return initDatabase();
  }
  return db;
}

/**
 * Standard D&D 5e skills with their associated ability scores
 * These will be added to every new character automatically
 */
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

/**
 * Adds all standard D&D 5e skills to a newly created character
 * Each skill starts with no proficiency or expertise
 * @param characterId - The UUID of the character to add skills to
 */
export async function addDefaultSkills(characterId: string): Promise<void> {
  const database = await getDatabase();

  for (const skill of DEFAULT_DND_SKILLS) {
    await database.execute(
      `INSERT INTO skills (id, character_id, name, attribute, proficient, expertise, bonus, is_custom)
       VALUES (?, ?, ?, ?, 0, 0, 0, 0)`,
      [crypto.randomUUID(), characterId, skill.name, skill.attribute]
    );
  }
}
