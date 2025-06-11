"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "@/lib/axios"; // Adjust according to your project structure
import { Loader2 } from "lucide-react";

export default function TopSellingSection() {
  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product/all"); // Your API endpoint here
        setProducts(response.data); // Assuming response.data contains the product array
      } catch (err: any) {
        setError("Failed to load products");
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
        <Loader2 className="animate-spin h-10 w-10" />
        <span>Loading products...</span>
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

  const productsToShow = showAll ? products : products.slice(0, 4); // Show first 4 products or all if 'showAll' is true

  return (
    <section className="w-full bg-white py-12 px-6">
      {/* Top Selling */}
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-3xl font-extrabold text-gray-900">TOP SELLING</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {productsToShow.map((product: any) => (
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
                  ${product.price} <span className="line-through text-red-500">${product.oldPrice}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll((prev) => !prev)} // Toggle view all products
            className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      </div>
    </section>
  );
}
