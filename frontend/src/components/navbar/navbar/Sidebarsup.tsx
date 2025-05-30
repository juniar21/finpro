"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiUsers, FiGrid, FiLogOut, FiHome, FiMapPin } from "react-icons/fi";
import { signOut } from "next-auth/react";

export default function Sidebarsup() {
  const pathname = usePathname();

  const menu = [
    {
      name: "Dashboard",
      href: "/super-admin",
      icon: <FiGrid size={20} />,
    },
    {
      name: "Kelola Store Admin",
      href: "/super-admin/kelola_store",
      icon: <FiUsers size={20} />,
    },
    {
      name: "Semua Pengguna",
      href: "/super-admin/semuapengguna",
      icon: <FiUsers size={20} />,
    },
    {
      name: "Kelola Toko",
      href: "/superadmin/stores",
      icon: <FiHome size={20} />,
    },
    {
      name: "Assign Store Admin",
      href: "/superadmin/assign-store-admin",
      icon: <FiMapPin size={20} />,
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-4 bg-white border-r shadow-sm">
      <div>
        <h2 className="text-xl font-bold mb-6">Super Admin</h2>
        <nav className="flex flex-col space-y-2">
          {menu.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 ${
                pathname === item.href
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-3 text-red-600 hover:text-red-800 px-4 py-2 mt-4"
      >
        <FiLogOut size={20} />
        Keluar
      </button>
    </div>
  );
}
