// // app/(user)/address/create/page.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// interface Address {
//   label: string;
//   value: string;
// }

// export default function CreateAddressPage() {
//   const router = useRouter();
//   const [provinces, setProvinces] = useState<Address[]>([]);
//   const [cities, setCities] = useState<Address[]>([]);
//   const [formData, setFormData] = useState({
//     recipientName: "",
//     phoneNumber: "",
//     province: "",
//     city: "",
//     fullAddress: "",
//     postalCode: "",
//   });

//   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     if (name === "province") {
//       await fetchProvinces(value);
//     }

//     if (name === "city") {
//       await fetchCities(value, formData.province);
//     }
//   };

//   const fetchProvinces = async (keyword: string) => {
//     try {
//       const res = await axios.get("/rajaongkir/searchDestination", {
//         params: { keyword },
//       });

//       const uniqueProvinces = Array.from(
//         new Set(res.data.map((item: any) => item.province))
//       ).map((province) => ({
//         label: province,
//         value: province,
//       }));

//       setProvinces(uniqueProvinces);
//     } catch (error) {
//       console.error("Gagal mengambil provinsi:", error);
//     }
//   };

//   const fetchCities = async (keyword: string, province: string) => {
//     try {
//       const res = await axios.get("/rajaongkir/searchDestination", {
//         params: { keyword },
//       });

//       const filtered = res.data.filter(
//         (item: any) => item.province.toLowerCase() === province.toLowerCase()
//       );

//       const uniqueCities = Array.from(
//         new Set(filtered.map((item: any) => item.city))
//       ).map((city) => ({
//         label: city,
//         value: city,
//       }));

//       setCities(uniqueCities);
//     } catch (error) {
//       console.error("Gagal mengambil kota:", error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.post("/address", formData);
//       router.push("/address");
//     } catch (error) {
//       console.error("Gagal menyimpan alamat:", error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto py-10 px-4">
//       <h1 className="text-2xl font-bold mb-6">Tambah Alamat</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Nama Penerima */}
//         <div>
//           <label htmlFor="recipientName" className="block mb-1 font-semibold">
//             Nama Penerima
//           </label>
//           <input
//             type="text"
//             id="recipientName"
//             name="recipientName"
//             value={formData.recipientName}
//             onChange={handleChange}
//             required
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Nomor Telepon */}
//         <div>
//           <label htmlFor="phoneNumber" className="block mb-1 font-semibold">
//             Nomor Telepon
//           </label>
//           <input
//             type="text"
//             id="phoneNumber"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             required
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Provinsi */}
//         <div>
//           <label htmlFor="province" className="block mb-1 font-semibold">
//             Provinsi
//           </label>
//           <input
//             type="text"
//             id="province"
//             name="province"
//             list="province-list"
//             value={formData.province}
//             onChange={handleChange}
//             required
//             className="w-full border rounded px-3 py-2"
//             placeholder="Ketik nama provinsi"
//           />
//           <datalist id="province-list">
//             {provinces.map((prov) => (
//               <option key={prov.value} value={prov.label} />
//             ))}
//           </datalist>
//         </div>

//         {/* Kota/Kabupaten */}
//         <div>
//           <label htmlFor="city" className="block mb-1 font-semibold">
//             Kota/Kabupaten
//           </label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             list="city-list"
//             value={formData.city}
//             onChange={handleChange}
//             required
//             className="w-full border rounded px-3 py-2"
//             placeholder="Ketik nama kota/kabupaten"
//           />
//           <datalist id="city-list">
//             {cities.map((city) => (
//               <option key={city.value} value={city.label} />
//             ))}
//           </datalist>
//         </div>

//         {/* Alamat Lengkap */}
//         <div>
//           <label htmlFor="fullAddress" className="block mb-1 font-semibold">
//             Alamat Lengkap
//           </label>
//           <input
//             type="text"
//             id="fullAddress"
//             name="fullAddress"
//             value={formData.fullAddress}
//             onChange={handleChange}
//             required
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Kode Pos */}
//         <div>
//           <label htmlFor="postalCode" className="block mb-1 font-semibold">
//             Kode Pos
//           </label>
//           <input
//             type="text"
//             id="postalCode"
//             name="postalCode"
//             value={formData.postalCode}
//             onChange={handleChange}
//             required
//             className="w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Submit */}
//         <div className="pt-4">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Simpan Alamat
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
