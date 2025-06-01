"use client";
import AddressFormModal from "@/components/modal/addresprofile";
import Footer from "@/components/navbar/navbar/footer";
import Navbar from "@/components/navbar/navbar/Navbar";
import Sidebar from "@/components/navbar/navbar/Sidebar";
import React, { useState } from "react";


type Address = {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
};

export default function AddressList() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "iqbal m",
      phone: "081233332222",
      street: "Jl. Bandengan Selatan No.11, RT.11/RW.5",
      city: "Bojongsoang, Kabupaten Bandung",
      province: "Jawa Barat",
      postalCode: "40287",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleAddNew = () => {
    setModalOpen(true);
  };

  const handleSave = (address: Omit<Address, "id">) => {
    const newAddress = {
      id: Date.now(),
      ...address,
    };
    setAddresses((prev) => [...prev, newAddress]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Daftar alamat</h1>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Tambah alamat baru
            </button>
          </div>

          {addresses.map((addr) => (
            <div key={addr.id} className="mb-8">
              <h2 className="font-semibold text-lg mb-1">Alamat utama</h2>
              <p>{addr.name}</p>
              <p>{addr.phone}</p>
              <p>{addr.street}</p>
              <p>
                {addr.city}, {addr.province}, {addr.postalCode}
              </p>

              <div className="mt-4 space-x-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                  Edit
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {modalOpen && (
            <AddressFormModal
              onClose={() => setModalOpen(false)}
              onSave={handleSave}
            />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
