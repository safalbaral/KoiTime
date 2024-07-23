import React from "react";
import { View, Text } from "react-native";
import TaskBar from "./TaskBar";
import RecentTasksList from "./RecentTasksList";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryTimer from "./PrimaryTimer";

const Main = () => {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <View>
        <Text style={tw`text-xl font-semibold text-center mt-4`}>AppTitle</Text>
      </View>
      <View style={tw`flex-1 rounded-t-full`}>
        <View style={tw`flex-1`}>
          <View style={tw`flex-1 justify-center items-center`}>
            <PrimaryTimer />
          </View>
          <View style={tw`items-center mb-8`}>
            <TaskBar />
          </View>
        </View>
        <View style={tw`flex-1`}>
          <RecentTasksList />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Main;
