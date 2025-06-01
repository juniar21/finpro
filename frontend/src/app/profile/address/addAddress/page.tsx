"use client";

import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebar from "@/components/navbar/navbar/Sidebar";
import Footer from "@/components/navbar/navbar/footer";
import { useSession } from "next-auth/react";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "@/lib/axios";

interface AddressFormData {
  address_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  is_primary: boolean;
}

export default function CreateAddressPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [formData, setFormData] = useState<AddressFormData>({
    address_name: "",
    address: "",
    subdistrict: "",
    city: "",
    province: "",
    postcode: "",
    is_primary: false,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <p>Anda harus login terlebih dahulu untuk mengakses halaman ini.</p>
      </div>
    );
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const token = (session as any).accessToken;
      if (!token) {
        setMessage("Token tidak ditemukan, silakan login ulang.");
        setIsSubmitting(false);
        return;
      }

      const res = await axios.post("/address", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201 || res.status === 200) {
        setMessage("Alamat berhasil dibuat ✅");
        setFormData({
          address_name: "",
          address: "",
          subdistrict: "",
          city: "",
          province: "",
          postcode: "",
          is_primary: false,
        });
      } else {
        setMessage("Gagal membuat alamat.");
      }
    } catch (error: any) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Terjadi kesalahan saat membuat alamat."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full">
        <div className="w-64 bg-gray-100 hidden md:block">
          <Sidebar />
        </div>

        <main className="flex-1 overflow-auto p-8">
          <h1 className="text-3xl font-bold mb-6">Buat Alamat Baru</h1>

          <div className="max-w-xl bg-white p-6 rounded shadow mx-auto">
            {message && (
              <p
                className={`mb-4 text-center px-4 py-2 rounded ${
                  message.includes("berhasil")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label
                  htmlFor="address_name"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Nama Alamat
                </label>
                <input
                  type="text"
                  id="address_name"
                  name="address_name"
                  value={formData.address_name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Alamat
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="subdistrict"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Kecamatan
                </label>
                <input
                  type="text"
                  id="subdistrict"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Kota
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="province"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Provinsi
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="postcode"
                  className="block mb-1 font-semibold text-gray-700"
                >
                  Kode Pos
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_primary"
                  name="is_primary"
                  checked={formData.is_primary}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="is_primary"
                  className="ml-2 block text-sm text-gray-700 select-none"
                >
                  Jadikan alamat utama
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-indigo-600 py-3 px-4 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Buat Alamat"}
              </button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
