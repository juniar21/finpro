"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import { useSession } from "next-auth/react";

interface CheckoutProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color: string;
  size: string;
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
      const data = localStorage.getItem("checkout");
      if (data) setProduct(JSON.parse(data));

      if (session?.accessToken) {
        try {
          const [addressRes, rewardRes] = await Promise.all([
            axios.get("/address", {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }),
            axios.get("/rewards", {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }),
          ]);

          const addrs: Address[] = addressRes.data.addresses ?? addressRes.data;
          setAddresses(addrs);
          const primary = addrs.find((a) => a.is_primary);
          setSelectedAddressId(primary?.address_id || addrs[0]?.address_id || "");

          setReward(rewardRes.data);
        } catch (err) {
          console.error("Gagal mengambil data:", err);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [session]);

  const handleConfirm = () => {
    if (!selectedAddressId || !product) {
      alert("Pilih alamat dan pastikan produk tersedia.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      alert("Order berhasil dikonfirmasi ✅");
      localStorage.removeItem("checkout");
      setIsSubmitting(false);
    }, 1500);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  if (!session || !session.accessToken) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Silakan login untuk melanjutkan checkout.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Produk tidak ditemukan di keranjang checkout.</p>
      </div>
    );
  }

  // === Hitung total dan reward ===
  const subtotal = product.price * product.quantity;

  const totalPoints = reward?.points?.reduce((acc, p) => acc + p.amount, 0) || 0;
  const pointDiscount = usePoints ? Math.min(subtotal, totalPoints * 1000) : 0;

  const voucher = reward?.voucher;
  const voucherDiscount = useVoucher && voucher
    ? Math.min((voucher.percentage / 100) * subtotal, voucher.maxDiscount)
    : 0;

  const totalDiscount = pointDiscount + voucherDiscount;
  const finalTotal = subtotal - totalDiscount;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        {/* Pilih Alamat */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Pilih Alamat Pengiriman</h2>
          {addresses.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada alamat tersimpan.</p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.address_id}
                  className={`flex items-start justify-between border rounded-lg p-4 cursor-pointer gap-4 ${
                    selectedAddressId === addr.address_id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="radio"
                      name="address"
                      value={addr.address_id}
                      checked={selectedAddressId === addr.address_id}
                      onChange={() => setSelectedAddressId(addr.address_id)}
                      className="mt-1 accent-blue-600"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {addr.address_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {addr.address}, {addr.city}, {addr.province}
                      </span>
                      {addr.is_primary && (
                        <span className="text-xs text-green-600 font-medium mt-1">
                          Alamat Utama
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Edit alamat: ${addr.address_name}`)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    ✎ Edit
                  </button>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Produk */}
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-md"
          />
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-500">Color: {product.color}</p>
            <p className="text-sm text-gray-500">Size: {product.size}</p>
            <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
            <p className="text-sm text-gray-500">Price per item: Rp{product.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Reward Pilihan */}
        {reward && (totalPoints > 0 || voucher) && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Gunakan Reward</h3>

            {/* Karcis Poin */}
            {totalPoints > 0 && (
              <div
                className={`relative border rounded-lg p-4 shadow-sm cursor-pointer transition group ${
                  usePoints ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => setUsePoints(!usePoints)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-blue-700">Poin Reward</p>
                    <p className="text-sm text-gray-600">
                      {totalPoints} poin • Potongan hingga Rp{pointDiscount.toLocaleString()} (1 poin = Rp1.000)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={usePoints}
                    readOnly
                    className="w-5 h-5 accent-blue-600"
                  />
                </div>
                <div className="absolute -left-2 top-1/2 w-4 h-4 rounded-full bg-white border border-gray-300 transform -translate-y-1/2" />
                <div className="absolute -right-2 top-1/2 w-4 h-4 rounded-full bg-white border border-gray-300 transform -translate-y-1/2" />
              </div>
            )}

            {/* Karcis Voucher */}
            {voucher && (
              <div
                className={`relative border rounded-lg p-4 shadow-sm cursor-pointer transition group ${
                  useVoucher ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => setUseVoucher(!useVoucher)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-green-700">
                      Voucher {voucher.code}
                    </p>
                    <p className="text-sm text-gray-600">
                      {voucher.percentage}% hingga Rp{voucher.maxDiscount.toLocaleString()} • Potongan Rp
                      {voucherDiscount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Berlaku hingga: {new Date(voucher.expiredAt).toLocaleDateString()}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useVoucher}
                    readOnly
                    className="w-5 h-5 accent-green-600"
                  />
                </div>
                <div className="absolute -left-2 top-1/2 w-4 h-4 rounded-full bg-white border border-gray-300 transform -translate-y-1/2" />
                <div className="absolute -right-2 top-1/2 w-4 h-4 rounded-full bg-white border border-gray-300 transform -translate-y-1/2" />
              </div>
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-lg font-medium">
          <span>Subtotal:</span>
          <span>Rp{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg font-medium text-red-600">
          <span>Diskon:</span>
          <span>-Rp{totalDiscount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xl font-bold border-t pt-3">
          <span>Total Bayar:</span>
          <span>Rp{finalTotal.toLocaleString()}</span>
        </div>

        {/* Metode Pembayaran */}
        <div>
          <p className="font-medium mb-2">Metode Pembayaran</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" defaultChecked />
              <span>Credit Card</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              <span>Bank Transfer</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Tombol */}
        <button
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
          onClick={handleConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Confirm and Pay"}
        </button>
      </div>
    </section>
  );
}
