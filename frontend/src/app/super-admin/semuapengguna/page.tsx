'use client';
import Navbar from "@/components/navbar/navbar/Navbar";
import Footer from "@/components/navbar/navbar/footer";
import { useEffect, useState } from "react";
import axios from "@/lib/axios"; // pastikan path sesuai struktur proyek Anda
import Sidebarsup from "@/components/navbar/navbar/Sidebarsup";

interface StoreAdmin {
  id: string;
  name: string;
  email: string;
  roles: string;
}

export default function StoreAdminListPage() {
  const [storeAdmins, setStoreAdmins] = useState<StoreAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreAdmins = async () => {
      try {
        const response = await axios.get('/store-admin');
        setStoreAdmins(response.data);
      } catch (error) {
        console.error('Gagal mengambil data Store Admin:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreAdmins();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full">
        <div className="w-64 bg-gray-100 hidden md:block">
          <Sidebarsup />
        </div>

        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Daftar Store Admin</h1>

          {loading ? (
            <p>Loading...</p>
          ) : storeAdmins.length === 0 ? (
            <p>Tidak ada data Store Admin.</p>
          ) : (
            <div className="grid gap-4">
              {(() => {
                const items = [];
                for (let i = 0; i < storeAdmins.length; i++) {
                  const admin = storeAdmins[i];
                  items.push(
                    <div key={admin.id} className="p-4 border rounded shadow bg-white">
                      <p><strong>Nama:</strong> {admin.name}</p>
                      <p><strong>Email:</strong> {admin.email}</p>
                      <p><strong>Role:</strong> {admin.roles}</p>
                    </div>
                  );
                }
                return items;
              })()}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
