/**
 * Format a number as Indonesian Rupiah (IDR) currency
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "Rp100.000")
 */
export function formatRupiah(amount: number): string {
	return `Rp${Math.round(amount).toLocaleString("id-ID")}`;
}
