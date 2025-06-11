"use client";

import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebar from "@/components/navbar/navbar/Sidebar";
import Footer from "@/components/navbar/navbar/footer";
import { useSession } from "next-auth/react";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "@/lib/axios";

interface Option {
  id: string;
  name: string;
}

interface AddressFormData {
  address_name: string;
  address: string;
  province: string;
  city: string;
  subdistrict: string;
  postcode: string;
  is_primary: boolean;
}

export default function CreateAddressPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [formData, setFormData] = useState<AddressFormData>({
    address_name: "",
    address: "",
    province: "",
    city: "",
    subdistrict: "",
    postcode: "",
    is_primary: false,
  });

  const [provinces, setProvinces] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [subdistricts, setSubdistricts] = useState<Option[]>([]);

  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch provinsi on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await axios.get("/rajaongkir/provinces");
      setProvinces(res.data);
    };
    fetchProvinces();
  }, []);

  // Fetch kota berdasarkan provinsi
  useEffect(() => {
    if (formData.province) {
      const fetchCities = async () => {
        const res = await axios.get(`/rajaongkir/cities?province_id=${formData.province}`);
        setCities(res.data);
      };
      fetchCities();
    } else {
      setCities([]);
      setFormData((prev) => ({ ...prev, city: "", subdistrict: "" }));
    }
  }, [formData.province]);

  // Fetch kecamatan berdasarkan kota
  useEffect(() => {
    if (formData.city) {
      const fetchSubdistricts = async () => {
        const res = await axios.get(`/rajaongkir/subdistricts?city_id=${formData.city}`);
        setSubdistricts(res.data);
      };
      fetchSubdistricts();
    } else {
      setSubdistricts([]);
      setFormData((prev) => ({ ...prev, subdistrict: "" }));
    }
  }, [formData.city]);

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
          province: "",
          city: "",
          subdistrict: "",
          postcode: "",
          is_primary: false,
        });
        setCities([]);
        setSubdistricts([]);
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
                <label htmlFor="address_name" className="block mb-1 font-semibold text-gray-700">Nama Alamat</label>
                <input type="text" id="address_name" name="address_name" value={formData.address_name} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

              <div>
                <label htmlFor="address" className="block mb-1 font-semibold text-gray-700">Alamat</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

              <div>
                <label htmlFor="province" className="block mb-1 font-semibold text-gray-700">Provinsi</label>
                <select id="province" name="province" value={formData.province} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((prov) => (
                    <option key={prov.id} value={prov.id}>{prov.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block mb-1 font-semibold text-gray-700">Kota/Kabupaten</label>
                <select id="city" name="city" value={formData.city} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="">Pilih Kota</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subdistrict" className="block mb-1 font-semibold text-gray-700">Kecamatan</label>
                <select id="subdistrict" name="subdistrict" value={formData.subdistrict} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="">Pilih Kecamatan</option>
                  {subdistricts.map((sub) => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="postcode" className="block mb-1 font-semibold text-gray-700">Kode Pos</label>
                <input type="text" id="postcode" name="postcode" value={formData.postcode} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>

              <div className="flex items-center">
                <input type="checkbox" id="is_primary" name="is_primary" checked={formData.is_primary} onChange={handleChange} className="h-4 w-4 border-gray-300" />
                <label htmlFor="is_primary" className="ml-2 text-sm text-gray-700">Jadikan alamat utama</label>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded hover:bg-indigo-700 disabled:opacity-50">
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
