import React from "react";

import { useState } from "react";
import { TextInput, View, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import TaskBarButtons from "./TaskBarButtons";
import tw from "twrnc";

const TaskBar = () => {
  const [task, onChangeTask] = useState<string>("");
  return (
    <View
      style={tw`flex flex-row bg-slate-50 rounded-full shadow-lg shadow-slate-600`}
    >
      <TextInput
        onChangeText={onChangeTask}
        placeholder="Write down a task to track!"
        style={tw`px-4 py-2`}
      ></TextInput>
      <TaskBarButtons task={task} />
    </View>
  );
};

export default TaskBar;
