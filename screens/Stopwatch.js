import { useContext, useEffect, useState } from "react";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import {
  Button as SimpleButton,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button } from "@rneui/base";
import CustomButton from "../components/CustomButton";
import { useRoute } from "@react-navigation/native";
import useStoreValue from "../hooks/useStoreValue";
import { getThemeColor } from "../util/theme";
import Store from "../components/StoreContext";

const padStart = (str, len, char) => {
  while (str.length < len) {
    str = char + str;
  }

  return str;
};

const formatTime = (elapsedTime) => {
  // ==== Extract time components ====
  const elapsedMS = elapsedTime % 1000;
  elapsedTime = (elapsedTime - elapsedMS) / 1000;
  // Extract seconds
  const elapsedSeconds = elapsedTime % 60;
  elapsedTime = (elapsedTime - elapsedSeconds) / 60;
  // Extract minutes
  const elapsedMinutes = elapsedTime % 60;
  // Extract hours
  const elapsedHours = (elapsedTime - elapsedMinutes) / 60;

  //console.log(elapsedHours, elapsedMinutes, elapsedSeconds, elapsedMS);

  // ==== Generate displayed value ====
  let timeDisplay = "";

  if (elapsedHours > 0) {
    timeDisplay =
      elapsedHours +
      ":" +
      padStart(elapsedMinutes.toString(), 2, "0") +
      ":" +
      padStart(elapsedSeconds.toString(), 2, "0");
  } else if (elapsedMinutes > 0) {
    timeDisplay =
      elapsedMinutes.toString() +
      ":" +
      padStart(elapsedSeconds.toString(), 2, "0");
  } else {
    timeDisplay = elapsedSeconds.toString();
  }

  const msDisplay = padStart(Math.floor(elapsedMS / 10).toString(), 2, "0");

  return [timeDisplay, msDisplay];
};

export default function Stopwatch() {
  const eventName = useRoute().name.split(": ").slice(1).join(": ");
  const { darkMode } = useContext(Store);
  const [savedSplits, setSavedSplits, clearSavedSplits] = useStoreValue(
    "event:" + eventName
  );
  // Timer functionality.
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [active, setActive] = useState(false);
  const [splits, setSplits] = useState([]);

  useEffect(() => {
    let tick;

    if (active) {
      tick = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    }

    if (active) {
      activateKeepAwake(); // Don't let the screen sleep while the timer is running.
    } else {
      deactivateKeepAwake();
    }

    return () => {
      clearInterval(tick);
    };
  }, [active]);

  const doStartSplit = () => {
    // Start the timer
    if (!active) {
      setStartTime(Date.now() - elapsedTime);
      setActive(true);
    } else {
      // Or record a split
      setSplits([...splits, elapsedTime]);
    }
  };

  const doStopReset = () => {
    // Stop the timer
    if (active) {
      setActive(false);
    } else {
      // Or reset time to zero
      setElapsedTime(0);
    }
  };

  const styles = StyleSheet.create({
    workspace: {
      backgroundColor: getThemeColor("workspace", darkMode),
      height: "100%",
    },
    stopwatch: {
      alignItems: "stretch",
      backgroundColor: getThemeColor("element", darkMode),
      borderRadius: 8,
      margin: 10,
      paddingHorizontal: 32,
      paddingVertical: 16,
    },
    showTime: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    time: {
      color: getThemeColor("text", darkMode),
      fontSize: 36,
    },
    timeMS: {
      color: getThemeColor("text", darkMode),
      fontSize: 28,
      minWidth: 36,
    },
    buttonStart: {
      alignItems: "stretch",
      display: "flex",
      marginVertical: 16,
      height: 100,
    },
  });

  const [displayTime, displayMS] = formatTime(elapsedTime);

  return (
    <SafeAreaView style={styles.workspace}>
      <View style={styles.stopwatch}>
        <View style={styles.showTime}>
          <Text style={styles.time}>{displayTime}.</Text>
          <Text style={styles.timeMS}>{displayMS}</Text>
        </View>
        <CustomButton
          title={active ? "Split" : "Start"}
          style={styles.buttonStart}
          backgroundColor={getThemeColor(
            active ? "buttonSplit" : "buttonStart",
            darkMode
          )}
          onPress={doStartSplit}
        />
        <CustomButton
          title={active ? "Stop" : "Reset"}
          backgroundColor={getThemeColor(
            active ? "buttonStop" : "buttonReset",
            darkMode
          )}
          onPress={doStopReset}
          disabled={!elapsedTime}
        />
      </View>
    </SafeAreaView>
  );
}
