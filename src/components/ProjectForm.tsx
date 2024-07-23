import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import tw from "twrnc";
import Dropdown from "./Dropdown";
import { createProject } from "../database/db";
import { useSQLiteContext } from "expo-sqlite";
import { Colors } from "../constants/constants";

interface ProjectFormProps {
  onProjectAdded: (project: {
    id: string;
    name: string;
    color: string;
  }) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectAdded }) => {
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState("Red");
  const db = useSQLiteContext();

  const handleAddProject = async () => {
    try {
      const projectID = await createProject(
        db,
        projectName,
        false,
        Colors.find(
          (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
        ) !== undefined
          ? Colors.find(
              (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
            ).value
          : "#FFFF"
        //TODO: Fix messy logic above
      );

      const newProject = {
        id: projectID,
        name: projectName,
        color: selectedColor,
      };

      console.log("NEW PROJ", newProject);

      onProjectAdded(newProject);

      // Reset form
      setProjectName("");
      setSelectedColor("Red");
    } catch (error) {
      Alert.alert("Error", "Failed to add project. Please try again.");
      console.error("Error adding project:", error);
    }
  };

  return (
    <View style={tw`mt-4 px-4`}>
      <View style={tw`bg-slate-50 rounded-xl shadow-md shadow-slate-600 p-4`}>
        <TextInput
          style={tw`bg-slate-100 rounded-full py-3 px-4 mb-4 text-slate-800`}
          placeholder="Project Name"
          placeholderTextColor="#94a3b8"
          value={projectName}
          onChangeText={setProjectName}
        />
        <Dropdown
          selectedItemName={selectedColor}
          onSelectItem={setSelectedColor}
          items={Colors}
        />
        <TouchableOpacity
          style={tw`bg-slate-700 rounded-full py-3 items-center mt-4`}
          onPress={handleAddProject}
        >
          <Text style={tw`text-white font-semibold`}>Add Project</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProjectForm;
