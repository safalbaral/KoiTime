import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { Project } from "../types";
import {
  archiveProject,
  renameProject,
  retrieveActiveProjects,
} from "../utils/formatted_data_utils";
import { useSQLiteContext } from "expo-sqlite";

interface ProjectListProps {
  projects: Project[];
  onRename: (id: number, newName: string) => void;
  onDelete: (id: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onRename,
  onDelete,
}) => {
  const db = useSQLiteContext();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleDeleteProject = async (id: number) => {
    try {
      await archiveProject(db, id);
      onDelete(id);
    } catch (error) {
      Alert.alert("Error", "Failed to archive project. Please try again.");
      console.error("Error adding project:", error);
    }
  };

  const handleRenameProject = async (id: number, editName: string) => {
    try {
      const activeProjects = await retrieveActiveProjects(db);
      if (activeProjects.filter((project) => project.name === editName)) {
        Alert.alert(
          "Error",
          "Another project already exists with the same name. Please try again."
        );
      } else {
        await renameProject(db, id, editName);
        onRename(id, editName);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to rename project. Please try again.");
      console.error("Error renaming project:", error);
    }
  };

  const renderProject = ({ item }: { item: Project }) => {
    const isEditing = editingId === item.id;

    return (
      <View
        style={tw`bg-slate-50 rounded-full shadow-sm shadow-slate-600 mb-3 flex-row items-center justify-between px-4 py-3`}
      >
        <View style={tw`flex-row items-center flex-1`}>
          <View
            style={[
              tw`w-4 h-4 rounded-full mr-3`,
              { backgroundColor: item.color.toLowerCase() },
            ]}
          />
          {isEditing ? (
            <TextInput
              style={tw`flex-1 text-slate-800`}
              value={editName}
              onChangeText={setEditName}
              autoFocus
            />
          ) : (
            <Text style={tw`text-slate-800 font-medium flex-1`}>
              {item.name}
            </Text>
          )}
        </View>
        <View style={tw`flex-row`}>
          {isEditing ? (
            <TouchableOpacity
              onPress={() => {
                handleRenameProject(item.id, editName);
                setEditingId(null);
              }}
              style={tw`mr-4`}
            >
              <Ionicons name="checkmark" size={24} color="#3b82f6" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setEditingId(item.id);
                setEditName(item.name);
              }}
              style={tw`mr-4`}
            >
              <Ionicons name="pencil" size={24} color="#3b82f6" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleDeleteProject(item.id)}>
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`mt-6`}>
      <Text style={tw`text-xl font-bold mb-4 text-slate-800`}>
        Current Projects
      </Text>
      <FlatList
        data={projects}
        renderItem={renderProject}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`px-4`}
      />
    </View>
  );
};

export default ProjectList;
