import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "./components/StoreContext";

import Root from "./components/Root";

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider>
        <Root />
      </Provider>
    </SafeAreaProvider>
  );
}
