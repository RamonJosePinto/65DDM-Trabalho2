import * as SQLite from "expo-sqlite";

let db;

export const initializeDatabase = async () => {
    db = await SQLite.openDatabaseAsync("study_manager.db");

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
      completed INTEGER DEFAULT 0,
      data TEXT,
      FOREIGN KEY (subjectId) REFERENCES subjects (id)
    );
  `);
};

export const clearDatabase = async () => {
    const db = getDatabase();
    try {
        await db.runAsync("DROP TABLE IF EXISTS tasks;");
        await db.runAsync("DROP TABLE IF EXISTS subjects;");
        console.log("Tabelas deletadas com sucesso.");
    } catch (error) {
        console.error("Erro ao deletar tabelas:", error);
    }
};

export const getDatabase = () => db;

export default {
    initializeDatabase,
    clearDatabase,
    getDatabase,
};
