"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";

interface CheckoutProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color: string;
  size: string;
  storeId: string;
}

interface Address {
  address_id: string;
  address_name: string;
  address: string;
  city: string;
  province: string;
  is_primary: boolean;
}

interface Reward {
  points: { id: string; amount: number; expiredAt: string }[];
  voucher?: {
    id: string;
    code: string;
    percentage: number;
    maxDiscount: number;
    expiredAt: string;
  };
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const [product, setProduct] = useState<CheckoutProduct | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [reward, setReward] = useState<Reward | null>(null);
  const [usePoints, setUsePoints] = useState(true);
  const [useVoucher, setUseVoucher] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const dataString = localStorage.getItem("checkout");
      if (dataString) {
        const parsed: CheckoutProduct = JSON.parse(dataString);
        console.log("Data dari localStorage:", parsed);
        setProduct(parsed);
      }

      if (session?.accessToken) {
        try {
          const [addrRes, rewardRes] = await Promise.all([
            axios.get("/address", { headers: { Authorization: `Bearer ${session.accessToken}` } }),
            axios.get("/rewards", { headers: { Authorization: `Bearer ${session.accessToken}` } }),
          ]);
          const addrs: Address[] = addrRes.data.addresses ?? addrRes.data;
          setAddresses(addrs);
          const primary = addrs.find(a => a.is_primary);
          setSelectedAddressId(primary?.address_id || addrs[0]?.address_id || "");
          setReward(rewardRes.data);
        } catch (e) {
          console.error("error fetchData", e);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [session]);

  const handleConfirm = async () => {
    if (!selectedAddressId || !product || !product.storeId) {
      alert("Data tidak lengkap. Pastikan produk dan alamat tersedia.");
      return;
    }

    setIsSubmitting(true);

    const subtotal = product.price * product.quantity;
    const totalPoints = reward?.points.reduce((a, p) => a + p.amount, 0) || 0;
    const pointDiscount = usePoints ? Math.min(subtotal, totalPoints * 1000) : 0;
    const voucher = reward?.voucher;
    const voucherDiscount = useVoucher && voucher
      ? Math.min((voucher.percentage / 100) * subtotal, voucher.maxDiscount)
      : 0;
    const totalDiscount = pointDiscount + voucherDiscount;
    const finalTotal = subtotal - totalDiscount;

    try {
      const payload = {
        storeId: product.storeId,
        shippingAddress: selectedAddressId,
        totalAmount: finalTotal,
        voucherId: useVoucher && voucher ? voucher.id : null,
        usePoints,
        items: [
          {
            productId: product.id,
            quantity: product.quantity,
            price: product.price,
          },
        ],
      };

      console.log("Payload yang dikirim ke /transaction:", payload);

      const res = await axios.post("/transaction", payload, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });

      const invoiceUrl = res.data.invoice?.invoiceUrl;
      if (invoiceUrl) {
        localStorage.removeItem("checkout");
        window.location.href = invoiceUrl;
      } else {
        alert("Gagal membuat invoice.");
      }
    } catch (e) {
      console.error("Gagal mengirim transaksi:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!session?.accessToken) {
    return <div className="p-8 text-center">Silakan login untuk melanjutkan checkout.</div>;
  }

  if (!product) {
    return <div className="p-8 text-center">Produk tidak ditemukan.</div>;
  }

  const subtotal = product.price * product.quantity;
  const totalPoints = reward?.points.reduce((a, p) => a + p.amount, 0) || 0;
  const pointDiscount = usePoints ? Math.min(subtotal, totalPoints * 1000) : 0;
  const voucher = reward?.voucher;
  const voucherDiscount = useVoucher && voucher
    ? Math.min((voucher.percentage / 100) * subtotal, voucher.maxDiscount)
    : 0;
  const totalDiscount = pointDiscount + voucherDiscount;
  const finalTotal = subtotal - totalDiscount;

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <p className="mb-2 font-semibold">Alamat Pengiriman</p>
      <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)} className="border px-4 py-2 mb-6 w-full">
        {addresses.map(addr => (
          <option key={addr.address_id} value={addr.address_id}>
            {addr.address_name} - {addr.city}, {addr.province}
          </option>
        ))}
      </select>

      <div className="flex gap-4 mb-4">
        <img src={product.imageUrl} className="w-32 h-32 object-cover rounded" />
        <div>
          <p className="font-semibold">{product.name}</p>
          <p>Warna: {product.color}</p>
          <p>Ukuran: {product.size}</p>
          <p>Jumlah: {product.quantity}</p>
          <p>Harga satuan: Rp{product.price.toLocaleString()}</p>
        </div>
      </div>

      {reward && (
        <>
          {totalPoints > 0 && (
            <label className="block my-2">
              <input type="checkbox" checked={usePoints} onChange={() => setUsePoints(!usePoints)} className="mr-2" />
              Gunakan Poin ({totalPoints} poin)
            </label>
          )}
          {voucher && (
            <label className="block my-2">
              <input type="checkbox" checked={useVoucher} onChange={() => setUseVoucher(!useVoucher)} className="mr-2" />
              Gunakan Voucher {voucher.code}
            </label>
          )}
        </>
      )}

      <div className="border-t pt-4 mt-4">
        <p>Subtotal: Rp{subtotal.toLocaleString()}</p>
        <p>Diskon: Rp{totalDiscount.toLocaleString()}</p>
        <p className="font-bold text-lg mt-2">Total: Rp{finalTotal.toLocaleString()}</p>
      </div>

      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
        className="w-full mt-6 bg-black text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Memproses..." : "Konfirmasi dan Bayar"}
      </button>
    </section>
  );
}
