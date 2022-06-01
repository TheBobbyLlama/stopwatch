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

  const goodStyle = {
    color: getThemeColor("splitGood", darkMode),
  };
  const badStyle = {
    color: getThemeColor("splitBad", darkMode),
  };

  let totalTime = null;
  let lapTime = null;
  let totalDiff = null;
  let totalDiffStyle = badStyle;
  let lapDiff = null;
  let lapDiffStyle = badStyle;

  if (curSplit !== null) {
    totalTime = formatTime(curSplit);
    lapTime = formatTime(curSplit - prevSplit);

    if (curSaved !== null) {
      totalDiff = formatTime(curSplit - curSaved);

      if (totalDiff[0].startsWith("-")) {
        totalDiffStyle = goodStyle;
      } else {
        totalDiff[0] = "+" + totalDiff[0];
      }

      lapDiff = formatTime(curSplit - prevSplit - (curSaved - prevSaved));

      if (lapDiff[0].startsWith("-")) {
        lapDiffStyle = goodStyle;
      } else {
        lapDiff[0] = "+" + lapDiff[0];
      }
    }
  } else if (curSaved !== null) {
    totalTime = formatTime(curSaved);
    lapTime = formatTime(curSaved - prevSaved);
  }

  const textStyle = [
    styles.splitText,
    { color: getThemeColor("text", darkMode) },
  ];
  const msStyle = [styles.splitMS, { color: getThemeColor("text", darkMode) }];

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
        <Text style={textStyle}>{totalTime[0]}</Text>
        <Text style={msStyle}>.{totalTime[1]}</Text>
      </View>
      <View style={styles.splitData}>
        {totalDiff !== null ? (
          <>
            <Text style={[styles.splitText, totalDiffStyle]}>
              {totalDiff[0]}
            </Text>
            <Text style={[styles.splitMS, totalDiffStyle]}>
              .{totalDiff[1]}
            </Text>
          </>
        ) : null}
      </View>
      <View style={styles.splitData}>
        <Text style={textStyle}>+{lapTime[0]}</Text>
        <Text style={msStyle}>.{lapTime[1]}</Text>
      </View>
      <View style={styles.splitData}>
        {lapDiff !== null ? (
          <>
            <Text style={[styles.splitText, lapDiffStyle]}>{lapDiff[0]}</Text>
            <Text style={[styles.splitMS, lapDiffStyle]}>.{lapDiff[1]}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
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
    alignItems: "flex-end",
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
    fontSize: 18,
  },
  splitMS: {
    fontSize: 16,
  },
  splitFade: {
    color: "#808080",
  },
});
