import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GameProvider } from "./src/context/GameContext";
import { colors } from "./src/theme/colors";

import HomeScreen from "./src/screens/HomeScreen";
import PlayersScreen from "./src/screens/PlayersScreen";
import RolesScreen from "./src/screens/RolesScreen";
import RevealScreen from "./src/screens/RevealScreen";
import NightScreen from "./src/screens/NightScreen";
import DayScreen from "./src/screens/DayScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import RolesInfoScreen from "./src/screens/RolesInfoScreen";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bgAlt,
    text: colors.text,
    border: colors.cardBorder,
    primary: colors.accent,
  },
};

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.bgAlt },
            headerTintColor: colors.text,
            headerBackTitle: "",
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Players" component={PlayersScreen} options={{ title: "Παίκτες" }} />
          <Stack.Screen name="Roles" component={RolesScreen} options={{ title: "Ρόλοι" }} />
          <Stack.Screen
            name="Reveal"
            component={RevealScreen}
            options={{ title: "Αποκάλυψη Ρόλου", headerBackVisible: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Night"
            component={NightScreen}
            options={{ title: "Νύχτα", headerBackVisible: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Day"
            component={DayScreen}
            options={{ title: "Μέρα", headerBackVisible: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="Results"
            component={ResultsScreen}
            options={{ title: "Αποτελέσματα", headerBackVisible: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="RolesInfo"
            component={RolesInfoScreen}
            options={{ title: "Κανόνες Ρόλων" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}
