"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebarstore from "@/components/navbar/navbar/SidebarAdminStore";
import Footer from "@/components/navbar/navbar/footer";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Sepatu Sneakers",
      description: "Sepatu sneakers nyaman untuk sehari-hari",
      price: 350000,
      stock: 20,
      status: "active",
    },
    {
      id: 2,
      name: "Kaos Polo",
      description: "Kaos polo katun berkualitas",
      price: 150000,
      stock: 15,
      status: "inactive",
    },
  ]);

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

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Nama</th>
                  <th className="py-2 px-4 border">Deskripsi</th>
                  <th className="py-2 px-4 border">Harga (Rp)</th>
                  <th className="py-2 px-4 border">Stok</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Tidak ada produk
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{p.name}</td>
                      <td className="border px-4 py-2">{p.description}</td>
                      <td className="border px-4 py-2">{p.price.toLocaleString()}</td>
                      <td className="border px-4 py-2">{p.stock}</td>
                      <td className="border px-4 py-2 capitalize">{p.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
