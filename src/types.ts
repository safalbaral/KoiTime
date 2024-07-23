export interface Project {
  id: number;
  name: string;
  color: string;
}

export interface DropdownItem {
  name: string;
  value: string;
}

export interface Task {
  id: number;
  name: string;
  project_id: number;
  duration: number; // in minutes
  total_minutes?: number | null;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
}

export interface TaskInstance {
  id: number;
  task_id: number;
  start_time: number; // Unix timestamp
  end_time: number | null; // Unix timestamp, null if ongoing
  total_minutes: number | null; // null if ongoing
}
