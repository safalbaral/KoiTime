import * as SQLite from 'expo-sqlite';

const DB_NAME = "myapp.db";

export const initDB = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        is_archived INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        project_id INTEGER,
        FOREIGN KEY (project_id) REFERENCES projects (id)
      );

      CREATE TABLE IF NOT EXISTS task_instances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        total_minutes INTEGER,
        FOREIGN KEY (task_id) REFERENCES tasks (id)
      );
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Projects CRUD operations
export const createProject = async (db: SQLite.SQLiteDatabase, name: string, isArchived: boolean): Promise<number> => {
  //const db = await SQLite.openDatabaseAsync(DB_NAME);
  const result = await db.runAsync(
    'INSERT INTO projects (name, is_archived) VALUES (?, ?)',
    [name, isArchived ? 1 : 0]
  );
  return result.lastInsertRowId;
};

export const getProjects = async (db: SQLite.SQLiteDatabase): Promise<any[]> => {
  return db.getAllAsync('SELECT * FROM projects');
};

export const updateProject = async (db: SQLite.SQLiteDatabase, id: number, name: string, isArchived: boolean): Promise<void> => {
  await db.runAsync(
    'UPDATE projects SET name = ?, is_archived = ? WHERE id = ?',
    [name, isArchived ? 1 : 0, id]
  );
};

export const deleteProject = async (db: SQLite.SQLiteDatabase, id: number): Promise<void> => {
  await db.runAsync('DELETE FROM projects WHERE id = ?', [id]);
};

// Tasks CRUD operations
export const createTask = async (db: SQLite.SQLiteDatabase, name: string, projectId: number): Promise<number> => {
  const result = await db.runAsync(
    'INSERT INTO tasks (name, project_id) VALUES (?, ?)',
    [name, projectId]
  );
  return result.lastInsertRowId;
};

export const getTasks = async (db: SQLite.SQLiteDatabase, projectId?: number): Promise<any[]> => {
  if (projectId) {
    return db.getAllAsync('SELECT * FROM tasks WHERE project_id = ?', [projectId]);
  } else {
    return db.getAllAsync('SELECT * FROM tasks');
  }
};

export const updateTask = async (db: SQLite.SQLiteDatabase, id: number, name: string, projectId: number): Promise<void> => {
  await db.runAsync(
    'UPDATE tasks SET name = ?, project_id = ? WHERE id = ?',
    [name, projectId, id]
  );
};

export const deleteTask = async (db: SQLite.SQLiteDatabase, id: number): Promise<void> => {
  await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
};

// Task Instances CRUD operations
export const createTaskInstance = async (db: SQLite.SQLiteDatabase, taskId: number, startTime: number): Promise<number> => {
  const result = await db.runAsync(
    'INSERT INTO task_instances (task_id, start_time) VALUES (?, ?)',
    [taskId, startTime]
  );
  return result.lastInsertRowId;
};

export const endTaskInstance = async (db: SQLite.SQLiteDatabase, id: number, endTime: number): Promise<void> => {
  await db.runAsync(
    `UPDATE task_instances 
     SET end_time = ?, 
         total_minutes = ROUND((? - start_time) / 60) 
     WHERE id = ?`,
    [endTime, endTime, id]
  );
};

export const getTaskInstances = async (db: SQLite.SQLiteDatabase, taskId?: number): Promise<any[]> => {
  if (taskId) {
    return db.getAllAsync('SELECT * FROM task_instances WHERE task_id = ?', [taskId]);
  } else {
    return db.getAllAsync('SELECT * FROM task_instances');
  }
};

export const deleteTaskInstance = async (db: SQLite.SQLiteDatabase, id: number): Promise<void> => {
  await db.runAsync('DELETE FROM task_instances WHERE id = ?', [id]);
};