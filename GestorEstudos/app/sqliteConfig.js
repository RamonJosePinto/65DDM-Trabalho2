import * as SQLite from "expo-sqlite";

let db;

// Initialize database
export const initializeDatabase = async () => {
    db = await SQLite.openDatabaseAsync("study_manager.db");

    // Verificar e adicionar a coluna "completed" caso ainda não exista
    await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      subjectId INTEGER,
      completed INTEGER DEFAULT 0, -- Coluna "completed"
      FOREIGN KEY (subjectId) REFERENCES subjects (id)
    );

    ALTER TABLE tasks ADD COLUMN completed INTEGER DEFAULT 0;
  `);
};

export const getDatabase = () => db;
