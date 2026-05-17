import type { ReactNode } from "react";
import { Screen } from "./Screen";
import { useKeyboardVisible } from "../hooks/useKeyboardVisible";

type AppScreenProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  keyboardVisible?: boolean;
};

export function AppScreen({ keyboardVisible, ...rest }: AppScreenProps) {
  const internalVisible = useKeyboardVisible();
  const resolved = typeof keyboardVisible === "boolean" ? keyboardVisible : internalVisible;

  return <Screen {...(rest as any)} keyboardVisible={resolved} />;
}
