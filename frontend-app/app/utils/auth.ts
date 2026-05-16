import { redirect } from "react-router";
import { authService } from "~/services/authService";

/**
 * Checks if user is authenticated
 * Throws redirect to /login if not
 */
export function requireAuth() {
  if (!authService.isAuthenticated()) {
    throw redirect("/login");
  }
}

/**
 * Checks if user is NOT authenticated
 * Throws redirect to /products if already logged in
 */
export function requireGuest() {
  if (authService.isAuthenticated()) {
    throw redirect("/products");
  }
}
