import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { Ion } from "@expo/vector-icons";
import { DropdownItem } from "../types";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface DropdownProps {
  selectedItemName: string;
  onSelectItem: (name: string) => void;
  items: DropdownItem[];
  icon?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  selectedItemName,
  onSelectItem,
  items,
  icon,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      style={tw`flex-row items-center p-3`}
      onPress={() => {
        onSelectItem(item.name);
        setModalVisible(false);
      }}
    >
      <View
        style={tw`w-6 h-6 rounded-full mr-3`}
        backgroundColor={item.value}
      />
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const selectedItemObj = items.find((c) => c.name === selectedItemName);

  return (
    <View>
      <TouchableOpacity
        style={tw`bg-slate-100 rounded-full py-3 px-4 flex-row items-center`}
        onPress={() => setModalVisible(true)}
      >
        {icon ? (
          <Ionicons name={"briefcase-outline"} size={18} />
        ) : (
          <View
            style={[tw`rounded-full w-4 h-4 mr-3`]}
            backgroundColor={selectedItemObj?.value}
          />
        )}
        <Text
          style={[tw`ml-2 text-slate-800 max-w-18`]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {selectedItemName}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-end mx-4`}>
          <View style={tw`bg-white rounded-t-lg p-4 shadow-lg`}>
            <Text style={tw`text-lg font-semibold mb-2`}>Select Below</Text>
            <FlatList
              data={items}
              renderItem={renderDropdownItem}
              keyExtractor={(item) => item.name}
            />
            <TouchableOpacity
              style={tw`mt-4 bg-gray-200 p-2 rounded-md items-center`}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Dropdown;
