import type { ButtonHTMLAttributes } from "react";

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function AuthButton({ className, style, disabled, ...props }: AuthButtonProps) {
	return (
		<button
			disabled={disabled}
			className={[
				"inline-flex w-full items-center justify-center rounded-[10px] border-0 bg-[var(--primary)] px-4 py-3 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition",
				"hover:-translate-y-0.5 hover:bg-[var(--primary-strong)] focus:outline-none focus:ring-4 focus:ring-[#d7eeec]",
				disabled ? "cursor-not-allowed opacity-60 hover:translate-y-0 hover:bg-[var(--primary)]" : "",
				className,
			].filter(Boolean).join(" ")}
			style={style}
			{...props}
		/>
	);
}