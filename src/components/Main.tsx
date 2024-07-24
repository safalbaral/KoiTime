import React from "react";
import { View, Text, Image } from "react-native";
import TaskBar from "./TaskBar";
import RecentTasksList from "./RecentTasksList";
import tw from "twrnc";
import PrimaryTimer from "./PrimaryTimer";

const Main = () => {
  return (
    <View style={[tw`flex-1`]}>
      <View
        style={tw`flex flex-row gap-2 items-center bg-slate-50 self-center rounded-2xl px-4 pb-4 shadow-md shadow-blue-600`}
      >
        <Image
          style={tw`w-8 h-8 mt-4`}
          source={require("../../assets/icon.png")}
          resizeMode="contain"
        />
        <Text style={tw`text-2xl text-center mt-4 text-slate-900 font-bold`}>
          Koi Time
        </Text>
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
    </View>
  );
};

export default Main;
