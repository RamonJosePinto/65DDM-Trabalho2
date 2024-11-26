import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gestor_estudos.db');

// Inicializa as tabelas
export const initDatabase = () => {
  db.transaction(tx => {
    // Cria tabela de matérias
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      );`
    );

    // Cria tabela de tarefas
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        due_date TEXT,
        status TEXT DEFAULT 'PENDING',
        FOREIGN KEY (subject_id) REFERENCES subjects (id)
      );`
    );
  }, (err) => {
    console.error('Erro ao criar tabelas:', err);
  });
};

export const getDatabase = () => db;
