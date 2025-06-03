"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebarstore from "@/components/navbar/navbar/SidebarAdminStore";
import Footer from "@/components/navbar/navbar/footer";
import { useSession } from "next-auth/react";
import axios from "@/lib/axios"; // Make sure this path is correct
import Image from "next/image";

interface ProductCategory {
  id: string;
  name: string;
}

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
}

interface Product {
  id: string;
  storeId: string;
  productId: string;
  quantity: number;
  updatedAt: string;
  product: ProductDetails;
}

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [products, setProducts] = useState<Product[]>([]);  // Initialize as an empty array
  const [loadingData, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!session?.accessToken) {
      setError("Token tidak ditemukan. Silakan login terlebih dahulu.");
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("/store", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`, // Include Bearer Token
          },
        });

        // Check if the response has products data
        if (Array.isArray(res.data.products)) {
          setProducts(res.data.products); // Assuming the response contains the product list
        } else {
          setError("Produk tidak ditemukan.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching products.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session, loading]);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <Sidebarstore />
        </aside>

        <main className="flex-1 p-6 bg-gray-50 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Daftar Produk</h1>

          {/* Loading and Error States */}
          {loadingData && <p>Loading data produk...</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {/* Show "No products available" if no products */}
          {products.length === 0 && !loadingData && !error && (
            <p className="text-center">Tidak ada produk tersedia.</p>
          )}

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Nama Produk</th>
                  <th className="py-2 px-4 border">Deskripsi</th>
                  <th className="py-2 px-4 border">Harga (Rp)</th>
                  <th className="py-2 px-4 border">Stok</th>
                  <th className="py-2 px-4 border">Kategori</th>
                  <th className="py-2 px-4 border">Gambar</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{p.product.name}</td>
                    <td className="border px-4 py-2">{p.product.description}</td>
                    <td className="border px-4 py-2">{p.product.price.toLocaleString()}</td>
                    <td className="border px-4 py-2">{p.quantity}</td>
                    <td className="border px-4 py-2">{p.product.category.name}</td>
                    <td className="border px-4 py-2">
                      <Image
                        src={p.product.imageUrl}
                        alt={`Image for ${p.product.name}`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
