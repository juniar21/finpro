"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/lib/axios"; // Assuming axios is configured in your lib/axios file.

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false); // State to toggle between showing all products or just a few

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product/all"); // Your API endpoint for new arrivals
        setProducts(response.data); // Assuming response.data contains the product array
      } catch (err: any) {
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

  const productsToShow = showAll ? products : products.slice(0, 4); // Show only 4 products initially

  return (
    <section className="w-full bg-white py-12 px-6">
      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900">NEW ARRIVALS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {productsToShow.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <Link href={`/detail/${product.id}`}>
                <img
                  src={product.imageUrl || "/default-product-image.png"} // Default image if none exists
                  alt={product.name}
                  className="w-full h-auto rounded-lg"
                />
              </Link>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  <span className="ml-2 text-gray-500">({product.rating || 0})</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-gray-800">
                  ${product.price}{" "}
                  {product.oldPrice && (
                    <span className="line-through text-red-500">${product.oldPrice}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)} // Toggle between showing all products or just a few
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      </div>
    </section>
  );
}
