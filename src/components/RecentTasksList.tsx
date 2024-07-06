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
    <View style={tw`border rounded flex flex-row mb-2 overflow-hidden`}>
      <View style={tw`flex-1 p-2 border-r`}>
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

  return (
    <View style={tw`flex-1 w-full px-2`}>
      <Text style={tw`text-base text-center`}>Recent Tasks</Text>
      <FlatList
        data={topFive}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.task_instance_id.toString()}
        ListEmptyComponent={<Text>No recent tasks found.</Text>}
      />
    </View>
  );
};

export default RecentTasksList;
