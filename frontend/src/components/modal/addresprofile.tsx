"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

type AddressFormProps = {
  onClose: () => void;
  onSave: (address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  }) => void;
};

export default function AddressFormModal({ onClose, onSave }: AddressFormProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">Tambah Alamat Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Nama lengkap", name: "name", type: "text" },
            { label: "No. Telepon", name: "phone", type: "tel" },
            { label: "Alamat Jalan", name: "street", type: "text" },
            { label: "Kota/Kabupaten", name: "city", type: "text" },
            { label: "Provinsi", name: "province", type: "text" },
            { label: "Kode Pos", name: "postalCode", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label htmlFor={name} className="block mb-1 font-medium">
                {label}:
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={form[name as keyof typeof form]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
