import { createContext } from "react";
import useStoreValue from "../hooks/useStoreValue";

const Store = createContext();

function Provider({ children }) {
  const [darkMode, setDarkMode] = useStoreValue("darkMode");
  const [events, setEvents] = useStoreValue("events");

  return (
    <Store.Provider
      value={{
        darkMode,
        setDarkMode,
        events,
        setEvents,
      }}
    >
      {children}
    </Store.Provider>
  );
}

export default Store;
export { Provider };
