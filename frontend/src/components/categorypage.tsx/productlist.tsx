
import React from 'react';
import ProductCard from './productcard';


const ProductList = () => {
  const products = [
    {
      name: 'Gradient Graphic T-shirt',
      price: 145,
      discount: 20,
      rating: 3.5,
      imgSrc: '/kaos.png',
    },
    {
      name: 'Polo with Tipping Details',
      price: 180,
      rating: 4.5,
      imgSrc: '/kaos.png',
    },
    // Add more products here
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.name} {...product} />
      ))}
    </div>
  );
};

export default ProductList;
