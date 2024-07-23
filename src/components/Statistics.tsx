import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { ProjectWithTasks } from "../types";
import { retrieveActiveProjectsWithTasks } from "../utils/formatted_data_utils";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";

const StatisticsItem: React.FC<{ project: ProjectWithTasks }> = ({
  project,
}) => {
  const [expanded, setExpanded] = useState(false);

  const totalTime = project.tasks.reduce((sum, task) => sum + task.duration, 0);
  const hours = Math.floor(totalTime / 60);
  const minutes = totalTime % 60;

  return (
    <View style={tw`mb-4 bg-white rounded-lg shadow-sm overflow-hidden`}>
      <TouchableOpacity
        style={tw`flex-row items-center justify-between p-4`}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`w-4 h-4 rounded-full mr-3`}
            backgroundColor={project.color}
          />
          <Text style={tw`text-lg font-semibold text-slate-800`}>
            {project.name}
          </Text>
        </View>
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
            {project.tasks.map((task) => (
              <View
                key={task.id}
                style={tw`flex-row justify-between py-2 border-b border-gray-200`}
              >
                <Text style={tw`text-slate-800`}>{task.name}</Text>
                <Text style={tw`text-slate-600`}>
                  {Math.floor(task.duration / 60)}h {task.duration % 60}m
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const Statistics: React.FC = () => {
  const db = useSQLiteContext();
  const [projects, setProjects] = useState<ProjectWithTasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await retrieveActiveProjectsWithTasks(db);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [db]);

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Text style={tw`text-2xl font-bold mb-4 text-slate-800 text-center mt-4`}>
        Statistics
      </Text>
      <ScrollView>
        <View style={tw`p-4`}>
          {projects.map((project) => (
            <StatisticsItem key={project.id} project={project} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Statistics;
