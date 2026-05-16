import type { Route } from "./+types/products";
import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { ProductCard, type ProductCardItem } from "../components/product/ProductCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Shop All | Check-it-Out!" },
		{ name: "description", content: "Browse all products on Check-it-Out!" },
	];
}

export default function ProductsPage() {
	const [items, setItems] = useState<ProductCardItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchItems = async () => {
			try {
				setIsLoading(true);

				const response = await fetch("http://localhost:5000/api/items");

				if (!response.ok) {
					throw new Error("Gagal mengambil data produk dari server");
				}

				const data = await response.json();

				if (Array.isArray(data)) {
					setItems(data);
				} else if (data && data.data) {
					setItems(data.data);
				} else {
					setItems([]);
				}
			} catch (error) {
				console.error("Error fetching items:", error);
				setItems([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchItems();
	}, []);

	return (
		<AppShell title="All Products">
			{isLoading ? (
				<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-live="polite">
					{Array.from({ length: 6 }).map((_, index) => (
						<div
							key={index}
							className="h-96 animate-pulse rounded-(--radius) border border-(--line) bg-(--surface) shadow-(--shadow-soft)"
						>
							<div className="h-52 bg-[#e7efee]" />
							<div className="flex flex-col gap-3 p-4">
								<div className="h-6 w-28 rounded-full bg-[#edf7f6]" />
								<div className="h-5 w-4/5 rounded bg-[#e7efee]" />
								<div className="h-4 w-full rounded bg-[#e7efee]" />
								<div className="h-4 w-3/4 rounded bg-[#e7efee]" />
								<div className="mt-auto h-11 rounded-[10px] bg-[#e7efee]" />
							</div>
						</div>
					))}
				</section>
			) : items.length === 0 ? (
				<section className="flex min-h-62.5 flex-col items-center justify-center rounded-(--radius) border border-(--line) bg-(--surface) px-5 py-10 text-center shadow-(--shadow-soft)">
					<h2 className="m-0 text-[1.5rem] font-semibold font-['Poppins',sans-serif]">
						No Items Available
					</h2>
					<p className="mt-2 max-w-xl text-(--muted)">
						Our collection is being updated. Check back soon for new arrivals!
					</p>
				</section>
			) : (
				<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((item) => (
						<ProductCard key={item._id} item={item} actionLabel="View Item" to={`/products/${item._id}`} />
					))}
				</section>
			)}
		</AppShell>
	);
}