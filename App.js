import { Button } from "@rneui/base";
import { Icon } from "@rneui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import Home from "./screens/Home";
import Stopwatch from "./screens/Stopwatch";

import useStoreValue from "./hooks/useStoreValue";

import appInfo from "./app.json";

const Stack = createNativeStackNavigator();

export default function App() {
  const [darkMode, setDarkMode] = useStoreValue("darkMode");
  const [events] = useStoreValue("events");

  const headerStyle = darkMode
    ? {
        headerStyle: {
          backgroundColor: "#202020",
        },
        headerTintColor: "#ffffff",
      }
    : {};

  const buttonColor = darkMode ? "#ffffff" : "";

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
