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
};

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product/all"); // Adjust API if needed
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load new arrivals");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const productsToShow = showAll ? products : products.slice(0, 4);

  return (
    <section className="w-full bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-extrabold text-gray-900">NEW ARRIVALS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {productsToShow.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <Link href={`/detail/${product.id}`}>
                <img
                  src={product.imageUrl || "/default-product-image.png"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </Link>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {product.description || "No description available"}
                </p>
            
                <p className="mt-2 text-xl font-semibold text-gray-800">
                  ${product.price}
                </p>
                {product.oldPrice && (
                  <p className="text-sm text-red-500 line-through">
                    ${product.oldPrice}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1 italic">
                  {product.category?.name || "Uncategorized"} •{" "}
                  {product.store?.name ?? "No Store"}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      </div>
    </section>
  );
}
