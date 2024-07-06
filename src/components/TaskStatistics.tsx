import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Text, View } from "react-native";

import {
  TimerStates,
  incrementTimer,
  resetTimer,
} from "../reducers/timerReducer";
import { useEffect, useRef } from "react";
import tw from "twrnc";

const TaskStatistics = () => {
  const isTracking = useSelector((state) => state.currentTask.isTracking);
  const elapsedTime = useSelector((state) => state.timer.elapsedTime);
  const currentTaskState = useSelector((state) => state.currentTask.task);
  const dispatch = useDispatch();

  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTracking) {
      intervalTimerRef.current = setInterval(
        () => dispatch(incrementTimer()),
        1000
      );
    } else {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    }

    // Cleanup code that's why it's wrapped in a function
    return () => {
      dispatch(resetTimer());
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, [isTracking]);

  //TODO: Compelte the Project Placeholder part belod
  if (isTracking) {
    return (
      <View style={tw`flex flex-row justify-around`}>
        <Text>{currentTaskState.name}</Text>
        <Text>{elapsedTime}</Text>
        <Text>Project</Text>
      </View>
    );
  } else {
    return null;
  }
};

export default TaskStatistics;
