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

export default function RegisterPage() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
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
			const response = await authService.register(
				formData.name,
				formData.email,
				formData.password,
				formData.confirmPassword
			);
			authService.saveToken(response.token);
			analytics.trackRegister(formData.email, formData.name);
			analytics.setUserId(response.user.id);
			navigate("/products");
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : "Registration failed";
			analytics.trackError("Registration Error", errorMsg);
			setErrorMessage(errorMsg);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthShell
			title="Join Check-it-Out!"
			subtitle="Create your account to start shopping and managing your product listings."
			footer={
				<>
					Already have an account?{" "}
					<Link to="/login" className="font-bold text-[var(--primary-strong)] underline-offset-4 hover:underline">
						Sign in
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
					label="Full name"
					name="name"
					type="text"
					placeholder="Your name"
					autoComplete="name"
					value={formData.name}
					onChange={handleInputChange}
					disabled={isLoading}
					required
				/>

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
					placeholder="Create a password"
					autoComplete="new-password"
					value={formData.password}
					onChange={handleInputChange}
					disabled={isLoading}
					required
				/>

				<AuthField
					label="Confirm password"
					name="confirmPassword"
					type="password"
					placeholder="Repeat your password"
					autoComplete="new-password"
					value={formData.confirmPassword}
					onChange={handleInputChange}
					disabled={isLoading}
					required
				/>

				<p className="m-0 text-[0.95rem] text-[var(--muted)]">
					By creating an account, you agree to our terms of service and privacy policy. You'll have full access to Check-it-Out! features.
				</p>

				<AuthButton type="submit" disabled={isLoading}>
					{isLoading ? "Creating account..." : "Create account"}
				</AuthButton>
			</form>
		</AuthShell>
	);
}