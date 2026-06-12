import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { Link, useLoaderData, redirect, useNavigate } from "react-router";
import { AppShell } from "../components/layout/AppShell";
import { ProductCard, type ProductCardItem } from "../components/product/ProductCard";
import { authService, AuthError } from "../services/authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://marketplace-backend-ochre.vercel.app/api";

type LoaderData = {
	items: ProductCardItem[];
	backendError?: string;
};

export async function loader() {
	const isBrowser = typeof window !== "undefined";

	if (!isBrowser) {
		return { items: [] } satisfies LoaderData;
	}

	if (!authService.isAuthenticated()) {
		return redirect("/login");
	}

	try {
		const response = await authService.fetchWithToken(`${API_BASE_URL}/items`);

		if (!response.ok) {
			return {
				items: [],
				backendError: "Unable to load products at this time. Please refresh the page.",
			} satisfies LoaderData;
		}

		const items = (await response.json()) as ProductCardItem[];
		return { items: items.slice(0, 4) } satisfies LoaderData;
	} catch (error) {
		// If auth error (401), redirect to login
		if (error instanceof AuthError && error.statusCode === 401) {
			return redirect("/login");
		}

		return {
			items: [],
			backendError: "Unable to load products at this time. Please refresh the page.",
		} satisfies LoaderData;
	}
}

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Home | Check-it-Out!" },
		{ name: "description", content: "Discover and shop amazing products on Check-it-Out!" },
	];
}

export default function Home() {
	const navigate = useNavigate();
	const loaderData = useLoaderData<typeof loader>() as LoaderData;
	const [items, setItems] = useState<ProductCardItem[]>(loaderData.items);
	const [backendError, setBackendError] = useState<string | undefined>(loaderData.backendError);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!authService.isAuthenticated()) {
			navigate("/login");
			return;
		}

		let isMounted = true;

		const loadItems = async () => {
			try {
				const response = await authService.fetchWithToken(`${API_BASE_URL}/items`);

				if (!response.ok) {
					if (isMounted) {
						setItems([]);
						setBackendError("Unable to load products at this time. Please refresh the page.");
						setIsLoading(false);
					}
					return;
				}

				const data = (await response.json()) as ProductCardItem[];
				if (isMounted) {
					setItems(data.slice(0, 4));
					setBackendError(undefined);
					setIsLoading(false);
				}
			} catch (error) {
				if (error instanceof AuthError && error.statusCode === 401) {
					navigate("/login");
					return;
				}

				if (isMounted) {
					setItems([]);
					setBackendError("Unable to load products at this time. Please refresh the page.");
					setIsLoading(false);
				}
			}
		};

		void loadItems();

		return () => {
			isMounted = false;
		};
	}, [navigate]);

	return (
		<AppShell title="Check-it-Out!">
			<section className="rounded-(--radius) border border-(--line) bg-(--surface) p-5 shadow-(--shadow-soft) sm:p-6">
				{backendError ? (
					<p className="mb-4 rounded-lg bg-[#edf7f6] px-3 py-2 text-(--primary-strong)">
						{backendError}
					</p>
				) : null}

				<h2 className="m-0 text-[1.6rem] font-semibold tracking-tight font-['Poppins',sans-serif]">
					Welcome to Check-it-Out!
				</h2>
				<p className="mt-2 text-(--muted)">
					Your go-to destination for quality products. Browse our latest arrivals, explore our full catalog, or add new items to our collection.
				</p>
				<div className="mt-4 flex flex-wrap gap-3">
					<Link
						to="/products"
						className="inline-flex items-center justify-center rounded-[10px] bg-(--primary) px-4 py-3 text-sm font-semibold text-white shadow-(--shadow-soft) transition hover:-translate-y-0.5 hover:bg-(--primary-strong)"
					>
						Shop All Products
					</Link>
				</div>
			</section>

			<section className="rounded-(--radius) border border-(--line) bg-(--surface) p-5 shadow-(--shadow-soft) sm:p-6">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<h3 className="m-0 text-[1.25rem] font-semibold font-['Poppins',sans-serif]">
						Latest Products
					</h3>
					<Link
						to="/products"
						className="inline-flex items-center justify-center rounded-[10px] bg-[#edf7f6] px-4 py-2.5 text-sm font-semibold text-(--primary-strong) transition hover:bg-[#dff1ef]"
					>
						View All
					</Link>
				</div>

				{isLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true" aria-live="polite">
						{Array.from({ length: 4 }).map((_, index) => (
							<div
								key={index}
								className="h-[22rem] animate-pulse rounded-(--radius) border border-(--line) bg-[#f8fbfb] shadow-(--shadow-soft)"
							>
								<div className="h-52 rounded-t-[inherit] bg-[#e7efee]" />
								<div className="flex flex-col gap-3 p-4">
									<div className="h-6 w-28 rounded-full bg-[#e7efee]" />
									<div className="h-5 w-4/5 rounded bg-[#e7efee]" />
									<div className="h-4 w-full rounded bg-[#e7efee]" />
									<div className="h-4 w-3/4 rounded bg-[#e7efee]" />
									<div className="mt-auto h-11 rounded-[10px] bg-[#e7efee]" />
								</div>
							</div>
						))}
					</div>
				) : items.length === 0 ? (
					<p className="text-(--muted)">
						{backendError
							? "We're temporarily unavailable. Please check back soon!"
							: "Check back soon for our latest products!"}
					</p>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{items.map((item) => (
							<ProductCard key={item._id} item={item} variant="compact" actionLabel="View Details" to={`/products/${item._id}`} />
						))}
					</div>
				)}
			</section>
		</AppShell>
	);
}
