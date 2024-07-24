import {
  getProject,
  getProjects,
  getTaskInstances,
  getTasks,
  updateProject,
} from "../database/db";
import * as SQLite from "expo-sqlite";
import { Project, ProjectWithTasks, Task } from "../types";

export const archiveProject = async (
  db: SQLite.SQLiteDatabase,
  id: number
): Promise<void> => {
  const project = await getProject(db, id);
  await updateProject(db, id, project.name, 1);
};

export const renameProject = async (
  db: SQLite.SQLiteDatabase,
  id: number,
  name: string
): Promise<void> => {
  const project = await getProject(db, id);
  await updateProject(db, id, project.name, 0);
};

export const retrieveActiveProjects = async (
  db: SQLite.SQLiteDatabase
): Promise<Project[]> => {
  const projects = await getProjects(db);
  return projects.filter((project) => project.is_archived == 0);
};

export const retrieveActiveProjectsWithTasks = async (
  db: SQLite.SQLiteDatabase
): Promise<ProjectWithTasks[]> => {
  try {
    // Fetch all projects
    const allProjects: Project[] = await getProjects(db);

    // Filter out archived projects
    const nonArchivedProjects = allProjects.filter(
      (project) => !project.is_archived
    );

    const projectsWithTasks: ProjectWithTasks[] = await Promise.all(
      nonArchivedProjects.map(async (project) => {
        // Fetch tasks for each project
        const tasks: any[] = await getTasks(db, project.id);

        // Fetch and process task instances for each task
        const tasksWithInstances: Task[] = await Promise.all(
          tasks.map(async (task) => {
            const taskInstances = await getTaskInstances(db, task.id);
            // Calculate total duration from task instances
            const totalDuration = taskInstances.reduce((sum, instance) => {
              return sum + (instance.total_minutes || 0);
            }, 0);
            return {
              id: task.id.toString(),
              name: task.name,
              duration: totalDuration,
            };
          })
        );

        return {
          ...project,
          tasks: tasksWithInstances,
        };
      })
    );

    return projectsWithTasks;
  } catch (error) {
    console.error("Error retrieving projects with tasks:", error);
    throw error;
  }
};

export const retrieveProjectsWithTasks = async (
  db: SQLite.SQLiteDatabase
): Promise<ProjectWithTasks[]> => {
  try {
    // Fetch all projects
    const projects: Project[] = await getProjects(db);

    const projectsWithTasks: ProjectWithTasks[] = await Promise.all(
      projects.map(async (project) => {
        // Fetch tasks for each project
        const tasks: any[] = await getTasks(db, project.id);

        // Fetch and process task instances for each task
        const tasksWithInstances: Task[] = await Promise.all(
          tasks.map(async (task) => {
            const taskInstances = await getTaskInstances(db, task.id);

            // Calculate total duration from task instances
            const totalDuration = taskInstances.reduce((sum, instance) => {
              return sum + (instance.total_minutes || 0);
            }, 0);

            return {
              id: task.id.toString(),
              name: task.name,
              duration: totalDuration,
            };
          })
        );

        return {
          ...project,
          tasks: tasksWithInstances,
        };
      })
    );

    return projectsWithTasks;
  } catch (error) {
    console.error("Error retrieving projects with tasks:", error);
    throw error;
  }
};

export const retrieveProjectsWithColors = async (
  db: SQLite.SQLiteDatabase
): Promise<Array<{ name: string; value: string }>> => {
  try {
    const projects = await db.getAllAsync(
      "SELECT name, color FROM projects WHERE is_archived = 0"
    );

    return projects.map((project) => ({
      name: project.name,
      value: project.color,
    }));
  } catch (error) {
    console.error("Error retrieving projects with colors:", error);
    throw error;
  }
};

export const retrieveTaskInstanceStartTime = async (
  db: SQLite.SQLiteDatabase,
  taskInstanceId: number
): Promise<number | null> => {
  try {
    const result = await db.getFirstAsync(
      "SELECT start_time FROM task_instances WHERE id = ?",
      [taskInstanceId]
    );

    if (result) {
      return result.start_time;
    } else {
      console.log(`No task instance found with id ${taskInstanceId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving task instance start time:`, error);
    throw error;
  }
};

export const getProjectID = async (
  db: SQLite.SQLiteDatabase,
  projectName: string
): Promise<{ id: number }> => {
  try {
    const result = await db.getFirstAsync(
      "SELECT id FROM projects WHERE name = ?",
      projectName
    );

    return result;
  } catch (error) {
    console.error("Error retrieving project id:", error);
    throw error;
  }
};
