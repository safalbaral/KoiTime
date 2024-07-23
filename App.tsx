import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
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
  return (
    <NativeRouter>
      <SQLiteProvider onInit={initDB} databaseName="app.db">
        <Provider store={store}>
          <SafeAreaView style={tw`flex-1 bg-slate-50`}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/tasks/:projectId" element={<TasksView />} />
            </Routes>
            <BottomNavbar />
            <StatusBar style="auto" />
          </SafeAreaView>
        </Provider>
      </SQLiteProvider>
    </NativeRouter>
  );
}
