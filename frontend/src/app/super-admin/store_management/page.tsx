// "use client";

// import Navbar from "@/components/navbar/navbar/Navbar";
// import Footer from "@/components/navbar/navbar/footer";
// import Sidebarsup from "@/components/navbar/navbar/Sidebarsup";
// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import AddStockModal from "@/components/modal/addstock";
// import EditStockModal from "@/components/modal/editstock";

// interface StockItem {
//   id: string;
//   productName: string;
//   quantity: number;
//   store: {
//     id: string;
//     name: string;
//   };
// }

// export default function InventoryManagement() {
//   const { data: session, status } = useSession();
  
//   // 💡 Data Dummy
//   const [stocks, setStocks] = useState<StockItem[]>([
//     {
//       id: "1",
//       productName: "Beras Premium 5kg",
//       quantity: 50,
//       store: { id: "s1", name: "Toko Satu" },
//     },
//     {
//       id: "2",
//       productName: "Minyak Goreng 2L",
//       quantity: 120,
//       store: { id: "s2", name: "Toko Dua" },
//     },
//     {
//       id: "3",
//       productName: "Gula Pasir 1kg",
//       quantity: 80,
//       store: { id: "s1", name: "Toko Satu" },
//     },
//   ]);

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [stockToEdit, setStockToEdit] = useState<StockItem | null>(null);

//   const handleAddStock = (newStock: StockItem) => {
//     setStocks((prev) => [...prev, newStock]);
//   };

//   const handleDeleteStock = (id: string) => {
//     if (!confirm("Yakin ingin menghapus stok ini?")) return;
//     setStocks((prev) => prev.filter((item) => item.id !== id));
//   };

//   const handleEditClick = (stock: StockItem) => {
//     setStockToEdit(stock);
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateStock = (updatedStock: StockItem) => {
//     setStocks((prev) =>
//       prev.map((item) => (item.id === updatedStock.id ? updatedStock : item))
//     );
//   };

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <p className="text-gray-600 text-lg">Memeriksa sesi pengguna...</p>
//       </div>
//     );
//   }

//   if (!session || session.user?.role !== "SUPER_ADMIN") {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <p className="text-red-600 text-lg font-semibold">
//           Anda tidak memiliki akses ke halaman ini.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="flex min-h-screen bg-gray-50">
//         <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
//           <Sidebarsup />
//         </aside>

//         <main className="flex-1 p-8 max-w-full">
//           <div className="mb-8 p-6 bg-white rounded-lg shadow-md max-w-md">
//             <p className="text-gray-500 text-sm mb-1">Kelola data stok produk</p>
//             <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
//               {session.user?.name ?? "Super Admin"}
//             </h2>
//             <span className="inline-block px-4 py-1 text-xs font-semibold text-white bg-purple-700 rounded-full uppercase tracking-wide select-none">
//               {session.user?.role ?? "SUPER_ADMIN"}
//             </span>
//           </div>

//           <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//             <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
//               Inventory Management
//             </h1>
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
//               aria-label="Tambah Stok"
//             >
//               ➕ Tambah Stok
//             </button>
//           </div>

//           <div className="mb-8 inline-block px-6 py-3 bg-green-100 text-green-900 rounded-lg shadow-sm font-semibold select-none">
//             Total Produk: <span className="text-2xl">{stocks.length}</span>
//           </div>

//           {stocks.length === 0 ? (
//             <p className="text-gray-600 text-center py-10 text-lg">
//               Tidak ada data stok ditemukan.
//             </p>
//           ) : (
//             <div className="overflow-x-auto rounded-lg shadow-lg bg-white border border-gray-200">
//               <table className="min-w-full table-auto border-collapse">
//                 <thead className="bg-gray-100 text-gray-700">
//                   <tr>
//                     <th className="px-4 py-2 border">#</th>
//                     <th className="px-4 py-2 border">Nama Produk</th>
//                     <th className="px-4 py-2 border">Jumlah</th>
//                     <th className="px-4 py-2 border">Toko</th>
//                     <th className="px-4 py-2 border">Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {stocks.map((stock, idx) => (
//                     <tr key={stock.id} className="hover:bg-gray-50">
//                       <td className="px-4 py-2 border text-center">{idx + 1}</td>
//                       <td className="px-4 py-2 border">{stock.productName}</td>
//                       <td className="px-4 py-2 border text-center">{stock.quantity}</td>
//                       <td className="px-4 py-2 border">{stock.store.name}</td>
//                       <td className="px-4 py-2 border text-center space-x-2">
//                         <button
//                           onClick={() => handleEditClick(stock)}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteStock(stock.id)}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           🗑️ Hapus
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <AddStockModal
//             open={isAddModalOpen}
//             onClose={() => setIsAddModalOpen(false)}
//             onAdd={handleAddStock}
//             token=""
//           />

//           <EditStockModal
//             open={isEditModalOpen}
//             onClose={() => setIsEditModalOpen(false)}
//             onUpdate={handleUpdateStock}
//             token=""
//             stockToEdit={stockToEdit}
//           />
//         </main>
//       </div>
//       <Footer />
//     </>
//   );
// }
