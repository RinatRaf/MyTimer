import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import VisibleTimerEvent from "./src/VisibleTimerEvent";
const timer = new VisibleTimerEvent(1709838000000, "8 марта");
const ObservableApp = observer(function App() {
  useEffect(() => () => timer.cleanUp(), []);
  return (
    <View>
      <Text>{timer.timeLeftString}</Text>
    </View>
  );
});

export default ObservableApp;
