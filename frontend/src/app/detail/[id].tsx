// // pages/detailpage/[id].tsx
// "use client";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { FaStar } from "react-icons/fa";

// const products = [
//   {
//     id: 1,
//     name: "ONE LIFE GRAPHIC T-SHIRT",
//     price: 260,
//     originalPrice: 300,
//     rating: 4.5,
//     reviews: 124,
//     colors: ["#3D3B37", "#3C4F52", "#CFCFCF"],
//     sizes: ["S", "M", "L", "XL"],
//     images: ["/kaos.png", "/kaos.png", "/kaos.png", "/kaos.png"],
//     description:
//       "This graphic t-shirt is crafted from soft, breathable cotton for all-day comfort.",
//   },
//   {
//     id: 2,
//     name: "SKINNY FIT JEANS",
//     price: 240,
//     originalPrice: 280,
//     rating: 4.0,
//     reviews: 58,
//     colors: ["#000000", "#4B0082", "#C0C0C0"],
//     sizes: ["S", "M", "L", "XL"],
//     images: ["/jeans.png", "/jeans.png", "/jeans.png"],
//     description: "A stylish pair of jeans with a comfortable fit for daily wear.",
//   },
//   // Add other products as needed
// ];

// export default function ProductDetail() {
//   const [selectedColor, setSelectedColor] = useState<string>("");
//   const [selectedSize, setSelectedSize] = useState<string>("");
//   const [selectedImage, setSelectedImage] = useState<string>("");
//   const [product, setProduct] = useState<any>(null);  // State to hold the current product
//   const router = useRouter();
//   const { id } = router.query;  // Extract the product id from the URL

//   useEffect(() => {
//     if (id) {
//       const foundProduct = products.find((product) => product.id === parseInt(id as string));
//       if (foundProduct) {
//         setProduct(foundProduct);
//         setSelectedColor(foundProduct.colors[0]);
//         setSelectedSize(foundProduct.sizes[2]);
//         setSelectedImage(foundProduct.images[0]);
//       }
//     }
//   }, [id]);

//   if (!product) return <div>Loading...</div>;

//   return (
//     <div className="bg-white">
//       <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* Left Images */}
//         <div>
//           <div className="grid grid-cols-4 gap-3 mb-4">
//             {product.images.map((img: string, i: number) => (
//               <Image
//                 key={i}
//                 src={img}
//                 alt={`thumb-${i}`}
//                 width={80}
//                 height={80}
//                 className={`rounded cursor-pointer border ${
//                   selectedImage === img ? "border-black" : "border-gray-200"
//                 }`}
//                 onClick={() => setSelectedImage(img)}
//               />
//             ))}
//           </div>
//           <Image
//             src={selectedImage}
//             alt="Product"
//             width={500}
//             height={500}
//             className="rounded-lg mx-auto"
//           />
//         </div>

//         {/* Right Info */}
//         <div>
//           <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
//           <div className="flex items-center mb-2 text-yellow-500">
//             {[...Array(5)].map((_, i) => (
//               <FaStar
//                 key={i}
//                 className={
//                   i < Math.floor(product.rating)
//                     ? "text-yellow-400"
//                     : "text-gray-300"
//                 }
//               />
//             ))}
//             <span className="ml-2 text-gray-600">({product.reviews} Reviews)</span>
//           </div>

//           <div className="mb-4 text-xl">
//             <span className="font-bold text-black">${product.price}</span>
//             {product.originalPrice && (
//               <>
//                 <span className="ml-2 line-through text-gray-500">
//                   ${product.originalPrice}
//                 </span>
//                 <span className="ml-2 text-red-500 font-semibold">
//                   {`-${Math.round(
//                     ((product.originalPrice - product.price) /
//                       product.originalPrice) *
//                       100
//                   )}%`}
//                 </span>
//               </>
//             )}
//           </div>

//           <p className="text-gray-700 mb-4 text-sm max-w-lg">
//             {product.description}
//           </p>

//           {/* Colors */}
//           <div className="mb-4">
//             <h3 className="font-semibold mb-1">Choose Color:</h3>
//             <div className="flex space-x-2">
//               {product.colors.map((color: string, idx: number) => (
//                 <div
//                   key={idx}
//                   onClick={() => setSelectedColor(color)}
//                   className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
//                     selectedColor === color ? "border-black" : "border-gray-300"
//                   }`}
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Sizes */}
//           <div className="mb-4">
//             <h3 className="font-semibold mb-1">Choose Size:</h3>
//             <div className="flex space-x-2">
//               {product.sizes.map((size: string, idx: number) => (
//                 <button
//                   key={idx}
//                   onClick={() => setSelectedSize(size)}
//                   className={`px-4 py-1 border rounded ${
//                     selectedSize === size ? "bg-black text-white" : "bg-white"
//                   }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex space-x-4 mb-4">
//             <button className="px-6 py-2 border rounded hover:bg-gray-100">
//               Add to Cart
//             </button>
//             <button className="px-6 py-2 bg-black text-white rounded">
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
