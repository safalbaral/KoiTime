import React from "react";

import { useState } from "react";
import { TextInput, View } from "react-native";

const TaskBar = () => {
  const [task, setTask] = useState<string>("");

  return (
    <View>
      <TextInput></TextInput>
    </View>
  );
};
