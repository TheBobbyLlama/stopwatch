import { Platform, PlatformColor } from "react-native";

export function getThemeColor(key, darkMode) {
  switch (key) {
    case "button":
      return darkMode
        ? "white"
        : Platform.select({
            ios: PlatformColor("link"),
            android: PlatformColor("?android:attr/buttonTint"),
            default: "black",
          });
    case "element":
      return darkMode ? "#202020" : "white";
    case "header":
      return darkMode ? "#303030" : "white";
    case "inputBorder":
      return darkMode ? "#808080" : "#c0c0c0";
    case "text":
      return darkMode ? "white" : "black";
    case "workspace":
      return darkMode ? "black" : "#808080";
    default:
      return "#ff0000";
  }
}
