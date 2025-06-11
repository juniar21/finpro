"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/axios";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  images?: string[];
  category: {
    name: string;
  };
  stocks: {
    quantity: number;
  };
}

const availableColors = ["#4B4A40", "#2C2D3C", "#3D4C48"];
const availableSizes = ["Small", "Medium", "Large", "X-Large"];

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0]);
  const [selectedSize, setSelectedSize] = useState<string>("Large");
  const [quantity, setQuantity] = useState<number>(1);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.imageUrl);
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10" />
        <span>Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">{error || "Product not found."}</p>
      </div>
    );
  }

  return (
    <section className="w-full px-4 py-10 lg:py-16 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT SIDE - IMAGES */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <img
              src={selectedImage || "/default-product-image.png"}
              alt="Selected product"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="flex gap-4 mt-4">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`w-20 h-20 object-cover rounded-md border-2 cursor-pointer ${
                  selectedImage === img ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - INFO */}
        <div className="space-y-6">
          <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array(4).fill(0).map((_, i) => (
                <span key={i}>★</span>
              ))}
              <span className="text-gray-300">★</span>
            </div>
            <span className="text-sm text-gray-600">4.5/5</span>
          </div>

          {/* Description */}
          <p className="text-gray-700">{product.description}</p>

          {/* Category */}
          <p className="text-gray-500 text-sm">{product.category.name}</p>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.price !== product.originalPrice && (
              <>
                <span className="line-through text-gray-400 text-sm">
                  ${product.originalPrice}
                </span>
                <span className="text-sm text-red-500 font-medium">
                  {`-${Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}%`}
                </span>
              </>
            )}
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <p className="font-medium">Select Color</p>
            <div className="flex gap-2">
              {availableColors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                    selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Size Picker */}
          <div className="space-y-2">
            <p className="font-medium">Choose Size</p>
            <div className="flex gap-2 flex-wrap">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-1 rounded-full border ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "text-gray-700 bg-white"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
            <div className="flex items-center border rounded-md px-3 py-2 w-fit">
              <button
                className="text-xl font-bold px-2"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="px-2">{quantity}</span>
              <button
                className="text-xl font-bold px-2"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
              Add to Cart
            </button>
            <button className="w-full sm:w-auto border px-6 py-3 rounded-md hover:bg-gray-200 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
