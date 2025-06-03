"use client";

import Navbar from "@/components/navbar/navbar/Navbar";
import Footer from "@/components/navbar/navbar/footer";
import Sidebarsup from "@/components/navbar/navbar/Sidebarsup";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import AddStoreAdminModal, { StoreAdmin } from "@/components/modal/addadminstore"; // Import tipe StoreAdmin
import { useSession } from "next-auth/react";

export default function StoreAdminListPage() {
  const { data: session, status } = useSession();
  const [storeAdmins, setStoreAdmins] = useState<StoreAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const fetchStoreAdmins = async () => {
      try {
        const response = await axios.get("/store-admin");
        setStoreAdmins(response.data);
      } catch (error) {
        console.error("Gagal mengambil data Store Admin:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === "SUPER_ADMIN") {
      fetchStoreAdmins();
    }
  }, [session]);

  // Menerima data StoreAdmin lengkap dari modal
  const handleAddUser = (newUser: StoreAdmin) => {
    setStoreAdmins((prev) => [...prev, newUser]);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Memeriksa sesi pengguna...</p>
      </div>
    );
  }

  if (!session || session.user?.role !== "SUPER_ADMIN") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold">
          Anda tidak memiliki akses ke halaman ini.
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <Sidebarsup />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-full">
          {/* Header Info Super Admin */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md max-w-md">
            <p className="text-gray-500 text-sm mb-1">
              Selamat datang di dashboard Super Admin,
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              {session.user?.name ?? "Super Admin"}
            </h2>
            <span className="inline-block px-4 py-1 text-xs font-semibold text-white bg-purple-700 rounded-full uppercase tracking-wide select-none">
              {session.user?.role ?? "SUPER_ADMIN"}
            </span>
          </div>

          {/* Header & Action */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Daftar Pengguna
            </h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
              aria-label="Tambah Store Admin"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Store Admin
            </button>
          </div>

          {/* Total Store Admin */}
          {!loading && (
            <div className="mb-8 inline-block px-6 py-3 bg-blue-100 text-blue-900 rounded-lg shadow-sm font-semibold select-none">
              Total Store Admin:{" "}
              <span className="text-2xl">{storeAdmins.length}</span>
            </div>
          )}

          {/* Table List */}
          {loading ? (
            <p className="text-gray-600 text-center py-10 text-lg">Memuat data...</p>
          ) : storeAdmins.length === 0 ? (
            <p className="text-gray-600 text-center py-10 text-lg">
              Tidak ada Store Admin yang ditemukan.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg bg-white border border-gray-200">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-7 py-4 text-left text-gray-700 font-semibold tracking-wide">
                      #
                    </th>
                    <th className="px-7 py-4 text-left text-gray-700 font-semibold tracking-wide">
                      Nama
                    </th>
                    <th className="px-7 py-4 text-left text-gray-700 font-semibold tracking-wide">
                      Email
                    </th>
                    <th className="px-7 py-4 text-left text-gray-700 font-semibold tracking-wide">
                      Role
                    </th>
                    <th className="px-7 py-4 text-left text-gray-700 font-semibold tracking-wide">
                      Toko
                    </th>
                    <th className="px-7 py-4 text-left text-gray-700 font-semibold tracking-wide">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {storeAdmins.map((admin, index) => (
                    <tr
                      key={admin.id}
                      className="border-b last:border-0 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-7 py-4 whitespace-nowrap text-gray-800">
                        {index + 1}
                      </td>
                      <td className="px-7 py-4 whitespace-nowrap text-gray-900 font-semibold">
                        {admin.name}
                      </td>
                      <td className="px-7 py-4 whitespace-nowrap text-gray-700">
                        {admin.email}
                      </td>
                      <td className="px-7 py-4 whitespace-nowrap">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 uppercase tracking-wide select-none">
                          {admin.roles}
                        </span>
                      </td>
                      <td className="px-7 py-4 whitespace-nowrap text-gray-700">
                        {admin.storeName
                          ? `${admin.storeName} (${admin.storeLocation})`
                          : "-"}
                      </td>
                      <td className="px-7 py-4 whitespace-nowrap space-x-5">
                        <button
                          className="text-blue-600 hover:text-blue-800 font-semibold transition"
                          aria-label={`Edit ${admin.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 font-semibold transition"
                          aria-label={`Hapus ${admin.name}`}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />

      {/* Modal Tambah Store Admin */}
      <AddStoreAdminModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        handleAddUser={handleAddUser}
      />
    </>
  );
}
