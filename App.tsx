import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { Provider } from 'react-redux';
import store from './src/store';
import Main from './src/components/Main';

import { initDB } from './src/database/db';
import { SQLiteProvider } from 'expo-sqlite';

export default function App() {
  return (
    <SQLiteProvider onInit={initDB} databaseName='app.db'>
      <Provider store={store}>
        <SafeAreaView style={styles.container}>
          <Main />
          <StatusBar style="auto" /> 
        </SafeAreaView>
      </Provider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
