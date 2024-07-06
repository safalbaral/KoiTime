import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRecentFiveTasks } from "../database/db";
import { useSQLiteContext } from "expo-sqlite";
import { Text, View, FlatList, StyleSheet } from "react-native";

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
        setTopFive(tasks);
      } catch (error) {
        console.error("Error fetching recent tasks:", error);
      }
    };

    fetchRecentTasks();
  }, [isTracking]);

  const renderTaskItem = ({ item }) => (
    <View style={tw`border rounded w-full`}>
      <Text>{item.task_name}</Text>
      <Text>Project: {item.project_name || "N/A"}</Text>
      <Text>Start: {new Date(item.start_time).toLocaleString()}</Text>
      <Text>
        End:{" "}
        {item.end_time ? new Date(item.end_time).toLocaleString() : "Ongoing"}
      </Text>
      <Text>Duration: {item.total_minutes} minutes</Text>
    </View>
  );

  return (
    <View style={tw`flex justify-top items-center`}>
      <Text style={tw`text-base`}>Recent Tasks</Text>
      <FlatList
        data={topFive}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.task_id.toString()}
        ListEmptyComponent={<Text>No recent tasks found.</Text>}
      />
    </View>
  );
};

export default RecentTasksList;
