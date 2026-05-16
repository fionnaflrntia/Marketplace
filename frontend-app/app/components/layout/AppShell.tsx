import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";
import { authService } from "../../services/authService";
import { analytics } from "../../utils/analytics";

type AppShellProps = {
	title: string;
	children: ReactNode;
};

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
	[
		"rounded-full px-3 py-1.5 text-sm font-semibold transition-colors",
		isActive
			? "bg-[#ecf8f6] text-[var(--primary-strong)] shadow-[inset_0_0_0_1px_rgba(17,94,89,0.12)]"
			: "text-[var(--muted)] hover:bg-[#edf7f6] hover:text-[var(--primary-strong)]",
	].join(" ");

export function AppShell({ title, children }: AppShellProps) {
	const navigate = useNavigate();

	const handleLogout = () => {
		analytics.trackLogout();
		authService.removeToken();
		navigate("/login");
	};

	return (
		<main className="min-h-screen px-4 py-8 text-(--text)">
			<div className="mx-auto flex max-w-6xl flex-col gap-5">
				<header className="flex flex-col gap-4 rounded-(--radius) border border-(--line) bg-(--surface) px-5 py-4 shadow-(--shadow-soft) sm:flex-row sm:items-center sm:justify-between">
					<h1 className="text-[1.15rem] font-semibold tracking-tight font-['Poppins',sans-serif]">
						{title}
					</h1>
					<nav className="flex flex-wrap items-center gap-2">
						<NavLink to="/" end className={navLinkClasses}>
							Home
						</NavLink>
						<NavLink to="/products" end className={navLinkClasses}>
							Products
						</NavLink>
						<NavLink to="/cart" end className={navLinkClasses}>
							Cart
						</NavLink>
						<button
							type="button"
							onClick={handleLogout}
							className="rounded-full bg-[#fde8e8] px-3 py-1.5 text-sm font-semibold text-(--danger) transition hover:bg-[#fcdcdc]"
						>
							Logout
						</button>
					</nav>
				</header>

				{children}
			</div>
		</main>
	);
}