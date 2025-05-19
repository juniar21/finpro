"use client"
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [showPromo, setShowPromo] = useState(true);

  return (
    <>
      {/* Promo Bar */}
      {showPromo && (
        <div className="bg-black text-white text-center text-sm py-2 px-4 relative">
          <span>
            Sign up and get 20% off to your first order.{" "}
            
              <a className="underline font-semibold hover:text-gray-300">Sign Up Now</a>
           
          </span>
          <button
            onClick={() => setShowPromo(false)}
            className="absolute right-2 top-2 text-white hover:text-gray-400"
            aria-label="Close Promo"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
        <Link href="/" className="font-bold text-xl">SHOP.CO</Link>

          {/* Menu */}
          <ul className="hidden md:flex space-x-6 items-center">
            <li className="relative group">
              <button className="flex items-center space-x-1 hover:text-gray-700">
                <span>Shop</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {/* Dropdown placeholder, add dropdown content if needed */}
            </li>
            <li>
              
                <a className="hover:text-gray-700">On Sale</a>
             
            </li>
            <li>
             
              <Link href="/category" className="hover:text-gray-700">New Arrivals</Link>
          
            </li>
            <li>
            <Link href="/category" className="hover:text-gray-700">
                Brands
            </Link>
            </li>
          </ul>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <input
              type="search"
              placeholder="Search for products..."
              className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link href="/shippingcart" aria-label="Cart" className="hover:text-gray-700">
              <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293-2.293a1 1 0 00-.707-.707L3 7m4 6l.6 3M16 17a2 2 0 11-4 0m6 0a2 2 0 11-4 0"
              ></path>
              </svg>
            </Link>

            {/* User Icon */}
            <button aria-label="User Account" className="hover:text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A7 7 0 0112 14a7 7 0 016.879 3.804M12 12a5 5 0 100-10 5 5 0 000 10z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
