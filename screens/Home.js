import { Text, View } from "react-native";
import useStoreValue from "../hooks/useStoreValue";

export default function Home({ navigation }) {
  const [events, setEvents] = useStoreValue("events", navigation);

  return (
    <View>
      <Text>Hello World!</Text>
    </View>
  );
}
