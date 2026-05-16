import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseFieldProps = {
	label: string;
	helpText?: string;
	className?: string;
};

type InputFieldProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement> & {
	textarea?: false;
};

type TextareaFieldProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
	textarea: true;
};

type ProductFieldProps = InputFieldProps | TextareaFieldProps;

export function ProductField({ label, helpText, id, className, textarea, ...props }: ProductFieldProps) {
	const fieldId = id ?? props.name;

	return (
		<label className="flex flex-col gap-2" htmlFor={fieldId}>
			<span className="font-semibold text-(--text)">{label}</span>
			{textarea ? (
				<textarea
					id={fieldId}
					className={[
					"rounded-[10px] border border-(--line) bg-white px-3 py-3 text-(--text) outline-none transition",
					"focus:border-(--primary) focus:ring-4 focus:ring-[#e1f2f0]",
						className,
					].filter(Boolean).join(" ")}
					{...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
				/>
			) : (
				<input
					id={fieldId}
					className={[
						"rounded-[10px] border border-[var(--line)] bg-white px-3 py-3 text-[var(--text)] outline-none transition",
						"focus:border-[var(--primary)] focus:ring-4 focus:ring-[#e1f2f0]",
						className,
					].filter(Boolean).join(" ")}
					{...(props as InputHTMLAttributes<HTMLInputElement>)}
				/>
			)}
			{helpText ? <span className="m-0 text-[0.92rem] text-(--muted)">{helpText}</span> : null}
		</label>
	);
}