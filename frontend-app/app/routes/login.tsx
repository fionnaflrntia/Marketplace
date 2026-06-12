import { useState } from "react";
import { useNavigate, Link, redirect } from "react-router";
import { AuthButton } from "../components/auth/AuthButton";
import { AuthField } from "../components/auth/AuthField";
import { AuthShell } from "../components/auth/AuthShell";
import { authService } from "../services/authService";
import { analytics } from "../utils/analytics";

export async function loader() {
	const isBrowser = typeof window !== "undefined";
	if (isBrowser && authService.isAuthenticated()) {
		return redirect("/products");
	}
	return null;
}

export default function LoginPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrorMessage(""); // Clear error when user starts typing
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage("");

		try {
			const response = await authService.login(formData.email, formData.password);
			authService.saveToken(response.token);
			analytics.trackLogin(formData.email);
			analytics.setUserId(response.user.id);
			navigate("/products");
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : "Login failed";
			analytics.trackError("Login Error", errorMsg);
			setErrorMessage(errorMsg);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthShell
			title="Welcome back to Check-it-Out!"
			subtitle="Sign in to your account to manage your products and shop our collection."
			footer={
				<>
					Don&apos;t have an account?{" "}
					<Link to="/register" className="font-bold text-[var(--primary-strong)] underline-offset-4 hover:underline">
						Create one
					</Link>
				</>
			}
		>
			<form className="grid gap-4" onSubmit={handleSubmit}>
				{errorMessage && (
					<div className="rounded-[10px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
						{errorMessage}
					</div>
				)}

				<AuthField
					label="Email address"
					name="email"
					type="email"
					placeholder="you@example.com"
					autoComplete="email"
					value={formData.email}
					onChange={handleInputChange}
					disabled={isLoading}
					required
				/>

				<AuthField
					label="Password"
					name="password"
					type="password"
					placeholder="Enter your password"
					autoComplete="current-password"
					value={formData.password}
					onChange={handleInputChange}
					disabled={isLoading}
					required
				/>

				<div className="flex flex-wrap items-center justify-between gap-3 text-[0.95rem] text-[var(--muted)]">
					<label className="inline-flex items-center gap-2">
						<input type="checkbox" disabled={isLoading} />
						Remember me
					</label>
					<Link to="#" className="font-bold text-[var(--primary-strong)] underline-offset-4 hover:underline">
						Forgot password?
					</Link>
				</div>

				<AuthButton type="submit" disabled={isLoading}>
					{isLoading ? "Signing in..." : "Sign in"}
				</AuthButton>
			</form>
		</AuthShell>
	);
}