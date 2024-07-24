import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRecentFiveTasks } from "../database/db";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View, FlatList } from "react-native";

import tw from "twrnc";

const RecentTasksList = () => {
  // Get list of most recent tasks
  const db = useSQLiteContext();
  const isTracking = useSelector((state) => state.currentTask.isTracking);
  const [topFive, setTopFive] = useState([]);

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const tasks = await getRecentFiveTasks(db);
        const filteredTasks = tasks.filter((task) => task.end_time !== null);
        setTopFive(filteredTasks);
      } catch (error) {
        console.error("Error fetching recent tasks:", error);
      }
    };

    fetchRecentTasks();
  }, [isTracking]);

  const renderTaskItem = ({ item }) => (
    <View
      style={tw`bg-slate-50 rounded-2xl shadow-md shadow-slate-500 flex flex-row mb-2 overflow-hidden mx-2`}
    >
      <View style={tw`flex flex-3 gap-5 bg-slate-300 p-4 justify-between`}>
        <View>
          <Text
            style={tw`font-semibold text-lg text-slate-800`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.task_name}
          </Text>
        </View>
        <View style={tw`flex flex-row justify-between`}>
          <View style={tw`bg-slate-100 rounded-full p-2 self-start flex-row`}>
            <View
              style={tw`w-4 h-4 rounded-full mr-3`}
              backgroundColor={item.project_color}
            />
            <Text
              style={tw`font-semibold text-xs text-slate-500`}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.project_name}
            </Text>
          </View>
          <Text
            style={tw`text-slate-500 font-bold bg-slate-100 self-start rounded-full p-2 text-xs`}
          >
            {item.total_minutes} minutes
          </Text>
        </View>
      </View>
      <View style={tw`flex-1 p-4 justify-center`}>
        <Text style={tw`text-slate-500`}>From</Text>
        <Text style={tw`text-slate-500 font-bold`}>
          {new Date(item.end_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text style={tw`text-slate-500`}>To</Text>
        <Text style={tw`text-slate-500 font-bold`}>
          {item.end_time
            ? new Date(item.end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Ongoing"}
        </Text>
      </View>
    </View>
  );

  /*
  const renderTaskItem = ({ item }) => (
    <View
      style={tw`border-0 bg-teal-50 rounded flex flex-col mb-2 overflow-hidden`}
    >
      <View style={tw`flex-1 p-2 border-r flex-row`}>
        <Text style={tw`font-semibold`} numberOfLines={1} ellipsizeMode="tail">
          {item.task_name}
        </Text>
      </View>
      <View style={tw`flex-shrink-0 p-2 border-r`}>
        <Text style={tw`text-xs`}>{item.project_name || "N/A"}</Text>
      </View>
      <View style={tw`flex-shrink-0 p-2 border-r max-w-18`}>
        <Text style={tw`text-xs`}>
          {item.end_time
            ? new Date(item.end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Ongoing"}
        </Text>
      </View>
      <View style={tw`flex-shrink-0 p-2`}>
        <Text style={tw`text-xs`}>{item.total_minutes}m</Text>
      </View>
    </View>
  );
*/
  return (
    <View style={tw`flex-1`}>
      <View>
        <Text style={tw`text-center text-lg py-2`}>Recent Tasks</Text>
      </View>
      <FlatList
        data={topFive}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.task_instance_id.toString()}
        ListEmptyComponent={
          <Text style={tw`text-center`}>No tasks tracked yet. </Text>
        }
      />
    </View>
  );
};

export default RecentTasksList;
