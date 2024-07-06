import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import tw from "twrnc";
import { useSQLiteContext } from "expo-sqlite";

import {
  getTask,
  getTasks,
  createTask,
  createTaskInstance,
  endTaskInstance,
  getTaskInstances,
} from "../database/db";
import {
  addCurrentTask,
  CurrentTaskDetails,
  removeCurrentTask,
} from "../reducers/currentTaskReducer";
import timerReducer, {
  TimerStates,
  startState,
  stopState,
} from "../reducers/timerReducer";

const TaskBarButtons = ({ task }) => {
  const dispatch = useDispatch();
  const timerState = useSelector((state) => state.timer.timerState);
  const currentTaskState = useSelector((state) => state.currentTask.task);
  const db = useSQLiteContext();

  const handleTracking = async () => {
    /* CASE IF WE WANT TO ADD A TASK & START TRACKING: ie. IF THE TIMER STATE IS STOPPED ON PRESS*/
    if (timerState === TimerStates.stopped) {
      // Check if name = name & proj = proj of task exist in db
      const taskInDB = await getTask(db, task);
      let id;
      taskInDB === null
        ? (id = await createTask(db, task, 1))
        : (id = taskInDB.id); // TODO: Change the proj_id value when projects are implemented!

      // Create a new task instance
      const startTime = Date.now();
      const t_id = await createTaskInstance(db, id, startTime);

      // Format payload
      const taskToAdd: CurrentTaskDetails = {
        id: id,
        name: task,
        t_id: t_id,
      };

      // Finally dispatch the task and set timer starte to start
      dispatch(addCurrentTask(taskToAdd));
      dispatch(startState());
    } else if (timerState === TimerStates.started) {
      const t_id = currentTaskState.t_id;

      const endTime = Date.now();

      await endTaskInstance(db, t_id, endTime);

      dispatch(removeCurrentTask());
      dispatch(stopState());
    }
    console.log('WHAT"S IN THE DB AFTER THIS', await getTasks(db));
    console.log("TASK INSTANCES", await getTaskInstances(db));
  };

  return (
    <View style={tw`flex flex-row`}>
      <Pressable onPress={handleTracking}>
        <View>
          <Ionicons
            name={
              timerState === TimerStates.stopped
                ? "play-outline"
                : "pause-outline"
            }
            size={24}
          />
        </View>
      </Pressable>
      <Pressable>
        <View style={tw`flex flex-row`}>
          <Ionicons name="briefcase-outline" size={24} />
          <Text>Choose Project</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default TaskBarButtons;
