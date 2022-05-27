import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "@rneui/base";
import { Icon } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStoreValue from "../hooks/useStoreValue";
import { getThemeColor } from "../util/theme";

export default function Home({ navigation }) {
  const [darkMode] = useStoreValue("darkMode");
  const [events, setEvents] = useStoreValue("events", navigation);
  const [newEvent, setNewEvent] = useState("");

  const styles = StyleSheet.create({
    workspace: {
      backgroundColor: getThemeColor("workspace", darkMode),
      height: "100%",
    },
    eventList: {
      flexGrow: 0,
      marginTop: 2,
    },
    listRow: {
      alignItems: "center",
      backgroundColor: getThemeColor("element", darkMode),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
      marginTop: 2,
      padding: 8,
      paddingLeft: 20,
    },
    listContent: {
      flexGrow: 1,
      fontSize: 20,
    },
    listInput: {
      color: getThemeColor("text", darkMode),
      flexGrow: 1,
      fontSize: 20,
      height: "100%",
    },
  });

  const buttonColor = getThemeColor("button", darkMode);

  const addNewEvent = () => {
    if (newEvent) {
      setEvents([...events, newEvent]);
      setNewEvent("");
    }
  };

  // TODO - Add a confirmation modal!
  const removeEvent = (index) => {
    const updatedEvents = [...events];
    AsyncStorage.removeItem("event:" + events[index]); // Clear the saved splits for the event.
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  const renderEventListing = (event, index) => {
    return (
      <View style={styles.listRow}>
        <Text style={styles.listContent}>{event.item}</Text>
        <Button
          type="clear"
          onPress={() => {
            removeEvent(index);
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
    <SafeAreaView style={styles.workspace}>
      <FlatList
        style={styles.eventList}
        data={events}
        renderItem={renderEventListing}
      />
      <View style={styles.listRow}>
        <TextInput
          style={styles.listInput}
          placeholder="Save a new Event..."
          returnKeyType="done"
          value={newEvent}
          onChangeText={setNewEvent}
        />
        <Button type="clear" disabled={!newEvent} onPress={addNewEvent}>
          <Icon
            name="plus"
            type="antdesign"
            color={!!newEvent ? buttonColor : "rgba(128, 128, 128, 0.5)"}
          />
        </Button>
      </View>
    </SafeAreaView>
  );
}
