import { Ionicons } from "@expo/vector-icons"
import { View, Pressable } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { pauseTimer, startTimer, TimerState } from "../reducers/timerReducer"
import theme from "./theme"
import React, { useEffect } from "react"
import { ProjectPayload, stopTrackingProject, ProjectCreationPayload, createProject, startTrackingProject } from "../reducers/projectReducer"
import projectsUtil from "../utils/projectsUtil"
import timeHelper from "../utils/timeHelper"
import timerUtil from "../utils/timerUtil"



const BarButtons = ({projects, projectName, styles}) => {
    const timerState = useSelector(state => state.timer.state)
    const dispatch = useDispatch()
    const intervalRef = timerUtil.getIntervalRef() // Reference for the interval timer that counts the seconds
    
    useEffect(() => {
        timerUtil.handleTimerStateChange(timerState, intervalRef, dispatch)
    }, [timerState])

    const buttonClicked = (): void => {
        // TODO: Implement saving the project to the projects store
        if (timerState === TimerState.running) {
            dispatch(pauseTimer())
            const projectPayload:ProjectPayload = {
                // TODO: Implement better logic below!
                currentTime: timeHelper.getCurrentTime()
            }
            dispatch(stopTrackingProject(projectPayload))
        } else if (timerState === TimerState.paused ){
            dispatch(startTimer())
            const projectPayload:ProjectCreationPayload = {
                id: projectsUtil.getNewID(projects),
                name: projectName,
                currentTime: timeHelper.getCurrentTime()
            }
            dispatch(createProject(projectPayload))
            console.log('Proj payload for dispatch', projectPayload)
            dispatch(startTrackingProject(projectPayload))
        }
        timerState === TimerState.running ? dispatch(pauseTimer()) : dispatch(startTimer())
    }

    return (
            <View>
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
    )
}

export default BarButtons