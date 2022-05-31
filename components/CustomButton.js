import {
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CustomButton({
  title,
  backgroundColor,
  onPress,
  disabled,
  ...rest
}) {
  const buttonStyles = [styles.buttonBody];

  if (backgroundColor) buttonStyles.push({ backgroundColor });
  if (disabled) buttonStyles.push(styles.buttonDisabled);

  const doPress = () => {
    if (!onPress) {
      console.warn("No onPress defined for " + title + " button.");
    } else if (!disabled) {
      onPress();
    }
  };

  const ButtonBody = disabled ? View : TouchableOpacity;

  return (
    <View style={{ height: 40 }} {...rest}>
      <ButtonBody style={buttonStyles} onPress={doPress}>
        <Text style={styles.buttonText}>{title}</Text>
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
    backgroundColor: "rgba(128, 128, 128, 0.5)",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
