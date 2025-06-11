"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/lib/axios";

type Product = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  category?: { name: string };
  store: {
    id: string;
    name: string;
    address: string;
  };
  storeLatitude?: number;
  storeLongitude?: number;
  distance?: number;
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchProducts = async (lat?: number, lng?: number) => {
      try {
        const response = await axios.get("/product/all");
        let data: Product[] = response.data;

        if (lat && lng) {
          data = data.map((product) => {
            if (product.storeLatitude && product.storeLongitude) {
              const distance = getDistanceFromLatLonInKm(
                lat,
                lng,
                product.storeLatitude,
                product.storeLongitude
              );
              return { ...product, distance };
            }
            return product;
          });

          data.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        }

        setProducts(data);
      } catch (err) {
        setError("Failed to load new arrivals");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          fetchProducts(latitude, longitude);
        },
        () => {
          fetchProducts(); // fallback jika ditolak
        }
      );
    } else {
      fetchProducts(); // fallback jika tidak support
    }
  }, []);

  const productsToShow = showAll ? products : products.slice(0, 4);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-t-4 border-gray-500 rounded-full"></div>
        <span>Loading new arrivals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900">NEW ARRIVALS</h2>

        {userCoords && (
          <p className="text-sm text-gray-600 mt-1">
            Menampilkan produk terdekat dari lokasi Anda ({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)})
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {productsToShow.map((product, index) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-md transition relative"
            >
              {index === 0 && product.distance !== undefined && (
                <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs rounded">
                  🏷️ Terdekat
                </span>
              )}
              <Link href={`/detail/${product.id}`}>
                <img
                  src={product.imageUrl || "/default-product-image.png"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </Link>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600 truncate">{product.description}</p>
                <p className="mt-2 text-xl font-semibold text-gray-800">${product.price}</p>
                {product.oldPrice && (
                  <p className="text-sm text-red-500 line-through">${product.oldPrice}</p>
                )}
                <p className="text-sm text-gray-500 mt-1 italic">
                  {product.category?.name || "Uncategorized"} • {product.store?.name ?? "No Store"}
                </p>
                {product.distance !== undefined && (
                  <p className="text-xs text-gray-500 mt-1">📍 {product.distance.toFixed(2)} km dari lokasi Anda</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            {showAll ? "Tampilkan Lebih Sedikit" : "Tampilkan Semua"}
          </button>
        </div>
      </div>
    </section>
  );
}
