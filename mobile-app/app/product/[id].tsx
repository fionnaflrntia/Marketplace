import { useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { Image } from "expo-image";
import { AppScreen as Screen } from "../../components/AppScreen";
import { AuthError, fetchWithToken, hasStoredToken } from "../../lib/auth";
import type { Product } from "../../lib/types";
import { formatRupiah } from "../../utils/currency";
import { colors } from "../../lib/theme";

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const productId = typeof params.id === "string" ? params.id : undefined;
  const [item, setItem] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadItem = async () => {
      if (!productId) {
        setError("Missing product ID");
        setIsLoading(false);
        return;
      }

      try {
        const tokenExists = await hasStoredToken();

        if (!tokenExists) {
          router.replace("/login" as never);
          return;
        }

        const response = await fetchWithToken(`/items/${productId}`);

        if (!response.ok) {
          throw new Error("Unable to load product details");
        }

        const data = (await response.json()) as Product;

        if (isMounted) {
          setItem(data);
        }
      } catch (err) {
        if (err instanceof AuthError && err.statusCode === 401) {
          router.replace("/login" as never);
          return;
        }

        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load product details");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadItem();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return (
    <Screen
      title="Product detail"
      subtitle="A focused detail screen that keeps the action area clear and easy to reach on a phone."
      action={
        <Link href={"/products" as never} asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </Link>
      }
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16, gap: 12 }} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading product...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Product unavailable</Text>
            <Text style={styles.stateMessage}>{error}</Text>
            <Link href={"/products" as never} style={styles.inlineLink}>
              Return to products
            </Link>
          </View>
        ) : item ? (
          <View style={styles.detailCard}>
            <View style={styles.imageFrame}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>No image</Text>
                </View>
              )}
            </View>

            <View style={styles.content}>
              <View style={styles.topRow}>
                <View style={styles.categoryChip}>
                  <Text style={styles.categoryChipText}>{item.category}</Text>
                </View>
                <Text style={styles.stockText}>{item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}</Text>
              </View>

              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatRupiah(item.price)}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{item.description || "No description available."}</Text>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>Stock</Text>
                  <Text style={styles.metaValue}>{item.stock}</Text>
                </View>
                <View style={styles.metaCard}>
                  <Text style={styles.metaLabel}>Category</Text>
                  <Text style={styles.metaValue}>{item.category}</Text>
                </View>
              </View>

              <Link href={"/products" as never} asChild>
                <Pressable style={styles.primaryAction}>
                  <Text style={styles.primaryActionText}>Back to product list</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backButtonText: {
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
  inlineLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  detailCard: {
    gap: 16,
    borderRadius: 28,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.primaryStrong,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  imageFrame: {
    height: 320,
    borderRadius: 24,
    backgroundColor: colors.softTint,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    color: colors.muted,
    fontWeight: "700",
  },
  content: {
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  categoryChip: {
    borderRadius: 999,
    backgroundColor: colors.softTint,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryChipText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  stockText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  name: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
  },
  price: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  description: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
  },
  metaCard: {
    flex: 1,
    gap: 4,
    borderRadius: 18,
    backgroundColor: "#fbfaf7",
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  metaValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  primaryAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});