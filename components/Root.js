import { useContext } from "react";
import { Button } from "@rneui/base";
import { Icon } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import Store from "./StoreContext";
import Home from "../screens/Home";
import Stopwatch from "../screens/Stopwatch";

import { getThemeColor } from "../util/theme";

import appInfo from "../app.json";

const Stack = createNativeStackNavigator();

export default function Root() {
  const { darkMode, setDarkMode, events } = useContext(Store);

  const headerStyle = {
    headerStyle: {
      backgroundColor: getThemeColor("header", darkMode),
    },
    headerTintColor: getThemeColor("text", darkMode),
    headerBackTitleStyle: {
      color: getThemeColor("button", darkMode),
    },
  };

  const buttonColor = getThemeColor("headerButton", darkMode);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={appInfo.expo.name}
          screenOptions={headerStyle}
        >
          <Stack.Screen
            name={appInfo.expo.name + " Home"}
            component={Home}
            options={({ navigation }) => ({
              headerLeft: () => (
                <Button
                  type="clear"
                  onPress={() => {
                    navigation.navigate("Stopwatch");
                  }}
                >
                  <Icon name="timer" type="material" color={buttonColor} />
                </Button>
              ),
              headerRight: () => (
                <Button
                  type="clear"
                  onPress={() => {
                    setDarkMode(!darkMode);
                  }}
                >
                  <Icon
                    name="theme-light-dark"
                    type="material-community"
                    color={buttonColor}
                  />
                </Button>
              ),
            })}
          />
          <Stack.Screen name="Stopwatch" component={Stopwatch} />
          {events.map((eventName) => {
            return (
              <Stack.Screen
                name={appInfo.expo.name + ": " + eventName}
                key={eventName}
                component={Stopwatch}
              />
            );
          })}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={darkMode ? "light" : "dark"} />
    </>
  );
}
