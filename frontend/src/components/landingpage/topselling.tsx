// components/TopSellingSection.tsx

import Link from "next/link";

export default function TopSellingSection() {
    return (
      <section className="w-full bg-white py-12 px-6">
        {/* Top Selling */}
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900">TOP SELLING</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
            {/* Product 1 */}
            <div className="border rounded-lg p-4">
                <Link href="/detail">
              <img
                src="/kemeja.png"
                alt="Product Image"
                className="w-full h-auto rounded-lg"
              />
                </Link>
              <div className="mt-4">
                <h3 className="font-semibold text-lg">Vertical Striped Shirt</h3>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  <span className="ml-2 text-gray-500">(4.5)</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-gray-800">$212 <span className="line-through text-red-500">$232</span></p>
              </div>
            </div>
            {/* Product 2 */}
            <div className="border rounded-lg p-4">
              <img
                src="/path-to-your-image.jpg"
                alt="Product Image"
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4">
                <h3 className="font-semibold text-lg">Courage Graphic T-shirt</h3>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  <span className="ml-2 text-gray-500">(4.5)</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-gray-800">$145</p>
              </div>
            </div>
            {/* Product 3 */}
            <div className="border rounded-lg p-4">
              <img
                src="/path-to-your-image.jpg"
                alt="Product Image"
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4">
                <h3 className="font-semibold text-lg">Loose Fit Bermuda Shorts</h3>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  <span className="ml-2 text-gray-500">(4.5)</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-gray-800">$80</p>
              </div>
            </div>
            {/* Product 4 */}
            <div className="border rounded-lg p-4">
              <img
                src="/path-to-your-image.jpg"
                alt="Product Image"
                className="w-full h-auto rounded-lg"
              />
              <div className="mt-4">
                <h3 className="font-semibold text-lg">Faded Skinny Jeans</h3>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                  <span className="ml-2 text-gray-500">(4.5)</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-gray-800">$210</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300">
              View All
            </button>
          </div>
        </div>
      </section>
    );
  }
  