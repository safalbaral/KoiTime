import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { Task, TaskInstance, Project } from "../types";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getTasks,
  getTaskInstances,
  getProject,
  deleteTask,
} from "../database/db";
import { useParams } from "react-router-native";

const TaskItem: React.FC<{ task: Task }> = ({ task, handleTaskDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [instances, setInstances] = useState<TaskInstance[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    const fetchInstances = async () => {
      if (expanded) {
        const fetchedInstances = await getTaskInstances(db, task.id);
        setInstances(fetchedInstances);
      }
    };
    fetchInstances();
  }, [expanded, db, task.id]);

  const totalTime = instances.reduce(
    (sum, instance) => sum + (instance.total_minutes || 0),
    0
  );
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  return (
    <View style={tw`flex flex-row w-full items-center`}>
      <View
        style={tw`flex-5 mb-4 bg-slate-50 rounded-lg shadow-sm shadow-slate-600 overflow-hidden`}
      >
        <TouchableOpacity
          style={tw`flex-row items-center justify-between p-4`}
          onPress={() => setExpanded(!expanded)}
        >
          <Text style={tw`text-lg font-semibold text-slate-800`}>
            {task.name}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#4b5563"
          />
        </TouchableOpacity>
        {expanded && (
          <View style={tw`px-4 pb-4`}>
            <Text style={tw`text-sm font-medium text-slate-600 mb-2`}>
              Total time: {hours}h {minutes}m
            </Text>
            <ScrollView style={tw`max-h-60`}>
              {instances.map((instance) => (
                <View
                  key={instance.id}
                  style={tw`flex-row justify-between py-2 border-b border-gray-200`}
                >
                  <Text style={tw`text-slate-800`}>
                    {new Date(instance.start_time).toLocaleString()}
                  </Text>
                  <Text style={tw`text-slate-600`}>
                    {Math.floor(instance.total_minutes / 60)}h{" "}
                    {instance.total_minutes % 60}m
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
      <Pressable
        onPress={() => handleTaskDelete(task.id)}
        style={tw`flex-1 ml-4 bg-red-500 rounded-full self-center px-2 py-2 shadow-md border-0 shadow-slate-600`}
      >
        <View>
          <Text style={tw`text-center text-slate-100`}>Delete</Text>
        </View>
      </Pressable>
    </View>
  );
};

/*
interface TasksViewProps {
  projectId: number;
}
*/

const TasksView = () => {
  const { stringProjectId } = useParams<{ projectId: string }>();
  const projectId = parseInt(stringProjectId, 10);
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTasks, fetchedProject] = await Promise.all([
          getTasks(db, projectId),
          getProject(db, projectId),
        ]);
        setTasks(fetchedTasks);
        setProject(fetchedProject);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [db, projectId]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleTaskDelete = async (id: number) => {
    try {
      await deleteTask(db, id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      Alert.alert("Error", "Unable to delete task, please try again.");
      console.error("Error while performing task deletion: ", error);
    }
  };

  const totalTime = tasks.reduce(
    (sum, task) => sum + (task.total_minutes || 0),
    0
  );
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Text style={tw`text-2xl font-bold mb-4 text-slate-800 text-center mt-4`}>
        {project?.name || "Project Tasks"}
      </Text>
      <View
        style={tw`bg-slate-300 p-4 mb-4 rounded-lg shadow-lg shadow-slate-600 mx-2 items-center self-center`}
      >
        <Text style={tw`text-lg font-semibold text-slate-800`}>Total Time</Text>
        <Text style={tw`text-xl font-bold text-slate-600`}>
          {hours}h {minutes}m
        </Text>
      </View>
      <ScrollView>
        <View style={tw`p-4`}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleTaskDelete={handleTaskDelete}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TasksView;
