import type { ReactNode } from "react";

type ProductShellProps = {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer?: ReactNode;
};

export function ProductShell({ title, subtitle, children, footer }: ProductShellProps) {
	return (
		<section className="rounded-(--radius) border border-(--line) bg-(--surface) p-7 shadow-(--shadow-soft)">
			<div className="mb-6 text-center">
				<h2 className="m-0 text-[2rem] font-semibold tracking-[-0.02em] text-(--text) font-['Poppins',sans-serif]">
					{title}
				</h2>
				<p className="mx-auto mt-2 max-w-104 text-[0.95rem] text-(--muted)">
					{subtitle}
				</p>
			</div>

			{children}

			{footer ? <div className="mt-5 border-t border-(--line) pt-4 text-center text-sm text-(--muted)">{footer}</div> : null}
		</section>
	);
}