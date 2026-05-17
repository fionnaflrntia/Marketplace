import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ProductCard } from "../components/ProductCard";
import { AppScreen as Screen } from "../components/AppScreen";
import { AuthError, fetchWithToken, hasStoredToken, removeStoredToken } from "../lib/auth";
import type { Product } from "../lib/types";
import { colors } from "../lib/theme";

export default function ProductsScreen() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithToken("/items");

      if (!response.ok) {
        throw new Error("Unable to load products");
      }

      const data = (await response.json()) as Product[];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err instanceof AuthError && err.statusCode === 401) {
        router.replace("/login" as never);
        return;
      }

      setItems([]);
      setError(err instanceof Error ? err.message : "Unable to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const ensureAuth = async () => {
      const tokenExists = await hasStoredToken();

      if (!isMounted) {
        return;
      }

      if (!tokenExists) {
        router.replace("/login" as never);
        return;
      }

      await loadProducts();
    };

    void ensureAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await removeStoredToken();
    router.replace("/login" as never);
  };

  return (
    <Screen
      title="Product catalog"
      subtitle="Browse the same product API used by the web app, optimized for mobile cards and thumb-friendly taps."
      action={
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      }
    >
      <View style={styles.toolbar}>
        <Text style={styles.toolbarLabel}>All products</Text>
        <Pressable onPress={loadProducts} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>Couldn’t load products</Text>
          <Text style={styles.stateMessage}>{error}</Text>
          <Pressable onPress={loadProducts} style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Try again</Text>
          </Pressable>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.stateCard}>
          <Text style={styles.stateTitle}>No products yet</Text>
          <Text style={styles.stateMessage}>The catalog is empty right now. Check back soon.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ProductCard product={item} onPress={() => router.push(`/product/${item._id}` as never)} />}
          scrollEnabled={true}
          style={{ flex: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  toolbarLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  refreshButton: {
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.line,
  },
  refreshButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  logoutButton: {
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 42,
    gap: 12,
  },
  loadingText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "600",
  },
  stateCard: {
    gap: 10,
    borderRadius: 24,
    padding: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
  },
  stateMessage: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryAction: {
    alignSelf: "flex-start",
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
});