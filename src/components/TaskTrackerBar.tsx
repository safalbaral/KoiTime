import React from "react";
import { useState } from "react";
import { TextInput, View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import theme from "./theme";
import TrackingStatistics from "./TrackingStatistics";
import BarButtons from "./BarButtons";

const styles = StyleSheet.create(
    {
        taskBar : {
            display: 'flex',
            flexDirection: 'row'
        },
        taskBarInput: {
            borderWidth: 1,
            padding: 5,
            minWidth: 230,
            borderRadius: 5,
            borderColor: theme.colors.primary
        },
        taskBarButton: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 40,
            borderColor: theme.colors.primary,
            borderWidth: 1
        },
        mainContainer: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.colors.background,
            borderRadius: 10,
            elevation: 5, // TODO: Make IOS compatible
            padding: 10
        }
    }
)

const TaskTrackerBar = () => {
    const dispatch = useDispatch()
    const projects = useSelector(state => state.projects.projects)

    const [projectName, setProjectName] = useState<String>('') 

    const handleProjectName = (name: String): void => {
        setProjectName(name)
    }

    return (
        <SafeAreaView  style={styles.mainContainer}>
            <TrackingStatistics />
            <View style={styles.taskBar}>
                <TextInput style={styles.taskBarInput} onChangeText={handleProjectName} placeholder="Enter project to track..."></TextInput>
                <BarButtons projects={projects} projectName={projectName} styles={styles}/>
            </View>
        </SafeAreaView>
    )
}

export default TaskTrackerBar