"use client";
import React from "react";

interface AddStoreAdminModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newUser: {
    name: string;
    email: string;
    storeName: string;
    storeLocation: string;
  };
  setNewUser: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    storeName: string;
    storeLocation: string;
  }>>;
  handleAddUser: () => void;
}

const AddStoreAdminModal: React.FC<AddStoreAdminModalProps> = ({
  isOpen,
  setIsOpen,
  newUser,
  setNewUser,
  handleAddUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Background overlay with blur effect */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-4">Tambah Store Admin</h2>

          <label className="block mb-2 font-medium">Nama</label>
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full border p-2 rounded mb-4"
            placeholder="Nama Store Admin"
          />

          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full border p-2 rounded mb-4"
            placeholder="Email Store Admin"
          />

          <label className="block mb-2 font-medium">Nama Toko</label>
          <input
            type="text"
            value={newUser.storeName}
            onChange={(e) =>
              setNewUser({ ...newUser, storeName: e.target.value })
            }
            className="w-full border p-2 rounded mb-4"
            placeholder="Contoh: Toko Sumber Rejeki"
          />

          <label className="block mb-2 font-medium">Lokasi Toko</label>
          <input
            type="text"
            value={newUser.storeLocation}
            onChange={(e) =>
              setNewUser({ ...newUser, storeLocation: e.target.value })
            }
            className="w-full border p-2 rounded mb-4"
            placeholder="Contoh: Bukittinggi"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStoreAdminModal;
