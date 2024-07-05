import React from "react";
import { useRef, useEffect } from "react";
import { TextInput, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";

import { StyleSheet } from "react-native";
import theme from "./theme";
import { startTimer, pauseTimer, incrementTimer } from "../reducers/timerReducer";
import { TimerState } from "../reducers/timerReducer";
import timerUtil from '../utils/timerUtil'
import TrackingStatistics from "./TrackingStatistics";

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
    // Components, runningtaskinfo ?

    const intervalRef = timerUtil.getIntervalRef()
    const dispatch = useDispatch()
    const timerState = useSelector(state => state.timer.state)
    const elapsedTime = useSelector(state => state.timer.elapsedTime)

    useEffect(() => {
        timerUtil.handleTimerStateChange(timerState, intervalRef, dispatch)
    }, [timerState])

    const buttonClicked = () => {
        timerState === TimerState.running ? dispatch(pauseTimer()) : dispatch(startTimer())
    }

    return (
        <SafeAreaView  style={styles.mainContainer}>
            <TrackingStatistics />
            <View style={styles.taskBar}>
                <TextInput style={styles.taskBarInput} placeholder="Enter project to track..."></TextInput>
                <Pressable onPress={buttonClicked} style={styles.taskBarButton}>
                    <View>
                        <Ionicons name={timerState === TimerState.running ? "pause-outline" : "play-outline"} size={24} color={theme.colors.accent} />
                    </View>
                </Pressable>
                <Pressable onPress={buttonClicked} style={styles.taskBarButton}>
                    <View>
                        <Ionicons name='stop-outline' size={24} color={theme.colors.accent} />
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default TaskTrackerBar