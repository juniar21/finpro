"use client";

import Navbar from "@/components/navbar/navbar/Navbar";
import Footer from "@/components/navbar/navbar/footer";
import Sidebarsup from "@/components/navbar/navbar/Sidebarsup";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BsPersonPlusFill, BsPlusLg } from "react-icons/bs";
import { FaStoreAlt, FaUserShield } from "react-icons/fa";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

// Define types
type User = { id: string; name: string; email: string; role: string; };
type Store = { id: string; name: string; address: string; latitude: number; longitude: number; adminId?: string; };

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", address: "", latitude: 0, longitude: 0 });
  const [assignStoreId, setAssignStoreId] = useState<string | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string>("");

  useEffect(() => {
    setUsers([
      { id: "1", name: "Evan", email: "evan@example.com", role: "SUPER_ADMIN" },
      { id: "2", name: "Alice", email: "alice@example.com", role: "STORE_ADMIN" },
      { id: "3", name: "Charlie", email: "charlie@example.com", role: "STORE_ADMIN" },
    ]);
    setStores([
      { id: "s1", name: "Toko A", address: "Jl. Merdeka No.1", latitude: -6.2, longitude: 106.816, adminId: "2" },
      { id: "s2", name: "Toko B", address: "Jl. Sudirman No.2", latitude: -6.21, longitude: 106.82 },
    ]);
  }, []);

  if (loading)
    return <div className="flex items-center justify-center h-screen text-gray-700 font-medium text-lg">Memuat dashboard...</div>;

  if (!session || session.user?.role !== "SUPER_ADMIN")
    return <div className="flex items-center justify-center h-screen text-red-600 font-semibold text-xl">Anda tidak memiliki akses ke halaman ini.</div>;

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return alert("Nama dan email wajib diisi.");
    setUsers((prev) => [...prev, { id: Date.now().toString(), name: newUser.name.trim(), email: newUser.email.trim(), role: "STORE_ADMIN" }]);
    setNewUser({ name: "", email: "" });
    setIsAddModalOpen(false);
  };

  const handleAddStore = () => {
    if (!newStore.name.trim() || !newStore.address.trim()) return alert("Nama toko dan alamat wajib diisi.");
    setStores((prev) => [...prev, { ...newStore, id: Date.now().toString() }]);
    setNewStore({ name: "", address: "", latitude: 0, longitude: 0 });
    setIsStoreModalOpen(false);
  };

  const handleAssignAdmin = () => {
    if (!assignStoreId || !selectedAdminId) return;
    setStores((prev) => prev.map(store => store.id === assignStoreId ? { ...store, adminId: selectedAdminId } : store));
    setAssignStoreId(null);
    setSelectedAdminId("");
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen w-full bg-gray-50">
        <aside className="w-64 bg-white border-r shadow-md hidden md:block"><Sidebarsup /></aside>
        <main className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Dashboard Super Admin</h1>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 border-l-8 border-blue-600">
              <FaUserShield className="text-blue-600 text-4xl" />
              <div><h3 className="text-gray-700 font-semibold">Total Users</h3><p className="text-2xl font-bold">{users.length}</p></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 border-l-8 border-green-600">
              <FaStoreAlt className="text-green-600 text-4xl" />
              <div><h3 className="text-gray-700 font-semibold">Total Stores</h3><p className="text-2xl font-bold">{stores.length}</p></div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center border-l-8 border-purple-600">
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-md shadow-md hover:bg-purple-700 transition">
                <BsPersonPlusFill size={24} />Tambah Store Admin
              </button>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Manajemen Toko</h2>
              <button onClick={() => setIsStoreModalOpen(true)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition">
                <BsPlusLg />Tambah Toko
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-600">#</th>
                    <th className="text-left p-3 font-medium text-gray-600">Nama Toko</th>
                    <th className="text-left p-3 font-medium text-gray-600">Alamat</th>
                    <th className="text-left p-3 font-medium text-gray-600">Lokasi</th>
                    <th className="text-left p-3 font-medium text-gray-600">Store Admin</th>
                    <th className="text-left p-3 font-medium text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.length === 0 ? (
                    <tr><td colSpan={6} className="text-center p-6 text-gray-500 italic">Belum ada data toko.</td></tr>
                  ) : (
                    stores.map((store, i) => (
                      <tr key={store.id} className="border-t hover:bg-gray-50 transition cursor-pointer">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3 font-semibold">{store.name}</td>
                        <td className="p-3">{store.address}</td>
                        <td className="p-3 text-sm text-gray-600">{store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}</td>
                        <td className="p-3">{users.find(u => u.id === store.adminId)?.name || <span className="italic text-gray-400">Belum Ditugaskan</span>}</td>
                        <td className="p-3 flex gap-3">
                          <button className="text-blue-600 hover:underline focus:outline-none">Edit</button>
                          <button className="text-red-600 hover:underline focus:outline-none">Hapus</button>
                          <button onClick={() => setAssignStoreId(store.id)} className="text-purple-600 hover:underline focus:outline-none">Assign Admin</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {assignStoreId && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button onClick={() => setAssignStoreId(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"><AiOutlineClose size={24} /></button>
                <h2 className="text-xl font-bold mb-5 text-gray-800">Pilih Store Admin</h2>
                <select value={selectedAdminId} onChange={(e) => setSelectedAdminId(e.target.value)} className="w-full border border-gray-300 p-3 rounded mb-4">
                  <option value="">-- Pilih Admin --</option>
                  {users.filter(u => u.role === "STORE_ADMIN").map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setAssignStoreId(null)} className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Batal</button>
                  <button onClick={handleAssignAdmin} className="px-5 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2">Simpan <AiOutlineCheck /></button>
                </div>
              </div>
            </div>
          )}

          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button onClick={() => setIsAddModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"><AiOutlineClose size={24} /></button>
                <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2"><BsPersonPlusFill />Tambah Store Admin</h2>
                <input type="text" placeholder="Nama lengkap" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full border border-gray-300 p-3 rounded mb-4" />
                <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full border border-gray-300 p-3 rounded mb-6" />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Batal</button>
                  <button onClick={handleAddUser} className="px-5 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-2">Simpan <AiOutlineCheck /></button>
                </div>
              </div>
            </div>
          )}

          {isStoreModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button onClick={() => setIsStoreModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"><AiOutlineClose size={24} /></button>
                <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2"><FaStoreAlt />Tambah Toko</h2>
                <input type="text" placeholder="Nama Toko" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} className="w-full border border-gray-300 p-3 rounded mb-3" />
                <input type="text" placeholder="Alamat" value={newStore.address} onChange={e => setNewStore({ ...newStore, address: e.target.value })} className="w-full border border-gray-300 p-3 rounded mb-3" />
                <div className="flex gap-4 mb-5">
                  <input type="number" placeholder="Latitude" value={newStore.latitude || ""} onChange={e => setNewStore({ ...newStore, latitude: parseFloat(e.target.value) || 0 })} className="flex-1 border border-gray-300 p-3 rounded" step="any" />
                  <input type="number" placeholder="Longitude" value={newStore.longitude || ""} onChange={e => setNewStore({ ...newStore, longitude: parseFloat(e.target.value) || 0 })} className="flex-1 border border-gray-300 p-3 rounded" step="any" />
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setIsStoreModalOpen(false)} className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 transition">Batal</button>
                  <button onClick={handleAddStore} className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2">Simpan <AiOutlineCheck /></button>
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
