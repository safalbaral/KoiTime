import React from "react"
import { View, Text } from "react-native"
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";

import theme from "./theme";
import store from "../store";

import TaskTrackerBar from "./TaskTrackerBar";
import ProjectListView from "./ProjectListView";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center'
    },
  });

const Main = () => {
    // Components: TaskTrackerBar, PreviouslyTrackedTasksBar, WidgetsBar
    return (
        <Provider store={store}>
            <View style={styles.container}>
                <TaskTrackerBar />
                <ProjectListView />
            </View>
        </Provider>
    )
}

export default Main