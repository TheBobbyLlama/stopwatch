import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import Store from "./StoreContext";
import { getThemeColor } from "../util/theme";
import { formatTime } from "../util/util";

export default function Split({
  index,
  curSplit,
  prevSplit,
  curSaved,
  prevSaved,
}) {
  const { darkMode } = useContext(Store);

  let totalTime = null;
  let lapTime = null;
  let totalDiff = null;
  let totalDiffGood = false;
  let lapDiff = null;
  let lapDiffGood = false;

  if (curSplit !== null) {
    totalTime = formatTime(curSplit);
    lapTime = formatTime(curSplit - prevSplit);

    if (curSaved !== null) {
      totalDiff = formatTime(curSplit - curSaved);

      if (totalDiff[0].startsWith("-")) {
        totalDiffGood = true;
      } else {
        totalDiff[0] = "+" + totalDiff[0];
      }

      lapDiff = formatTime(curSplit - prevSplit - (curSaved - prevSaved));

      if (lapDiff[0].startsWith("-")) {
        lapDiffGood = true;
      } else {
        lapDiff[0] = "+" + lapDiff[0];
      }
    }
  } else if (curSaved !== null) {
    totalTime = formatTime(curSaved);
    lapTime = formatTime(curSaved - prevSaved);
  }

  const styles = StyleSheet.create({
    splitItem: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    splitIndex: {
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      margin: 4,
      minWidth: "8%",
      paddingRight: 8,
    },
    splitData: {
      alignItems: "center",
      display: "flex",
      flexBasis: 0,
      flexDirection: "row",
      flexGrow: 1,
      justifyContent: "left",
      margin: 4,
    },
    splitIndexText: {
      color: "#808080",
    },
    splitText: {
      color: getThemeColor("text", darkMode),
      fontSize: 18,
    },
    splitMS: {
      color: getThemeColor("text", darkMode),
      fontSize: 16,
    },
    splitGood: {
      color: getThemeColor("splitGood", darkMode),
    },
    splitBad: {
      color: getThemeColor("splitBad", darkMode),
    },

    splitFade: {
      color: "#808080",
    },
  });

  const textStyle = [styles.splitText];
  const msStyle = [styles.splitMS];

  if (curSplit === null) {
    textStyle.push(styles.splitFade);
    msStyle.push(styles.splitFade);
  }

  return (
    <View style={styles.splitItem}>
      <View style={styles.splitIndex}>
        <Text style={styles.splitIndexText}>{index + 1}</Text>
      </View>
      <View style={styles.splitData}>
        <Text style={textStyle}>{lapTime[0]}</Text>
        <Text style={msStyle}>.{lapTime[1]}</Text>
      </View>
      <View style={styles.splitData}>
        {lapDiff !== null ? (
          <>
            <Text
              style={[
                styles.splitText,
                lapDiffGood ? styles.splitGood : styles.splitBad,
              ]}
            >
              {lapDiff[0]}
            </Text>
            <Text
              style={[
                styles.splitMS,
                lapDiffGood ? styles.splitGood : styles.splitBad,
              ]}
            >
              .{lapDiff[1]}
            </Text>
          </>
        ) : null}
      </View>
      <View style={styles.splitData}>
        <Text style={textStyle}>{totalTime[0]}</Text>
        <Text style={msStyle}>.{totalTime[1]}</Text>
      </View>
      <View style={styles.splitData}>
        {totalDiff !== null ? (
          <>
            <Text
              style={[
                styles.splitText,
                totalDiffGood ? styles.splitGood : styles.splitBad,
              ]}
            >
              {totalDiff[0]}
            </Text>
            <Text
              style={[
                styles.splitMS,
                totalDiffGood ? styles.splitGood : styles.splitBad,
              ]}
            >
              .{totalDiff[1]}
            </Text>
          </>
        ) : null}
      </View>
    </View>
  );
}
