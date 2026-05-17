import { useEffect, useRef, useState } from "react";
import { Link, router } from "expo-router";
import { ActivityIndicator, Animated, Keyboard, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions, NativeEventSubscription } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppScreen as Screen } from "../components/AppScreen";
import { FormField } from "../components/FormField";
import { register, saveToken } from "../lib/auth";
import { colors } from "../lib/theme";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; general?: string }>({});
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

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await register(name.trim(), email.trim(), password, confirmPassword);
      await saveToken(response.token);
      router.replace("/products" as never);
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Unable to create account" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Screen
        title="Create account"
        subtitle="Join to start shopping"
        keyboardVisible={keyboardVisible}
        action={
          <Link href={"/login" as never} asChild>
            <Pressable style={styles.ghostButton}>
              <Text style={styles.ghostButtonText}>Login</Text>
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
          extraScrollHeight={contentHeight > 0 ? Math.max(0, contentHeight - (screenHeight - insets.top - insets.bottom - 300)) + 40 : 80}
          onContentSizeChange={handleContentSizeChange}
        >
          <View style={styles.formContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join our marketplace</Text>
            </View>

            {errors.general && (
              <View style={styles.generalError}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            <View style={styles.fieldsContainer}>
              <FormField
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                autoCapitalize="words"
                textContentType="name"
                editable={!isSubmitting}
                error={errors.name}
              />

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
                textContentType="newPassword"
                editable={!isSubmitting}
                error={errors.password}
              />

              <FormField
                label="Confirm Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                secureTextEntry
                textContentType="newPassword"
                editable={!isSubmitting}
                error={errors.confirmPassword}
              />
            </View>
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
          onPress={handleRegister}
          disabled={isSubmitting}
          style={({ pressed }) => [
            styles.signUpButton,
            pressed && !isSubmitting && styles.buttonPressed,
            isSubmitting && styles.buttonDisabled,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.signUpButtonText}>Create Account</Text>
          )}
        </Pressable>

        <View style={styles.signinPrompt}>
          <Text style={styles.signinPromptText}>Already have an account? </Text>
          <Link href={"/login" as never} asChild>
            <Pressable>
              <Text style={styles.signinLink}>Sign in</Text>
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
  buttonContainer: {
    backgroundColor: colors.bg,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: 12,
  },
  signUpButton: {
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
  signUpButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  signinPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 12,
  },
  signinPromptText: {
    color: colors.muted,
    fontSize: 14,
  },
  signinLink: {
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