import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export function Screen({
  children,
  scroll = true,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
}) {
  const Inner = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <Inner
        style={[{ flex: 1 }]}
        contentContainerStyle={scroll ? [styles.content, style] : undefined}
      >
        {scroll ? children : <View style={[styles.content, { flex: 1 }, style]}>{children}</View>}
      </Inner>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 16 },
});
