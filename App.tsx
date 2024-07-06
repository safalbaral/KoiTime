import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { Provider } from "react-redux";

import store from "./src/store";
import Main from "./src/components/Main";

import { initDB } from "./src/database/db";
import { SQLiteProvider } from "expo-sqlite";

import tw from "twrnc";

export default function App() {
  return (
    <SQLiteProvider onInit={initDB} databaseName="app.db">
      <Provider store={store}>
        <SafeAreaView style={tw`flex-1 justify-center items-center`}>
          <Main />
          <StatusBar style="auto" />
        </SafeAreaView>
      </Provider>
    </SQLiteProvider>
  );
}
