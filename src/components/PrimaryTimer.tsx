import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import tw from "twrnc";
import { setTime } from "../reducers/timerReducer";
import { retrieveTaskInstanceStartTime } from "../utils/formatted_data_utils";
import { formatTime } from "../utils/time";

const PrimaryTimer = () => {
  const isTracking = useSelector((state) => state.currentTask.isTracking);
  const elapsedTime = useSelector((state) => state.timer.elapsedTime);
  const currentTaskState = useSelector((state) => state.currentTask.task);
  const dispatch = useDispatch();

  const db = useSQLiteContext();

  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTracking) {
      let interval: NodeJS.Timeout;

      const startTimer = async () => {
        try {
          const taskStartTime = await retrieveTaskInstanceStartTime(
            db,
            currentTaskState.t_id
          );

          if (taskStartTime === null) {
            console.error("Failed to retrieve task start time");
            return;
          }

          console.log("Task start time", taskStartTime);

          interval = setInterval(() => {
            const newElapsedTime = Math.floor(
              (Date.now() - taskStartTime) / 1000
            );
            dispatch(setTime(newElapsedTime));
          }, 1000);
        } catch (error) {
          console.error("Error starting timer:", error);
        }
      };

      startTimer();

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [isTracking, dispatch]);

  if (!isTracking) {
    return (
      <View style={tw`font-extrabold text-xl`}>
        <Text style={tw`text-8xl font-extrabold`}>00:00:00</Text>
      </View>
    );
  } else {
    return (
      <View style={tw`font-extrabold text-xl`}>
        <Text style={tw`text-8xl font-extrabold`}>
          {formatTime(elapsedTime)}
        </Text>
      </View>
    );
  }
};

export default PrimaryTimer;
