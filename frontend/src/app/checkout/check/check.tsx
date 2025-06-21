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
  city_id?: string;
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

  const [shippingData, setShippingData] = useState<any>(null);
  const [selectedShippingOption, setSelectedShippingOption] =
    useState<any>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState<number>(0);

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
          const primary = addrs.find((a) => a.is_primary);
          const selectedId = primary?.address_id || addrs[0]?.address_id || "";
          setSelectedAddressId(selectedId);
          setReward(rewardRes.data);
        } catch (e) {
          console.error("error fetchData", e);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [session]);

  const fetchShippingCost = async (receiver_destination_id: string) => {
    setShippingLoading(true);
    try {
      const res = await axios.get("/rajaongkir/cost", {
        params: {
          shipper_destination_id: "3994", // ID gudang asal
          receiver_destination_id,
          weight: product?.quantity || 1,
          item_value: product?.price || 0,
        },
      });

      setShippingData(res.data.data);
    } catch (err) {
      console.error("❌ Gagal hitung ongkir:", err);
      setShippingData(null);
    } finally {
      setShippingLoading(false);
    }
  };

  useEffect(() => {
    const selected = addresses.find((a) => a.address_id === selectedAddressId);
    if (selected?.city_id) {
      fetchShippingCost(selected.city_id);
    }
  }, [selectedAddressId, addresses]);

  const handleConfirm = async () => {
    if (!selectedAddressId || !product || !selectedShippingOption) {
      alert("Pilih alamat, produk, dan opsi pengiriman.");
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

  if (!session || !session.accessToken) {
    return (
      <p className="text-center mt-20">
        Silakan login untuk melanjutkan checkout.
      </p>
    );
  }

  if (!product) {
    return (
      <p className="text-center mt-20">
        Produk tidak ditemukan di keranjang checkout.
      </p>
    );
  }

  const subtotal = product.price * product.quantity;
  const totalPoints =
    reward?.points?.reduce((acc, p) => acc + p.amount, 0) || 0;
  const pointDiscount = usePoints ? Math.min(subtotal, totalPoints * 1000) : 0;
  const voucher = reward?.voucher;
  const voucherDiscount =
    useVoucher && voucher
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

      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        {/* Alamat */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Pilih Alamat Pengiriman
          </h2>
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
            <p className="text-sm text-gray-500">
              Quantity: {product.quantity}
            </p>
            <p className="text-sm text-gray-500">
              Price: Rp{product.price.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Reward */}
        {reward && (totalPoints > 0 || voucher) && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Gunakan Reward</h3>
            {totalPoints > 0 && (
              <div
                className={`border p-4 rounded-lg cursor-pointer ${
                  usePoints ? "bg-blue-50 border-blue-500" : "border-gray-200"
                }`}
                onClick={() => setUsePoints(!usePoints)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-blue-700">Poin</p>
                    <p className="text-sm">
                      Potongan Rp{pointDiscount.toLocaleString()} dari{" "}
                      {totalPoints} poin
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={usePoints}
                    readOnly
                    className="accent-blue-600"
                  />
                </div>
              </div>
            )}
            {voucher && (
              <div
                className={`border p-4 rounded-lg cursor-pointer ${
                  useVoucher
                    ? "bg-green-50 border-green-500"
                    : "border-gray-200"
                }`}
                onClick={() => setUseVoucher(!useVoucher)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-green-700">
                      Voucher {voucher.code}
                    </p>
                    <p className="text-sm">
                      {voucher.percentage}% hingga Rp
                      {voucher.maxDiscount.toLocaleString()} (Diskon Rp
                      {voucherDiscount.toLocaleString()})
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useVoucher}
                    readOnly
                    className="accent-green-600"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pengiriman */}
        {shippingData && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Opsi Pengiriman</h3>
            {["calculate_reguler", "calculate_cargo", "calculate_instant"].map(
              (type) =>
                shippingData[type]?.length > 0 && (
                  <div key={type}>
                    <h4 className="text-md font-semibold capitalize mb-2">
                      {type.replace("calculate_", "")}
                    </h4>
                    <div className="grid gap-2">
                      {shippingData[type].map((option: any, index: number) => {
                        const optionId = `${type}-${index}`;
                        const isSelected =
                          selectedShippingOption?.id === optionId;

                        return (
                          <label
                            key={optionId}
                            className={`flex items-center justify-between border p-3 rounded-md cursor-pointer ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="shipping_option"
                                checked={isSelected}
                                onChange={() => {
                                  setSelectedShippingOption({
                                    ...option,
                                    id: optionId,
                                  });
                                  setShippingCost(option.shipping_cost_net);
                                }}
                                className="accent-blue-600 mt-1"
                              />
                              <div>
                                <div className="font-medium">
                                  {option.shipping_name} - {option.service_name}
                                </div>
                                <div>
                                  Ongkir: Rp
                                  {option.shipping_cost_net.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Estimasi: {option.etd || "-"}
                                </div>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )
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
        <div className="flex justify-between text-lg font-medium">
          <span>Ongkir:</span>
          <span>
            {shippingCost ? `Rp${shippingCost.toLocaleString()}` : "-"}
          </span>
        </div>
        <div className="flex justify-between text-xl font-bold border-t pt-3">
          <span>Total Bayar:</span>
          <span>Rp{(finalTotal + shippingCost).toLocaleString()}</span>
        </div>

        {/* Checkout Button */}
        <button
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
          onClick={handleConfirm}
          disabled={isSubmitting || !selectedShippingOption}
        >
          {isSubmitting ? "Processing..." : "Confirm and Pay"}
        </button>
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
