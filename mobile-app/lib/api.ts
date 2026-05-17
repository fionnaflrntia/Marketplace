export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

export async function readErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const payload = (await response.clone().json()) as { message?: string };
    return payload.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}