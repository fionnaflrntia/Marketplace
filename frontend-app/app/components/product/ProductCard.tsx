import { Link } from "react-router";
import { formatRupiah } from "../../utils/currency";

export type ProductCardItem = {
	_id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	imageUrl: string;
	rating: number;
};

type ProductCardVariant = "compact" | "detailed";

type ProductCardProps = {
	item: ProductCardItem;
	variant?: ProductCardVariant;
	actionLabel: string;
	to: string;
};

export function ProductCard({ item, variant = "detailed", actionLabel, to }: ProductCardProps) {
	const isCompact = variant === "compact";

	return (
		<article
			className={[
				"group overflow-hidden border border-[#e8ecef] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] flex flex-col h-full",
				isCompact ? "rounded-2xl" : "rounded-(--radius) border-(--line) bg-(--surface) shadow-(--shadow-soft)",
			].join(" ")}
		>
			<div className="aspect-square w-full overflow-hidden bg-[#edf7f6] rounded-t-[inherit] shrink-0">
				{item.imageUrl ? (
					<img
						src={item.imageUrl}
						alt={item.name}
						className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-[0.2em] text-(--primary-strong)">
						No Image
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-2 px-4 py-3.5">
				<div>
					<p className="inline-flex w-fit items-center rounded-full bg-[#edf7f6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-(--primary-strong)">
						{item.category || "General"}
					</p>
					<h3 className={isCompact ? "mt-1.5 line-clamp-2 text-[1.05rem] font-semibold leading-snug" : "m-0 mt-1.5 overflow-hidden text-[1.1rem] font-bold leading-[1.3] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"}>
						{item.name}
					</h3>
					<p className={isCompact ? "mt-1.5 line-clamp-3 text-sm text-(--muted)" : "m-0 mt-1.5 overflow-hidden leading-[1.4] text-sm text-(--muted) [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"}>
						{item.description || "No description"}
					</p>
				</div>

				<div className="mt-auto flex flex-col gap-3 pt-3">
					<div className={isCompact ? "flex items-center justify-between" : "flex items-center justify-between text-(--muted)"}>
						<strong className="text-[1.1rem] font-bold text-(--text)">{formatRupiah(item.price)}</strong>
						{isCompact ? null : <span className="text-sm font-medium">Stock: {item.stock}</span>}
					</div>

					<Link
						to={to}
						className={isCompact ? "inline-flex items-center justify-center rounded-lg bg-[#edf7f6] px-4 py-2 text-sm font-bold text-(--primary-strong) transition hover:bg-[#dff1ef]" : "inline-flex w-full items-center justify-center rounded-lg bg-(--primary) px-4 py-2.5 text-sm font-bold text-white shadow-(--shadow-soft) transition hover:-translate-y-0.5 hover:bg-(--primary-strong)"}
					>
						{actionLabel}
					</Link>
				</div>
			</div>
		</article>
	);
}