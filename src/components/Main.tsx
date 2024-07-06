import { Text, View } from "react-native";
import TaskBar from "./TaskBar";
import TaskStatistics from "./TaskStatistics";

const Main = () => {
  return (
    <View>
      <TaskStatistics />
      <TaskBar />
    </View>
  );
};

export default Main;
