import type { ButtonHTMLAttributes } from "react";

type ProductButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ProductButton({ className, style, ...props }: ProductButtonProps) {
	return (
		<button
			className={[
				"inline-flex w-full items-center justify-center rounded-[10px] border-0 bg-(--primary) px-4 py-3 text-sm font-bold text-white shadow-(--shadow-soft) transition",
				"hover:-translate-y-0.5 hover:bg-(--primary-strong) focus:outline-none focus:ring-4 focus:ring-[#d7eeec]",
				className,
			].filter(Boolean).join(" ")}
			style={style}
			{...props}
		/>
	);
}