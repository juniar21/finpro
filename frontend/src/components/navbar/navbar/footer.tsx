// components/Footer.js
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 pt-8">
      {/* Newsletter section */}
      <div className="bg-black text-white p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:px-16">
        <h2 className="text-xl font-bold uppercase max-w-md text-center md:text-left">
          Stay up to date about <br /> our latest offers
        </h2>
        <form className="flex w-full max-w-md space-x-2">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-grow rounded-full py-2 px-4 text-black focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="bg-white text-black font-semibold rounded-full px-6 hover:bg-gray-200"
          >
            Subscribe to Newsletter
          </button>
        </form>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-6 gap-8">
        {/* Shop.co Logo and description */}
        <div className="md:col-span-2">
          <h1 className="font-bold text-2xl mb-3">SHOP.CO</h1>
          <p className="text-sm mb-4">
            We have clothes that suits your style and which you’re proud to wear.
            From women to men.
          </p>
          <div className="flex space-x-3 mb-4">
            {/* Social icons */}
            <a href="#" aria-label="Twitter" className="hover:text-black">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.03 9.03 0 01-2.88 1.1A4.5 4.5 0 0016.88 0a4.5 4.5 0 00-4.4 5.5 12.8 12.8 0 01-9.3-4.7 4.5 4.5 0 001.4 6.07 4.46 4.46 0 01-2-.55v.05a4.5 4.5 0 003.6 4.4 4.5 4.5 0 01-2 .07 4.5 4.5 0 004.2 3.13A9 9 0 012 19.54a12.7 12.7 0 006.88 2"></path>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-black">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22 12a10 10 0 10-11 9.9v-7h-3v-3h3v-2a3 3 0 013-3h3v3h-3v2h3l-1 3h-2v7a10 10 0 007-9z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-black">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="5"
                  ry="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></rect>
                <path
                  d="M16 11.37A4 4 0 1112.63 8a4 4 0 013.37 3.37z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <line
                  x1="17.5"
                  y1="6.5"
                  x2="17.51"
                  y2="6.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></line>
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-black">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 0a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.22c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 00-1.34-1.76c-1.1-.75.09-.74.09-.74a2.52 2.52 0 011.84 1.23 2.56 2.56 0 003.49 1 2.57 2.57 0 01.77-1.6c-2.67-.3-5.47-1.34-5.47-5.96a4.66 4.66 0 011.23-3.24 4.32 4.32 0 01.12-3.19s1-.33 3.3 1.23a11.36 11.36 0 016 0c2.28-1.56 3.28-1.23 3.28-1.23a4.32 4.32 0 01.13 3.19 4.66 4.66 0 011.23 3.24c0 4.64-2.8 5.65-5.47 5.96a2.88 2.88 0 01.83 2.22v3.29c0 .32.22.7.82.58A12 12 0 0012 0z"></path>
              </svg>
            </a>
          </div>
          <p className="text-xs text-gray-500">&copy; 2000-2023 Shop.co, All Rights Reserved</p>
        </div>

        {/* Footer Links */}
        <div>
          <h3 className="uppercase tracking-wider text-xs font-semibold mb-3">Company</h3>
          <ul className="space-y-1 text-sm">
            <li>
             
                <a className="hover:underline">About</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/features"> */}
                <a className="hover:underline">Features</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/works"> */}
                <a className="hover:underline">Works</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/career"> */}
                <a className="hover:underline">Career</a>
              {/* </Link> */}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="uppercase tracking-wider text-xs font-semibold mb-3">Help</h3>
          <ul className="space-y-1 text-sm">
            <li>
              {/* <Link href="/customer-support"> */}
                <a className="hover:underline">Customer Support</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/delivery-details"> */}
                <a className="hover:underline">Delivery Details</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/terms-conditions"> */}
                <a className="hover:underline">Terms & Conditions</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/privacy-policy"> */}
                <a className="hover:underline">Privacy Policy</a>
              {/* </Link> */}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="uppercase tracking-wider text-xs font-semibold mb-3">FAQ</h3>
          <ul className="space-y-1 text-sm">
            <li>
              {/* <Link href="/account"> */}
                <a className="hover:underline">Account</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/manage-deliveries"> */}
                <a className="hover:underline">Manage Deliveries</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/orders"> */}
                <a className="hover:underline">Orders</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/payments"> */}
                <a className="hover:underline">Payments</a>
              {/* </Link> */}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="uppercase tracking-wider text-xs font-semibold mb-3">Resources</h3>
          <ul className="space-y-1 text-sm">
            <li>
              {/* <Link href="/free-ebooks"> */}
                <a className="hover:underline">Free eBooks</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/development-tutorial"> */}
                <a className="hover:underline">Development Tutorial</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/how-to-blog"> */}
                <a className="hover:underline">How to - Blog</a>
              {/* </Link> */}
            </li>
            <li>
              {/* <Link href="/youtube-playlist"> */}
                <a className="hover:underline">Youtube Playlist</a>
              {/* </Link> */}
            </li>
          </ul>
        </div>
      </div>

      {/* Payment icons */}
      <div className="container mx-auto px-6 pb-6 flex justify-end space-x-4">
        <img src="/payments/visa.svg" alt="Visa" className="h-8" />
        <img src="/payments/mastercard.svg" alt="Mastercard" className="h-8" />
        <img src="/payments/paypal.svg" alt="Paypal" className="h-8" />
        <img src="/payments/applepay.svg" alt="Apple Pay" className="h-8" />
        <img src="/payments/googlepay.svg" alt="Google Pay" className="h-8" />
      </div>
    </footer>
  );
}
