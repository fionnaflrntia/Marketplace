import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatRupiah } from "../utils/currency";
import type { Product } from "../lib/types";
import { colors } from "../lib/theme";

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.imageFrame}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>No image</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.rowBetween}>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{product.category}</Text>
          </View>
          <Text style={styles.stockText}>{product.stock > 0 ? `${product.stock} left` : "Sold out"}</Text>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description || "No description available."}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatRupiah(product.price)}</Text>
          <Text style={styles.tapHint}>Tap for details</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: colors.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.primaryStrong,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },
  imageFrame: {
    height: 210,
    backgroundColor: colors.softTint,
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
  body: {
    padding: 16,
    gap: 10,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
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
    fontWeight: "600",
  },
  name: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "800",
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  price: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "800",
  },
  tapHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
});