"use client";
import { useState } from "react";
import { searchDestination } from "@/lib/rajaongkir"; // ✅ pastikan path ini sesuai dengan file kamu

type Destination = {
  name: string;
  city_name: string;
  province: string;
  type: string;
};

export const DestinationSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("Masukkan kata kunci pencarian.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await searchDestination(keyword);
      const destinations: Destination[] = res?.data || [];
      if (Array.isArray(destinations)) {
        setResults(destinations);
      } else {
        setResults([]);
        setError("Data tujuan tidak ditemukan.");
      }
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Terjadi kesalahan saat mengambil data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Cari Tujuan Pengiriman</h2>

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Contoh: Jakarta"
        className="border border-gray-300 p-2 w-full mb-3 rounded"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Mencari..." : "Cari"}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((item, index) => (
            <li key={index} className="border p-3 rounded shadow-sm bg-white">
              <strong>{item.name}</strong> - {item.city_name}, {item.province} ({item.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
