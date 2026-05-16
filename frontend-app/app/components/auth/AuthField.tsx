import type { InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	helpText?: string;
};

export function AuthField({ label, helpText, id, className, ...props }: AuthFieldProps) {
	const fieldId = id ?? props.name;

	return (
		<label className="flex flex-col gap-2" htmlFor={fieldId}>
			<span className="font-semibold text-[var(--text)]">{label}</span>
			<input
				id={fieldId}
				className={[
					"rounded-[10px] border border-[var(--line)] bg-white px-3 py-3 text-[var(--text)] outline-none transition",
					"focus:border-[var(--primary)] focus:ring-4 focus:ring-[#e1f2f0]",
					className,
				].filter(Boolean).join(" ")}
				{...props}
			/>
			{helpText ? <span className="m-0 text-[0.92rem] text-[var(--muted)]">{helpText}</span> : null}
		</label>
	);
}