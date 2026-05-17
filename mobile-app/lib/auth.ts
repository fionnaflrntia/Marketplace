import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { API_BASE_URL, readErrorMessage } from "./api";
import type { AuthResponse } from "./types";

const TOKEN_KEY = "marketplace.authToken";

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const hasWebStorage = () => Platform.OS === "web" && typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export async function saveToken(token: string) {
  if (hasWebStorage()) {
    window.localStorage.setItem(TOKEN_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getStoredToken() {
  if (hasWebStorage()) {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeStoredToken() {
  if (hasWebStorage()) {
    window.localStorage.removeItem(TOKEN_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function hasStoredToken() {
  return Boolean(await getStoredToken());
}

async function requestJson<T>(path: string, init: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const message = await readErrorMessage(response, "Request failed");

  if (!response.ok) {
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function login(email: string, password: string) {
  return requestJson<AuthResponse>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string, confirmPassword: string) {
  return requestJson<AuthResponse>("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
}

export async function fetchWithToken(path: string, init: RequestInit = {}) {
  const token = await getStoredToken();

  if (!token) {
    throw new AuthError("No authentication token found", 401);
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    await removeStoredToken();
    throw new AuthError("Session expired. Please sign in again.", 401);
  }

  return response;
}