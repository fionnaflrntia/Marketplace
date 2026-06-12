import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AppShell } from "../components/layout/AppShell";
import { authService, AuthError } from "../services/authService";
import { formatRupiah } from "../utils/currency";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://marketplace-backend-ochre.vercel.app/api";

type OrderItem = {
    productId: { _id: string; name: string; imageUrl: string };
    quantity: number;
};

type Order = {
    _id: string;
    totalAmount: number;
    shippingAddress: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
};

export default function OrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await authService.fetchWithToken(`${API_BASE_URL}/orders`);
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                if (error instanceof AuthError && error.statusCode === 401) {
                    navigate("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [navigate]);

    return (
        <AppShell title="Riwayat Pesanan">
            <section className="rounded-(--radius) border border-(--line) bg-(--surface) p-6 shadow-(--shadow-soft)">
                <h2 className="text-2xl font-bold mb-6 font-['Poppins',sans-serif]">Riwayat Pesanan</h2>

                {isLoading ? (
                    <p className="animate-pulse text-(--muted)">Mengambil data pesanan...</p>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-(--muted) mb-4 text-lg">Anda belum melakukan pembelanjaan.</p>
                        <Link to="/products" className="inline-block bg-[#edf7f6] text-(--primary-strong) px-6 py-3 rounded-xl font-bold transition hover:bg-[#dff1ef]">
                            Mulai Belanja Yuk!
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="border border-(--line) rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-[#edf7f6] px-4 py-3 flex justify-between items-center border-b border-(--line)">
                                    <div>
                                        <p className="text-xs text-(--muted) font-semibold uppercase tracking-wider">Tanggal Order</p>
                                        <p className="font-bold text-(--primary-strong)">
                                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-bold text-(--primary) border border-(--primary) shadow-sm">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white flex flex-col gap-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center">
                                            <img
                                                src={item.productId?.imageUrl || "https://via.placeholder.com/150"}
                                                alt={item.productId?.name || "Barang"}
                                                className="w-16 h-16 object-cover rounded-lg border border-(--line)"
                                            />
                                            <div>
                                                <p className="font-bold">{item.productId?.name || "Barang Tidak Diketahui"}</p>
                                                <p className="text-sm text-(--muted)">{item.quantity} barang</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-[#f8fbfb] p-4 border-t border-(--line) flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-(--muted) font-semibold uppercase tracking-wider">Total Belanja</p>
                                        <p className="text-xl font-bold text-(--primary)">{formatRupiah(order.totalAmount)}</p>
                                    </div>
                                    <div className="text-right max-w-[50%]">
                                        <p className="text-xs text-(--muted) font-semibold uppercase tracking-wider">Dikirim ke:</p>
                                        <p className="text-sm truncate" title={order.shippingAddress}>{order.shippingAddress}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </AppShell>
    );
}