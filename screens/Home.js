import { useContext, useState } from "react";
import {
  Button as SimpleButton,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "@rneui/base";
import { Icon } from "@rneui/themed";
import CustomButton from "../components/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Store from "../components/StoreContext";
import { getThemeColor } from "../util/theme";

import appInfo from "../app.json";

export default function Home({ navigation }) {
  const { darkMode, events, setEvents } = useContext(Store);
  const [newEvent, setNewEvent] = useState("");
  const [deleteEvent, setDeleteEvent] = useState(-1);

  const buttonColor = getThemeColor("button", darkMode);
  const textStyle = { color: getThemeColor("text", darkMode) };
  const elementStyle = { backgroundColor: getThemeColor("element", darkMode) };

  const addNewEvent = () => {
    if (newEvent) {
      setEvents([...events, newEvent]);
      setNewEvent("");
    }
  };

  const removeEvent = () => {
    const updatedEvents = [...events];
    AsyncStorage.removeItem("event:" + events[deleteEvent]); // Clear the saved splits for the event.
    updatedEvents.splice(deleteEvent, 1);
    setEvents(updatedEvents);
    setDeleteEvent(-1);
  };

  const renderEventListing = ({ item, index }) => {
    return (
      <View style={[styles.listRow, elementStyle]}>
        <CustomButton
          title={item}
          style={[
            styles.listContent,
            { color: getThemeColor("button", darkMode) },
          ]}
          onPress={() => {
            navigation.navigate(appInfo.expo.name + ": " + events[index]);
          }}
        />
        <Button
          type="clear"
          onPress={() => {
            setDeleteEvent(index);
          }}
        >
          <Icon
            name="trash-can-outline"
            type="material-community"
            color={buttonColor}
          />
        </Button>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.workspace,
        { backgroundColor: getThemeColor("workspace", darkMode) },
      ]}
    >
      <Modal animationType="fade" transparent={true} visible={deleteEvent > -1}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, elementStyle]}>
            <Text style={[styles.modalText, textStyle]}>
              Delete "{events[deleteEvent]}" Event?
            </Text>
            <View style={styles.modalButtonRow}>
              <SimpleButton
                style={styles.modalButton}
                title="Delete"
                onPress={removeEvent}
              />
              <SimpleButton
                style={styles.modalButton}
                title="Cancel"
                onPress={() => {
                  setDeleteEvent(-1);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        style={styles.eventList}
        data={events}
        renderItem={renderEventListing}
      />
      <View style={[styles.listRow, elementStyle]}>
        <TextInput
          style={[styles.listInput, textStyle]}
          placeholder="Save a new Event..."
          placeholderTextColor="rgba(128, 128, 128, 0.75)"
          returnKeyType="done"
          maxLength={30}
          value={newEvent}
          onChangeText={setNewEvent}
        />
        <Button type="clear" disabled={!newEvent} onPress={addNewEvent}>
          <Icon
            name="plus"
            type="antdesign"
            color={!!newEvent ? buttonColor : "rgba(128, 128, 128, 0.1)"}
          />
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    height: "100%",
    justifyContent: "center",
  },
  modalView: {
    alignItems: "center",
    borderRadius: 8,
    elevation: 5,
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 20,
    marginTop: 8,
    textAlign: "center",
  },
  modalButtonRow: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  modalButton: {
    margin: 4,
  },
  workspace: {
    height: "100%",
  },
  eventList: {
    flexGrow: 0,
    marginTop: 2,
  },
  listRow: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    marginTop: 2,
    padding: 8,
    paddingLeft: 20,
  },
  listContent: {
    backgroundColor: "transparent",
    flexGrow: 1,
    fontSize: 20,
    textAlign: "left",
  },
  listInput: {
    flexGrow: 1,
    fontSize: 20,
    height: "100%",
  },
});
