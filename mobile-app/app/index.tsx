import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { router } from "expo-router";
import { getStoredToken } from "../lib/auth";
import { colors } from "../lib/theme";

export default function Index() {
  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const token = await getStoredToken();

      if (!isMounted) {
        return;
      }

      router.replace((token ? "/products" : "/login") as never);
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.bg,
        padding: 24,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ marginTop: 12, color: colors.muted, fontSize: 16, fontWeight: "600" }}>
        Checking session...
      </Text>
    </View>
  );
}
