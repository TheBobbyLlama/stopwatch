import { Provider } from "./components/StoreContext";

import Root from "./components/Root";

export default function App() {
  return (
    <Provider>
      <Root />
    </Provider>
  );
}
