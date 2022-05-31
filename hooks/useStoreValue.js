import { useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

function getDefaultValue(key) {
  switch (key) {
    case "darkMode":
      return true;
    case "events":
      return [];
    default:
      if (key.startsWith("event:")) {
        return [];
      } else {
        return null;
      }
  }
}

export default function useStoreValue(storeKey) {
  const defaultValue = getDefaultValue(storeKey);
  const [item, setItemState] = useState(defaultValue);
  const { getItem, setItem, removeItem } = useAsyncStorage(storeKey);

  const loadItemFromStore = () => {
    getItem()
      .then((itemData) => {
        const itemStore = itemData ? JSON.parse(itemData) : defaultValue;
        setItemState(itemStore);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const changeItem = (newVal) => {
    setItemState(newVal);
    setItem(JSON.stringify(newVal));
  };

  useEffect(() => {
    loadItemFromStore();
  }, []);

  return [item, changeItem, removeItem];
}
