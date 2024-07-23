import React from "react";
import { View, Text, Pressable } from "react-native";
import { useNavigate, useLocation } from "react-router-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", icon: "home-outline", label: "Home" },
    { path: "/projects", icon: "list-outline", label: "Projects" },
    { path: "/statistics", icon: "stats-chart-outline", label: "Statistics" },
  ];

  return (
    <View style={tw`absolute bottom-4 left-4 right-4`}>
      <View
        style={tw`flex-row justify-around items-center bg-slate-900 py-3 rounded-full shadow-lg`}
      >
        {navItems.map((item) => (
          <Pressable
            key={item.path}
            style={tw`flex-1 items-center`}
            onPress={() => navigate(item.path)}
          >
            <View
              style={tw`${
                location.pathname === item.path
                  ? "bg-slate-500 py-3 px-5 rounded-full"
                  : ""
              }`}
            >
              <Ionicons
                name={item.icon}
                size={16}
                color={location.pathname === item.path ? "#ffffff" : "#94a3b8"}
              />
            </View>
            <Text
              style={tw`${
                location.pathname === item.path ? "text-white" : "text-gray-400"
              } text-xs mt-1`}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default BottomNavbar;
