import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import ProjectForm from "./ProjectForm";
import BottomNavbar from "./BottomNavbar";
import ProjectList from "./ProjectList";
import { useSQLiteContext } from "expo-sqlite";
import { retrieveActiveProjects } from "../utils/formatted_data_utils";
import { Project } from "../types";

const Projects = () => {
  const db = useSQLiteContext();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await retrieveActiveProjects(db);
      setProjects(fetchedProjects);
    };
    fetchProjects();
  }, [db]);

  const handleAddProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  const handleRenameProject = (id: string, newName: string) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View>
        <Text style={tw`text-2xl font-bold mt-4 text-center`}>Projects</Text>
      </View>
      <View style={tw`flex-1 px-4 mt-4`}>
        <ProjectForm onProjectAdded={handleAddProject} />
        <ProjectList
          projects={projects}
          onRename={handleRenameProject}
          onDelete={handleDeleteProject}
        />
      </View>
      <BottomNavbar />
    </SafeAreaView>
  );
};

export default Projects;
