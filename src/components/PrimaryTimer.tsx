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
      <View style={tw`bg-slate-50 p-5 rounded-full shadow-lg shadow-slate-600`}>
        <Text style={tw`text-7xl font-extrabold text-slate-800 mt-2`}>
          00:00:00
        </Text>
      </View>
    );
  } else {
    return (
      <View style={tw`bg-slate-50 p-5 rounded-full shadow-lg shadow-slate-600`}>
        <Text style={tw`text-7xl font-extrabold text-slate-800 mt-2`}>
          {formatTime(elapsedTime)}
        </Text>
      </View>
    );
  }
};

export default PrimaryTimer;
