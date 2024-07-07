import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigate, useLocation } from "react-router-native";
import tw from "twrnc";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <View style={tw`absolute bottom-4 left-4 right-4`}>
      <View
        style={tw`flex-row justify-around items-center bg-slate-800 py-3 rounded-full shadow-lg`}
      >
        <Pressable
          style={tw`flex-1 items-center`}
          onPress={() => navigate("/")}
        >
          <View
            style={tw`${
              location.pathname === "/"
                ? "bg-blue-500 px-6 py-2 rounded-full"
                : ""
            }`}
          >
            <Text
              style={tw`${
                location.pathname === "/" ? "text-white" : "text-gray-400"
              } font-semibold`}
            >
              Home
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={tw`flex-1 items-center`}
          onPress={() => navigate("/projects")}
        >
          <View
            style={tw`${
              location.pathname === "/projects"
                ? "bg-blue-500 px-6 py-2 rounded-full"
                : ""
            }`}
          >
            <Text
              style={tw`${
                location.pathname === "/projects"
                  ? "text-white"
                  : "text-gray-400"
              } font-semibold`}
            >
              Projects
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default BottomNavbar;
