// components/NewArrivalsSection.tsx

import Link from "next/link";

export default function NewArrivalsSection() {
  return (
    <section className="w-full bg-white py-12 px-6">
      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900">NEW ARRIVALS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-8">
          {/* Product 1 */}
          <div className="border rounded-lg p-4">
            <Link href="/detail">
              <img
                src="/kaos.png"
                alt="Product Image"
                className="w-full h-auto rounded-lg"
              />
            </Link>
            <div className="mt-4">
              <h3 className="font-semibold text-lg">T-shirt with Tape Details</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                <span className="ml-2 text-gray-500">(4.5)</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-gray-800">$120</p>
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
              <h3 className="font-semibold text-lg">Skinny Fit Jeans</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                <span className="ml-2 text-gray-500">(4.5)</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-gray-800">$240 <span className="line-through text-red-500">$266</span></p>
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
              <h3 className="font-semibold text-lg">Checked Shirt</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                <span className="ml-2 text-gray-500">(4.5)</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-gray-800">$180</p>
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
              <h3 className="font-semibold text-lg">Sleeve Striped T-shirt</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                <span className="ml-2 text-gray-500">(4.5)</span>
              </div>
              <p className="mt-2 text-xl font-semibold text-gray-800">$130 <span className="line-through text-red-500">$160</span></p>
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
