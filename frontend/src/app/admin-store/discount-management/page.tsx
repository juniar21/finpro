"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebarstore from "@/components/navbar/navbar/SidebarAdminStore";
import Footer from "@/components/navbar/navbar/footer";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios";
import { Loader2, PlusCircle } from "lucide-react";
import AddDiscountModal from "./modal/AddDiscountModal";

interface Discount {
  id: string;
  name: string;
  type: "MANUAL" | "MIN_PURCHASE" | "BUY_ONE_GET_ONE";
  amount: number;
  isPercentage: boolean;
  minPurchase?: number;
  maxDiscount?: number;
  buyQuantity?: number;
  getQuantity?: number;
  productId?: string;
  startDate: string;
  endDate: string;
}

function isDiscountActive(endDate: string): boolean {
  return new Date(endDate).getTime() > Date.now();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DiscountManagementPage() {
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchDiscounts = async () => {
    if (!session?.accessToken || !session?.user?.id) {
      setError("Token atau storeId tidak ditemukan. Silakan login.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`/discounts/store/${session.user.id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      setDiscounts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal mengambil data diskon.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingSession && session?.user?.id) {
      fetchDiscounts();
    }
  }, [session, loadingSession]);

  if (loadingSession) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        Anda harus login sebagai Store Admin
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex w-full h-full min-h-screen">
        <div className="w-64 bg-gray-100 hidden md:block">
          <Sidebarstore />
        </div>
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manajemen Diskon</h1>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            >
              <PlusCircle className="h-5 w-5" /> Tambah Diskon
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Memuat diskon...</span>
            </div>
          )}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <table className="min-w-full bg-white rounded shadow overflow-x-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Nama</th>
                <th className="py-2 px-4 border">Tipe</th>
                <th className="py-2 px-4 border">Jumlah</th>
                <th className="py-2 px-4 border">Periode</th>
                <th className="py-2 px-4 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {discounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Belum ada diskon
                  </td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{discount.name}</td>
                    <td className="border px-4 py-2">{discount.type}</td>
                    <td className="border px-4 py-2">
                      {discount.isPercentage
                        ? `${discount.amount ?? 0}%`
                        : `Rp ${(discount.amount ?? 0).toLocaleString(
                            "id-ID"
                          )}`}
                    </td>
                    <td className="border px-4 py-2">
                      {formatDate(discount.startDate)} -{" "}
                      {formatDate(discount.endDate)}
                    </td>
                    <td className="border px-4 py-2">
                      {isDiscountActive(discount.endDate) ? (
                        <span className="text-green-600 font-semibold">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Kedaluwarsa
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </div>
      <Footer />

      <AddDiscountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDiscountAdded={(newDiscount) =>
          setDiscounts((prev) => [...prev, newDiscount])
        }
      />
    </>
  );
}
