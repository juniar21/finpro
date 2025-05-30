// Tambahan pada file komponen SuperAdminDashboard
"use client";

import Navbar from "@/components/navbar/navbar/Navbar";
import Footer from "@/components/navbar/navbar/footer";
import Sidebarsup from "@/components/navbar/navbar/Sidebarsup";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import Image from "next/image";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Store = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  adminId?: string;
};

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", address: "", latitude: 0, longitude: 0 });

  useEffect(() => {
    const dummyUsers: User[] = [
      { id: "1", name: "Evan", email: "evan@example.com", role: "SUPER_ADMIN" },
      { id: "2", name: "Alice", email: "alice@example.com", role: "STORE_ADMIN" },
      { id: "3", name: "Charlie", email: "charlie@example.com", role: "STORE_ADMIN" },
    ];
    setUsers(dummyUsers);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><p>Memuat dashboard...</p></div>;
  }

  if (!session || session.user?.role !== "SUPER_ADMIN") {
    return <div className="flex items-center justify-center h-screen"><p>Anda tidak memiliki akses ke halaman ini.</p></div>;
  }

  const totalUsers = users.length;

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Nama dan email wajib diisi.");
      return;
    }
    const newUserObj: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: "STORE_ADMIN",
    };
    setUsers([...users, newUserObj]);
    setNewUser({ name: "", email: "" });
    setIsAddModalOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full">
        <aside className="w-64 bg-gray-100 hidden md:block">
          <Sidebarsup />
        </aside>

        <main className="flex-1 p-8 overflow-auto bg-gray-50">
          <h1 className="text-3xl font-bold mb-6">Dashboard Super Admin</h1>

          {/* Section Info */}
          {/* ...Bagian lainnya sama seperti sebelumnya... */}

          {/* Modal Tambah Store Admin */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Tambah Store Admin</h2>
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full border p-2 rounded mb-4" placeholder="Nama" />
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full border p-2 rounded mb-4" placeholder="Email" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Batal</button>
                  <button onClick={handleAddUser} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
                </div>
              </div>
            </div>
          )}

          {/* Store Management Section */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Manajemen Toko</h2>
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsStoreModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                + Tambah Toko
              </button>
            </div>
            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">#</th>
                    <th className="p-3">Nama Toko</th>
                    <th className="p-3">Alamat</th>
                    <th className="p-3">Lokasi</th>
                    <th className="p-3">Store Admin</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store, idx) => (
                    <tr key={store.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">{store.name}</td>
                      <td className="p-3">{store.address}</td>
                      <td className="p-3">{store.latitude}, {store.longitude}</td>
                      <td className="p-3">{users.find(u => u.id === store.adminId)?.name || "Belum Ditugaskan"}</td>
                      <td className="p-3 space-x-2">
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-red-600 hover:underline">Hapus</button>
                        <button className="text-purple-600 hover:underline">Assign Admin</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Modal Tambah Toko */}
          {isStoreModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-bold mb-4">Tambah Toko</h2>
                <input type="text" placeholder="Nama Toko" className="w-full border p-2 rounded mb-2" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
                <input type="text" placeholder="Alamat" className="w-full border p-2 rounded mb-2" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} />
                <input type="number" placeholder="Latitude" className="w-full border p-2 rounded mb-2" value={newStore.latitude} onChange={(e) => setNewStore({ ...newStore, latitude: parseFloat(e.target.value) })} />
                <input type="number" placeholder="Longitude" className="w-full border p-2 rounded mb-4" value={newStore.longitude} onChange={(e) => setNewStore({ ...newStore, longitude: parseFloat(e.target.value) })} />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsStoreModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Batal</button>
                  <button
                    onClick={() => {
                      const newStoreObj: Store = {
                        ...newStore,
                        id: Date.now().toString(),
                      };
                      setStores([...stores, newStoreObj]);
                      setNewStore({ name: "", address: "", latitude: 0, longitude: 0 });
                      setIsStoreModalOpen(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
