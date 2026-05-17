import { useEffect, useRef, useState } from "react";
import { Link, router } from "expo-router";
import { ActivityIndicator, Animated, Keyboard, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions, NativeEventSubscription } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppScreen as Screen } from "../components/AppScreen";
import { FormField } from "../components/FormField";
import { login, saveToken, AuthError } from "../lib/auth";
import { colors } from "../lib/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();

  const buttonTranslateY = useRef(new Animated.Value(0)).current;

  // Track actual content height as form renders
  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  // Keyboard animation with real content measurement
  useEffect(() => {
    let showListener: NativeEventSubscription | null = null;
    let hideListener: NativeEventSubscription | null = null;

    const setupListeners = () => {
      showListener = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        (event) => {
          setKeyboardVisible(true);
          const keyboardHeight = event.endCoordinates.height;

          Animated.timing(buttonTranslateY, {
            toValue: -(keyboardHeight - insets.bottom),
            duration: Platform.OS === "ios" ? 250 : 200,
            useNativeDriver: true,
          }).start();
        }
      );

      hideListener = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        () => {
          setKeyboardVisible(false);
          Animated.timing(buttonTranslateY, {
            toValue: 0,
            duration: Platform.OS === "ios" ? 250 : 200,
            useNativeDriver: true,
          }).start();
        }
      );
    };

    setupListeners();

    return () => {
      showListener?.remove();
      hideListener?.remove();
    };
  }, [buttonTranslateY, insets.bottom, screenHeight, insets.top, contentHeight]);

  // Validation
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await login(email.trim(), password);
      await saveToken(response.token);
      router.replace("/products" as never);
    } catch (err) {
      if (err instanceof AuthError) {
        setErrors({ general: err.message });
      } else {
        console.error("Login error:", err);
        setErrors({ general: "Unable to sign in. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Screen
        title="Welcome back"
        subtitle="Sign in to your account"
        keyboardVisible={keyboardVisible}
        action={
          <Link href={"/register" as never} asChild>
            <Pressable style={styles.ghostButton}>
              <Text style={styles.ghostButtonText}>Register</Text>
            </Pressable>
          </Link>
        }
      >
        <KeyboardAwareScrollView
          scrollEnabled={true}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={contentHeight > 0 ? Math.max(0, contentHeight - (screenHeight - insets.top - insets.bottom - 300)) + 40 : 60}
          onContentSizeChange={handleContentSizeChange}
        >
          <View style={styles.formContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Welcome back to your account</Text>
            </View>

            {errors.general && (
              <View style={styles.generalError}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            <View style={styles.fieldsContainer}>
              <FormField
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                editable={!isSubmitting}
                error={errors.email}
              />

              <FormField
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                secureTextEntry
                textContentType="password"
                editable={!isSubmitting}
                error={errors.password}
              />
            </View>

            <Link href={"/forgot-password" as never} style={styles.forgotLink}>
              Forgot password?
            </Link>
          </View>
        </KeyboardAwareScrollView>
      </Screen>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ translateY: buttonTranslateY }],
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Pressable
          onPress={handleLogin}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.signInButton,
            pressed && !isSubmitting && styles.buttonPressed,
            isSubmitting && styles.buttonDisabled,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </Pressable>

        <View style={styles.signupPrompt}>
          <Text style={styles.signupPromptText}>Don&apos;t have an account? </Text>
          <Link href={"/register" as never} asChild>
            <Pressable>
              <Text style={styles.signupLink}>Create one</Text>
            </Pressable>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  formContent: {
    gap: 28,
  },
  header: {
    gap: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  generalError: {
    borderRadius: 12,
    backgroundColor: "#fef3f2",
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    padding: 14,
  },
  generalErrorText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  fieldsContainer: {
    gap: 18,
  },
  forgotLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "600",
    alignSelf: "flex-end",
  },
  buttonContainer: {
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: 12,
  },
  signInButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  signInButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  signupPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 12,
  },
  signupPromptText: {
    color: colors.muted,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  ghostButton: {
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  ghostButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});