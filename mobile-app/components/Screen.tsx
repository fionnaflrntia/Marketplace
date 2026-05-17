import type { ReactNode } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { colors } from "../lib/theme";

type ScreenProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  keyboardVisible?: boolean;
};

export function Screen({ title, subtitle, children, action, keyboardVisible = false }: ScreenProps) {
  const heroHeightAnim = useRef(new Animated.Value(1)).current;
  const heroOpacityAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Cancel previous animation if running
    if (animationRef.current) {
      animationRef.current.stop();
    }

    if (keyboardVisible) {
      animationRef.current = Animated.parallel([
        Animated.timing(heroHeightAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(heroOpacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]);
    } else {
      animationRef.current = Animated.parallel([
        Animated.timing(heroHeightAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(heroOpacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]);
    }

    animationRef.current.start();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [keyboardVisible, heroHeightAnim, heroOpacityAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <Animated.View
        style={[
          styles.hero,
          {
            height: heroHeightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200],
            }),
            opacity: heroOpacityAnim,
          },
        ]}
      >
        <View style={styles.heroGlow} />
        <View style={styles.heroHeader}>
          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>Marketplace</Text>
          </View>
          {action ? <View>{action}</View> : null}
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </Animated.View>

      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    overflow: "hidden",
    borderRadius: 28,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: colors.primaryStrong,
    gap: 12,
    shadowColor: colors.primaryStrong,
    shadowOpacity: 0.16,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  heroGlow: {
    position: "absolute",
    right: -36,
    top: -36,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(217, 207, 181, 0.22)",
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  brandPillText: {
    color: "#fff9ef",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#e7dfc6",
    fontSize: 15,
    lineHeight: 22,
  },
});