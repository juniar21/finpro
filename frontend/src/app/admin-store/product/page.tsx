"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebarstore from "@/components/navbar/navbar/SidebarAdminStore";
import Footer from "@/components/navbar/navbar/footer";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios"; // sesuaikan path sesuai struktur project
import Image from "next/image";

interface Store {
  id: string;
  name: string;
  address: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  category: string;
}

export default function AdminStorePage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!session?.accessToken) {
      setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get("/product", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        setProducts(res.data.products); // Assuming the response contains products data
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Terjadi kesalahan saat mengambil data produk."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [session, loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading session...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Anda harus login dulu.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full">
        <div className="w-64 bg-gray-100 hidden md:block">
          <Sidebarstore />
        </div>
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          <h1 className="text-3xl font-bold mb-6">Kelola Produk Toko</h1>

          {isLoading && <p>Loading data produk...</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          <table className="min-w-full bg-white rounded shadow overflow-x-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border">Nama Produk</th>
                <th className="py-2 px-4 border">Deskripsi</th>
                <th className="py-2 px-4 border">Harga</th>
                <th className="py-2 px-4 border">Kategori</th>
                <th className="py-2 px-4 border">Gambar</th>
                <th className="py-2 px-4 border">Stok</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Belum ada produk
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.description}</td>
                    <td className="border px-4 py-2">{product.price}</td>
                    <td className="border px-4 py-2">{product.category}</td>
                    <td className="border px-4 py-2">
                      <Image
                        src={product.image}
                        alt={`Image ${product.name}`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </td>
                    <td className="border px-4 py-2">{product.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </main>
      </div>
      <Footer />
    </>
  );
}
