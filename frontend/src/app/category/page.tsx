// pages/index.tsx
import Filter from '@/components/categorypage.tsx/filter';
import ProductList from '@/components/categorypage.tsx/productlist';
import Footer from '@/components/navbar/navbar/footer';
import Navbar from '@/components/navbar/navbar/Navbar';
import React from 'react';


const Home = () => {
  return (
    <div>
        <Navbar />
        <div className="flex">
          {/* Filter Sidebar */}
          <Filter />

          {/* Product Listing */}
          <div className="flex-1 p-6">
              < ProductList/>
          </div>
      </div>
          <Footer />
          </div>
  );
};

export default Home;
