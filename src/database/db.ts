import * as SQLite from "expo-sqlite";

//const DB_NAME = "myapp.db";

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
export const createProject = async (
  db: SQLite.SQLiteDatabase,
  name: string,
  isArchived: boolean
): Promise<number> => {
  //const db = await SQLite.openDatabaseAsync(DB_NAME);
  const result = await db.runAsync(
    "INSERT INTO projects (name, is_archived) VALUES (?, ?)",
    [name, isArchived ? 1 : 0]
  );
  return result.lastInsertRowId;
};

export const getProjects = async (
  db: SQLite.SQLiteDatabase
): Promise<any[]> => {
  return db.getAllAsync("SELECT * FROM projects");
};

export const updateProject = async (
  db: SQLite.SQLiteDatabase,
  id: number,
  name: string,
  isArchived: boolean
): Promise<void> => {
  await db.runAsync(
    "UPDATE projects SET name = ?, is_archived = ? WHERE id = ?",
    [name, isArchived ? 1 : 0, id]
  );
};

export const deleteProject = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> => {
  await db.runAsync("DELETE FROM projects WHERE id = ?", [id]);
};

// Tasks CRUD operations
export const createTask = async (
  db: SQLite.SQLiteDatabase,
  name: string,
  projectId: number
): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO tasks (name, project_id) VALUES (?, ?)",
    [name, projectId]
  );
  return result.lastInsertRowId;
};

export const getTasks = async (
  db: SQLite.SQLiteDatabase,
  projectId?: number
): Promise<any[]> => {
  if (projectId) {
    return db.getAllAsync("SELECT * FROM tasks WHERE project_id = ?", [
      projectId,
    ]);
  } else {
    return db.getAllAsync("SELECT * FROM tasks");
  }
};

// TODO: Add project ID param
export const getTask = async (
  db: SQLite.SQLiteDatabase,
  taskName: string
): Promise<any> => {
  return db.getFirstAsync("SELECT * FROM tasks WHERE name = ?", [taskName]);
};

export const updateTask = async (
  db: SQLite.SQLiteDatabase,
  id: number,
  name: string,
  projectId: number
): Promise<void> => {
  await db.runAsync("UPDATE tasks SET name = ?, project_id = ? WHERE id = ?", [
    name,
    projectId,
    id,
  ]);
};

export const deleteTask = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> => {
  await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
};

// Task Instances CRUD operations
export const createTaskInstance = async (
  db: SQLite.SQLiteDatabase,
  taskId: number,
  startTime: number
): Promise<number> => {
  const result = await db.runAsync(
    "INSERT INTO task_instances (task_id, start_time) VALUES (?, ?)",
    [taskId, startTime]
  );
  return result.lastInsertRowId;
};

export const endTaskInstance = async (
  db: SQLite.SQLiteDatabase,
  id: number,
  endTime: number
): Promise<void> => {
  await db.runAsync(
    `UPDATE task_instances 
SET end_time = ?, 
    total_minutes = ROUND(CAST(? - start_time AS BIGINT) / 60000.0, 2)
WHERE id = ?`,
    [endTime, endTime, id]
  );
};

export const getTaskInstances = async (
  db: SQLite.SQLiteDatabase,
  taskId?: number
): Promise<any[]> => {
  if (taskId) {
    return db.getAllAsync("SELECT * FROM task_instances WHERE task_id = ?", [
      taskId,
    ]);
  } else {
    return db.getAllAsync("SELECT * FROM task_instances");
  }
};

export const deleteTaskInstance = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> => {
  await db.runAsync("DELETE FROM task_instances WHERE id = ?", [id]);
};

export const getRecentFiveTasks = async (
  db: SQLite.SQLiteDatabase
): Promise<any[]> => {
  const result = await db.getAllAsync(`
                                      SELECT
                                        ti.id AS task_instance_id,
                                        t.id AS task_id,
                                        t.name AS task_name,
                                        p.name AS project_name,
                                        ti.start_time,
                                        ti.end_time,
                                        ti.total_minutes
                                      FROM
                                        task_instances ti
                                      JOIN
                                        tasks t ON ti.task_id = t.id
                                      LEFT JOIN
                                        projects p ON t.project_id = p.id
                                      WHERE
                                        ti.end_time IS NOT NULL
                                      ORDER BY
                                        ti.end_time DESC
                                      LIMIT 5;
                                    `);
  return result;
};
