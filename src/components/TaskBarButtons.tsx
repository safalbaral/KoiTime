import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, View, Text, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import tw from "twrnc";
import { useSQLiteContext } from "expo-sqlite";
import Dropdown from "./Dropdown";
import {
  getProjectID,
  retrieveProjectsWithColors,
} from "../utils/formatted_data_utils";

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
import { resetTimer } from "../reducers/timerReducer";

const TaskBarButtons = ({ task }) => {
  const dispatch = useDispatch();
  const isTracking = useSelector((state) => state.currentTask.isTracking);
  const currentTaskState = useSelector((state) => state.currentTask.task);
  const [projectsWithColors, setProjectsWithColors] = useState([{}]);
  const [selectedProject, setSelectedProject] = useState(""); // TODO: Because this works through the project name, need to implement validation in project form that doesn't allow user to create an active project with same names
  const db = useSQLiteContext();

  useEffect(() => {
    const updateProjects = async (): Promise<void> => {
      const projs = await retrieveProjectsWithColors(db);
      setProjectsWithColors(projs);
      setSelectedProject(projs[0].name);
    };
    updateProjects();
  }, []);

  const handleTracking = async () => {
    if (task === "") {
      Alert.alert(
        "Error",
        "Please enter a task name before starting tracking."
      );
    } else {
      /* CASE IF WE WANT TO ADD A TASK & START TRACKING: ie. IF THE TIMER STATE IS STOPPED ON PRESS*/
      if (!isTracking) {
        // Check if name = name & proj = proj of task exist in db
        const taskInDB = await getTask(db, task); //TODO" IMPLEMENT SOON! getTask doesn't check for project equality
        let project_id = await getProjectID(db, selectedProject);
        console.log("PROJ ID", project_id.id);
        let id;
        taskInDB === null
          ? (id = await createTask(db, task, project_id.id))
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
      } else {
        const t_id = currentTaskState.t_id;

        const endTime = Date.now();

        await endTaskInstance(db, t_id, endTime);

        dispatch(removeCurrentTask());
        dispatch(resetTimer());
      }
    }
  };

  return (
    <View
      style={tw`flex flex-row items-center ml-2 bg-slate-100 px-4 py-2 rounded-l-full rounded-r-full`}
    >
      <Pressable onPress={handleTracking}>
        <View>
          <Ionicons
            name={!isTracking ? "play-outline" : "pause-outline"}
            size={24}
          />
        </View>
      </Pressable>
      <Pressable>
        <View style={tw`flex flex-row border-l-2 ml-2 border-slate-200`}>
          <Dropdown
            selectedItemName={selectedProject}
            onSelectItem={setSelectedProject}
            items={projectsWithColors}
            icon={true}
          />
        </View>
      </Pressable>
    </View>
  );
};

export default TaskBarButtons;
