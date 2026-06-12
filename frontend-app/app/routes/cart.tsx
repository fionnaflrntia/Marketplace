import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { AppShell } from "../components/layout/AppShell";
import { authService, AuthError } from "../services/authService";
import { formatRupiah } from "../utils/currency";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://marketplace-backend-ochre.vercel.app/api";

type CartItem = {
    productId: {
        _id: string;
        name: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
};

export default function CartPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showCheckoutForm, setShowCheckoutForm] = useState(false);
    const [shippingAddress, setShippingAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const response = await authService.fetchWithToken(`${API_BASE_URL}/cart`);
                const data = await response.json();
                setCartItems(data.items || []);
            } catch (error) {
                if (error instanceof AuthError && error.statusCode === 401) {
                    navigate("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadCart();
    }, [navigate]);

    const totalHarga = cartItems.reduce((acc, item) =>
        acc + (item.productId.price * item.quantity), 0
    );

    const handleCheckout = async () => {
        if (!shippingAddress.trim()) {
            alert("Mohon isi alamat pengiriman terlebih dahulu.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await authService.fetchWithToken(`${API_BASE_URL}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingAddress,
                    totalAmount: totalHarga
                })
            });

            if (!response.ok) {
                throw new Error("Gagal melakukan checkout, silakan coba lagi.");
            }

            alert("Checkout Berhasil! Pesananmu akan segera diproses.");
            navigate("/orders");

            setCartItems([]);
            setShowCheckoutForm(false);
            setShippingAddress("");

        } catch (error) {
            alert(error instanceof Error ? error.message : "Terjadi kesalahan sistem.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppShell title="Shopping Cart">
            <section className="rounded-(--radius) border border-(--line) bg-(--surface) p-6 shadow-(--shadow-soft)">
                <h2 className="text-2xl font-bold mb-6 font-['Poppins',sans-serif]">Keranjang Belanja Kamu</h2>

                {isLoading ? (
                    <p className="animate-pulse text-(--muted)">Memuat keranjang...</p>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-(--muted) mb-4 text-lg">Keranjangmu kosong.</p>
                        <Link to="/products" className="inline-block bg-[#edf7f6] text-(--primary-strong) px-6 py-3 rounded-xl font-bold transition hover:bg-[#dff1ef]">
                            Ayo belanja sekarang!
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cartItems.map((item) => (
                            <div key={item.productId._id} className="flex items-center gap-4 p-4 border rounded-xl bg-[#f8fbfb]">
                                <img src={item.productId.imageUrl} alt={item.productId.name} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg">{item.productId.name}</h3>
                                    <p className="text-sm text-(--muted)">{item.quantity} x {formatRupiah(item.productId.price)}</p>
                                </div>
                                <p className="font-bold text-lg">{formatRupiah(item.productId.price * item.quantity)}</p>
                            </div>
                        ))}

                        <div className="mt-6 pt-6 border-t border-(--line) flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <p className="text-(--muted) mb-1">Total Pembayaran:</p>
                                <p className="text-3xl font-bold text-(--primary)">{formatRupiah(totalHarga)}</p>
                            </div>

                            {showCheckoutForm ? (
                                <div className="w-full md:w-1/2 bg-[#f8fbfb] border border-(--line) p-4 rounded-xl shadow-sm">
                                    <h3 className="font-bold text-(--primary-strong) mb-2">Pengiriman </h3>
                                    <textarea
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Tulis alamat lengkapmu di sini (Nama Jalan, No. Rumah, RT/RW, Kota, Kode Pos)..."
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) min-h-[100px] mb-4 text-sm"
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={handleCheckout}
                                            disabled={isSubmitting}
                                            className="flex-1 bg-(--primary) text-white px-4 py-2.5 rounded-xl font-bold hover:bg-(--primary-strong) transition disabled:opacity-50"
                                        >
                                            {isSubmitting ? "Memproses..." : "Konfirmasi & Bayar"}
                                        </button>
                                        <button
                                            onClick={() => setShowCheckoutForm(false)}
                                            disabled={isSubmitting}
                                            className="bg-[#edf7f6] text-(--primary-strong) px-6 py-2.5 rounded-xl font-bold hover:bg-[#dff1ef] transition disabled:opacity-50"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowCheckoutForm(true)}
                                    className="w-full md:w-auto bg-(--primary) text-white px-8 py-3.5 rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-lg hover:bg-(--primary-strong) transition duration-300"
                                >
                                    Checkout Sekarang
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </AppShell>
    );
}