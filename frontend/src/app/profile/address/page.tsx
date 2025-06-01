"use client";

import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebar from "@/components/navbar/navbar/Sidebar";
import Footer from "@/components/navbar/navbar/footer";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import EditAddressModal from "./editAddress/page";

type Address = {
  address_id: string;
  address_name: string;
  address: string;
  subdistrict?: string | null;
  city: string;
  province: string;
  postcode?: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export default function AddressList() {
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal edit state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/address", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        // Sesuaikan response jika API return langsung array atau dalam objek
        setAddresses(res.data.addresses ?? res.data);
      } catch (error) {
        console.error("Failed to load addresses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus alamat ini?")) return;

    if (!session?.accessToken) return;
    setDeletingId(id);
    try {
      await axios.delete(`/address/${id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      setAddresses((prev) => prev.filter((addr) => addr.address_id !== id));
    } catch (error) {
      console.error("Gagal menghapus alamat", error);
      alert("Gagal menghapus alamat, silakan coba lagi.");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (address: Address) => {
    setAddressToEdit(address);
    setIsEditModalOpen(true);
  };

  const handleUpdateAddress = (updatedAddress: Address) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.address_id === updatedAddress.address_id ? updatedAddress : addr
      )
    );
  };

  if (loadingSession) {
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
        <aside className="w-64 bg-gray-100 hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-8 overflow-auto max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Daftar alamat</h1>

          <a
            href="/profile/address/addAddress"
            className="mb-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Tambah Alamat
          </a>

          {loading ? (
            <p>Loading alamat...</p>
          ) : addresses.length === 0 ? (
            <p>Belum ada alamat tersimpan.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.address_id}
                className="mb-8 border p-4 rounded shadow flex justify-between items-start"
              >
                <div>
                  <h2 className="font-semibold text-lg mb-1">
                    {addr.is_primary ? "Alamat Utama" : "Alamat"}
                  </h2>
                  <p>{addr.address_name}</p>
                  <p>{addr.address}</p>
                  {addr.subdistrict && <p>{addr.subdistrict}</p>}
                  <p>
                    {addr.city}, {addr.province} {addr.postcode ?? ""}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.address_id)}
                    disabled={deletingId === addr.address_id}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === addr.address_id ? "Menghapus..." : "Delete"}
                  </button>
                </div>
              </div>
            ))
          )}

          <EditAddressModal
            open={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            addressToEdit={addressToEdit}
            token={session?.accessToken ?? ""}
            onUpdate={handleUpdateAddress}
          />
        </main>
      </div>
      <Footer />
    </>
  );
}
