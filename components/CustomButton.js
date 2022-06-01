import {
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const extractStyleItems = (style, items) => {
  const result = {};

  if (style) {
    for (let i = 0; i < items.length; i++) {
      if (style.length) {
        for (let s = style.length; s >= 0; s--) {
          if (style[s]?.[items[i]] !== undefined) {
            result[items[i]] = style[s][items[i]];
            break;
          }
        }
      } else if (style[items[i]] !== undefined) {
        result[items[i]] = style[items[i]];
      }
    }
  }

  return result;
};

const getStyleItem = (style, item) => {
  if (style) {
    if (style.length) {
      for (let i = style.length - 1; i >= 0; i--) {
        if (style[i]?.[item]) {
          return style[i][item];
        }
      }
    } else {
      return style[item];
    }
  }
};

export default function CustomButton({
  title,
  style,
  onPress,
  disabled,
  ...rest
}) {
  let buttonStyle = {
    ...styles.buttonBody,
    ...extractStyleItems(style, ["backgroundColor"]),
  };

  if (disabled) {
    buttonStyle = { ...buttonStyle, ...styles.buttonDisabled };
  }

  if (extractStyleItems(style, ["textAlign"])?.textAlign === "left") {
    buttonStyle = {
      ...buttonStyle,
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
    };
  }

  let textStyle = {
    ...styles.buttonText,
    ...extractStyleItems(style, ["color", "fontSize", "fontWeight"]),
  };

  const doPress = () => {
    if (!onPress) {
      console.warn("No onPress defined for " + title + " button.");
    } else if (!disabled) {
      onPress();
    }
  };

  const ButtonBody = disabled ? View : TouchableOpacity;

  const mergeStyle = style.length
    ? style.reduce((previous, current) => {
        return { ...previous, ...current };
      }, {})
    : style;

  return (
    <View
      style={{ height: 40, ...mergeStyle, backgroundColor: "transparent" }}
      {...rest}
    >
      <ButtonBody style={[buttonStyle]} onPress={doPress}>
        <Text style={textStyle}>{title}</Text>
      </ButtonBody>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBody: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: Platform.select({
      ios: PlatformColor("link"),
      android: PlatformColor("?android:attr/buttonTint"),
      default: "black",
    }),
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    height: "100%",
  },
  buttonDisabled: {
    backgroundColor: "rgba(128, 128, 128, 0.25)",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
