import { View, Text } from "react-native";
import TaskBar from "./TaskBar";
import TaskStatistics from "./TaskStatistics";
import RecentTasksList from "./RecentTasksList";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";

const Main = () => {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1 items-center pb-4`}>
        <Text>AppTitle</Text>
      </View>
      <View style={tw`flex-1`}>
        <View style={tw`flex items-center`}>
          <TaskStatistics />
          <TaskBar />
        </View>
        <RecentTasksList />
      </View>
    </SafeAreaView>
  );
};

export default Main;
