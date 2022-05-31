import { useContext, useEffect, useState } from "react";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import Split from "../components/Split";

import { useRoute } from "@react-navigation/native";
import useStoreValue from "../hooks/useStoreValue";
import Store from "../components/StoreContext";
import { getThemeColor } from "../util/theme";
import { formatTime } from "../util/util";

export default function Stopwatch() {
  const eventName = useRoute().name.split(": ").slice(1).join(": ");
  const { darkMode } = useContext(Store);
  const [savedSplits, setSavedSplits] = useStoreValue("event:" + eventName);
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
      setSplits([]);
    }
  };

  const saveSplits = () => {
    setSavedSplits(splits);
    setSplits([]);
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
      alignItems: "flex-end",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 16,
    },
    time: {
      color: getThemeColor("text", darkMode),
      fontSize: 48,
    },
    timeMS: {
      color: getThemeColor("text", darkMode),
      fontSize: 40,
      minWidth: 60,
      paddingBottom: 3,
    },
    buttonStart: {
      alignItems: "stretch",
      display: "flex",
      marginVertical: 16,
      height: 100,
    },
    splitView: {
      backgroundColor: getThemeColor("element", darkMode),
      borderRadius: 8,
      margin: 10,
      paddingHorizontal: 32,
      paddingVertical: 16,
    },
    splitTitle: {
      alignSelf: "center",
      color: getThemeColor("text", darkMode),
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    splitPreview: {
      alignItems: "flex-end",
      display: "flex",
      flexDirection: "row",
      height: 28,
    },
  });

  const renderSplit = ({ item, index }) => {
    return <Split index={index} {...item} />;
  };

  const [displayTime, displayMS] = formatTime(elapsedTime);

  const splitData = [];

  for (let i = 0; i < Math.max(splits.length, savedSplits.length); i++) {
    const result = {
      curSplit: null,
      prevSplit: null,
      curSaved: null,
      prevSaved: null,
    };

    if (i < splits.length) {
      result.curSplit = splits[i];
      result.prevSplit = i > 0 ? splits[i - 1] : 0;
    }

    if (i < savedSplits.length) {
      result.curSaved = savedSplits[i];
      result.prevSaved = i > 0 ? savedSplits[i - 1] : 0;
    }

    splitData.push(result);
  }

  return (
    <SafeAreaView style={styles.workspace}>
      <View style={styles.stopwatch}>
        <View style={styles.showTime}>
          <Text style={styles.time}>{displayTime}</Text>
          <Text style={styles.timeMS}>.{displayMS}</Text>
        </View>
        <View style={styles.splitPreview}>
          {splits.length
            ? renderSplit({
                index: splits.length - 1,
                item: splitData[splits.length - 1],
              })
            : null}
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
      {splitData.length ? (
        <View style={styles.splitView}>
          <Text style={styles.splitTitle}>Splits</Text>
          <FlatList data={splitData} renderItem={renderSplit} />
          {eventName && !active && splits.length ? (
            <Button title="Save" onPress={saveSplits} />
          ) : null}
        </View>
      ) : null}
    </SafeAreaView>
  );
}
