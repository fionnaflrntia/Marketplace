"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AppShell } from "../components/layout/AppShell";
import { authService, AuthError } from "../services/authService";
import { formatRupiah } from "../utils/currency";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://marketplace-backend-ochre.vercel.app/api";

type Item = {
	_id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	stock: number;
	imageUrl: string;
	rating: number;
};

export default function ProductDetailPage() {
	const navigate = useNavigate();
	const { id: itemId } = useParams();
	const [item, setItem] = useState<Item | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [backendError, setBackendError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const loadItem = async (productId: string) => {
			try {
				const response = await fetch(`${API_BASE_URL}/items/${productId}`);

				if (!response.ok) {
					if (isMounted) {
						setItem(null);
						setBackendError(response.status === 404 ? "Product not found" : "Unable to load product.");
						setIsLoading(false);
					}
					return;
				}

				const data = (await response.json()) as Item;
				if (isMounted) {
					setItem(data);
					setBackendError(null);
					setIsLoading(false);
				}
			} catch (err) {
				if (isMounted) {
					setItem(null);
					setBackendError("Unable to load product.");
					setIsLoading(false);
				}
			}
		};

		if (itemId) {
			void loadItem(itemId);
		} else {
			setBackendError("Missing product ID");
			setIsLoading(false);
		}

		return () => {
			isMounted = false;
		};
	}, [itemId]);

	const handleAddToCart = async () => {
		if (!itemId) return;

		if (!authService.isAuthenticated()) {
			alert("Silakan Login terlebih dahulu.");
			navigate("/login");
			return;
		}

		setIsAdding(true);
		setError(null);

		try {
			const response = await authService.fetchWithToken(`${API_BASE_URL}/cart`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId: itemId, quantity: 1 }),
			});

			if (!response.ok) {
				throw new Error("Failed to add product to cart");
			}

			alert("Berhasil masuk keranjang! 🛒");

		} catch (err) {
			if (err instanceof AuthError && err.statusCode === 401) {
				navigate("/login");
				return;
			}
			setError(err instanceof Error ? err.message : "Error adding to cart");
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<AppShell title="Product Detail">
			<section className="rounded-(--radius) border border-(--line) bg-(--surface) p-5 shadow-(--shadow-soft) sm:p-6">
				{isLoading ? (
					<p className="animate-pulse text-(--muted)">Loading product details...</p>
				) : backendError ? (
					<div className="text-center py-10">
						<p className="rounded-lg bg-[#edf7f6] px-3 py-4 text-xl font-semibold text-(--primary-strong)">{backendError}</p>
						<Link to="/products" className="mt-4 inline-block text-(--primary) underline">Kembali ke Katalog</Link>
					</div>
				) : item ? (
					<div className="grid gap-8 md:grid-cols-2">
						<div className="overflow-hidden rounded-(--radius) border border-(--line) bg-[#edf7f6] w-full aspect-square flex items-center justify-center">
							{item && item.imageUrl ? (
								<img
									src={item.imageUrl}
									alt={item.name}
									className="w-full h-full object-cover block"
								/>
							) : (
								<div className="flex items-center justify-center font-semibold text-(--primary-strong)">No Image</div>
							)}
						</div>

						<div className="flex flex-col gap-4">
							<div>
                         <span className="inline-block rounded-full bg-[#edf7f6] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-(--primary-strong)">
                            {item.category}
                         </span>
								<h2 className="mt-2 text-3xl font-bold text-(--text)">{item.name}</h2>
								<p className="mt-2 text-2xl font-semibold text-(--primary)">{formatRupiah(item.price)}</p>
							</div>

							<div className="mt-4">
								<h3 className="font-semibold text-(--text)">Description</h3>
								<p className="mt-1 leading-relaxed text-(--muted)">{item.description || "No description available."}</p>
							</div>

							<div className="mt-2">
								<span className="text-(--muted)">Stock Available: </span>
								<span className="font-semibold text-(--text)">{item.stock > 0 ? item.stock : "Out of Stock"}</span>
							</div>

							{error && <p className="mt-2 rounded-lg bg-[#fde8e8] px-3 py-2 text-(--danger)">{error}</p>}

							<div className="mt-auto pt-6">
								<button
									onClick={handleAddToCart}
									disabled={isAdding || item.stock < 1}
									className="inline-flex w-full items-center justify-center rounded-[10px] bg-(--primary) px-4 py-3.5 font-bold text-white shadow-(--shadow-soft) transition hover:-translate-y-0.5 hover:bg-(--primary-strong) disabled:cursor-not-allowed disabled:opacity-70"
								>
									{isAdding ? "Adding..." : item.stock < 1 ? "Out of Stock" : "Add to Cart 🛒"}
								</button>
								<Link
									to="/products"
									className="mt-3 inline-flex w-full items-center justify-center rounded-[10px] bg-[#edf7f6] px-4 py-3 font-semibold text-(--primary-strong) transition hover:bg-[#dff1ef]"
								>
									Back to Catalog
								</Link>
							</div>
						</div>
					</div>
				) : null}
			</section>
		</AppShell>
	);
}