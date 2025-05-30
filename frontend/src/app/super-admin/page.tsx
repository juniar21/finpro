"use client";

import Navbar from "@/components/navbar/navbar/Navbar";
import Footer from "@/components/navbar/navbar/footer";
import Sidebarsup from "@/components/navbar/navbar/Sidebarsup";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import Image from "next/image";
import Link from "next/link";
import AddStoreAdminModal from "@/components/modal/addadminstore";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  storeName?: string;
  storeLocation?: string;
};

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Admin Store 1", email: "admin1@example.com", role: "STORE_ADMIN", storeName: "Store A", storeLocation: "Location A" },
    { id: "2", name: "Admin Store 2", email: "admin2@example.com", role: "STORE_ADMIN", storeName: "Store B", storeLocation: "Location B" },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    storeName: "",
    storeLocation: "",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  if (!session || session.user?.role !== "SUPER_ADMIN") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  const totalUsers = users.length;

  const handleAddUser = (userData: User) => {
    setUsers([...users, { ...userData, id: (users.length + 1).toString() }]);
    setNewUser({ name: "", email: "", storeName: "", storeLocation: "" });
  };

  const handleEdit = (userId: string) => {
    alert(`Edit user ID: ${userId} (Coming soon)`);
  };

  const handleDelete = (userId: string) => {
    if (confirm("Yakin ingin menghapus user ini?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
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

          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="bg-white shadow p-6 rounded w-full md:w-1/3">
              <h2 className="text-xl font-semibold mb-2">Total Pengguna</h2>
              <p className="text-4xl font-bold text-blue-600">{totalUsers}</p>
            </div>

            <div className="bg-white shadow p-6 rounded w-full md:w-1/3">
              <h2 className="text-xl font-semibold mb-2">Peran Anda</h2>
              <p className="text-lg text-green-700 font-medium flex items-center gap-2">
                {session.user?.role} <VscVerifiedFilled size={20} />
              </p>
            </div>

            <div className="bg-white shadow p-6 rounded w-full md:w-1/3">
              <h2 className="text-xl font-semibold mb-2">Kelola Pengguna</h2>
              <Link href="#users" className="text-blue-600 hover:underline">
                Lihat Daftar
              </Link>
            </div>
          </div>

          {/* Add User Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Tambah Store Admin
            </button>
          </div>

          {/* Users Table */}
          <section id="users">
            <h2 className="text-2xl font-bold mb-4">Daftar Pengguna</h2>

            <div className="overflow-x-auto bg-white rounded shadow">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">#</th>
                    <th className="p-3">Nama</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Toko</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">
                        {user.role === "STORE_ADMIN"
                          ? `${user.storeName} (${user.storeLocation})`
                          : "-"}
                      </td>
                      <td className="p-3 space-x-2">
                        {user.role === "STORE_ADMIN" && (
                          <>
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:underline"
                            >
                              Hapus
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <Footer />

      {/* Add Store Admin Modal */}
      <AddStoreAdminModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        handleAddUser={handleAddUser}
      />
    </>
  );
}
