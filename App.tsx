import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Keyboard,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import store from "./src/store";
import Main from "./src/components/Main";
import Projects from "./src/components/Projects";
import { initDB } from "./src/database/db";
import { SQLiteProvider } from "expo-sqlite";
import tw from "twrnc";
import { NativeRouter, Route, Routes } from "react-router-native";
import Statistics from "./src/components/Statistics";
import BottomNavbar from "./src/components/BottomNavbar";
import TasksView from "./src/components/TasksView";

export default function App() {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <NativeRouter>
      <SafeAreaProvider>
        <SQLiteProvider onInit={initDB} databaseName="app.db">
          <Provider store={store}>
            <SafeAreaView style={tw`flex-1 bg-slate-50`}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
              >
                <View style={tw`flex-1`}>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/tasks/:projectId" element={<TasksView />} />
                  </Routes>
                </View>
              </KeyboardAvoidingView>
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <BottomNavbar />
              </Animated.View>
              <StatusBar style="auto" />
            </SafeAreaView>
          </Provider>
        </SQLiteProvider>
      </SafeAreaProvider>
    </NativeRouter>
  );
}
