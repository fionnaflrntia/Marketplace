import type { ReactNode } from "react";

type AuthShellProps = {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
	return (
		<main className="min-h-screen px-4 py-12 text-[var(--text)]">
			<div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl flex-col gap-6">

				<section className="mx-auto w-full max-w-md rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[var(--shadow-soft)]">
					<div className="mb-6 text-center">
						<p className="mx-auto mb-3 inline-flex rounded-full bg-[#edf7f6] px-3 py-1 text-sm font-semibold text-[var(--primary-strong)]">
							Account access
						</p>
						<h2 className="m-0 text-[2rem] font-semibold tracking-[-0.02em] text-[var(--text)] [font-family:'Poppins',sans-serif]">
							{title}
						</h2>
						<p className="mx-auto mt-2 max-w-[26rem] text-[0.95rem] text-[var(--muted)]">
							{subtitle}
						</p>
					</div>

					{children}

					<div className="mt-5 border-t border-[var(--line)] pt-4 text-center text-sm text-[var(--muted)]">
						{footer}
					</div>
				</section>
			</div>
		</main>
	);
}