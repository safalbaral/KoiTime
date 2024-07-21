import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { Ion } from "@expo/vector-icons";
import { DropdownItem } from "../types";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface DropdownProps {
  icon?: IoniconsName;
  selectedItemName: string;
  onSelectItem: (name: string) => void;
  items: DropdownItem[];
}

const Dropdown: React.FC<DropdownProps> = ({
  selectedItemName,
  onSelectItem,
  icon,
  items,
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
          <View>
            <Ionicons name={icon} size={24} />
          </View>
        ) : (
          <View
            style={tw`w-6 h-6 rounded-full mr-3`}
            backgroundColor={selectedItemObj?.value}
          />
        )}
        <Text style={tw`text-slate-800`}>{selectedItemName}</Text>
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
