const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

export const authService = {
  async register(name: string, email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  saveToken(token: string): void {
    if (isBrowser) {
      localStorage.setItem("authToken", token);
    }
  },

  getToken(): string | null {
    if (!isBrowser) {
      return null;
    }
    return localStorage.getItem("authToken");
  },

  removeToken(): void {
    if (isBrowser) {
      localStorage.removeItem("authToken");
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Fetch with automatic token injection and error handling
   * Throws AuthError with 401 status if token is invalid/expired
   */
  async fetchWithToken(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getToken();

    if (!token) {
      throw new AuthError("No authentication token found", 401);
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token expired or invalid, clear it and throw auth error
    if (response.status === 401) {
      this.removeToken();
      throw new AuthError("Authentication failed. Please login again.", 401);
    }

    return response;
  },
};
