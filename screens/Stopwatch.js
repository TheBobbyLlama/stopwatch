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

  const textStyle = { color: getThemeColor("text", darkMode) };
  const elementStyle = { backgroundColor: getThemeColor("element", darkMode) };

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
    setElapsedTime(0);
  };

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
    <SafeAreaView
      style={[
        styles.workspace,
        { backgroundColor: getThemeColor("workspace", darkMode) },
      ]}
    >
      <View style={[styles.stopwatch, elementStyle]}>
        <View style={styles.showTime}>
          <Text style={[styles.time, textStyle]}>{displayTime}</Text>
          <Text style={[styles.timeMS, textStyle]}>.{displayMS}</Text>
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
          style={[
            styles.buttonStart,
            {
              backgroundColor: getThemeColor(
                active ? "buttonSplit" : "buttonStart",
                darkMode
              ),
            },
          ]}
          onPress={doStartSplit}
        />
        <CustomButton
          title={active ? "Stop" : "Reset"}
          style={{
            backgroundColor: getThemeColor(
              active ? "buttonStop" : "buttonReset",
              darkMode
            ),
          }}
          onPress={doStopReset}
          disabled={!elapsedTime}
        />
      </View>
      {splitData.length ? (
        <View style={[styles.splitView, elementStyle]}>
          <Text style={[styles.splitTitle, textStyle]}>Splits</Text>
          <FlatList data={splitData} renderItem={renderSplit} />
          {eventName && !active && splits.length ? (
            <Button title="Save" onPress={saveSplits} />
          ) : null}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  workspace: {
    height: "100%",
  },
  stopwatch: {
    alignItems: "stretch",
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
    fontSize: 48,
  },
  timeMS: {
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
    borderRadius: 8,
    margin: 10,
    marginTop: 0,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  splitTitle: {
    alignSelf: "center",
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
