import Brands from "@/components/landingpage/brands";
import BrowseByDressStyle from "@/components/landingpage/BrowseByDressStyle";
import OurHappyCustomers from "@/components/landingpage/ourhappycustomer";
import ProductGrid from "@/components/landingpage/ProductGrid";
import Footer from "@/components/navbar/navbar/footer";
import Navbar from "@/components/navbar/navbar/Navbar";
import Banner from "@/components/landingpage/Banner";
import TopSellingSection from "@/components/landingpage/topselling";
import Sidebar from "@/components/navbar/navbar/Sidebar";

export default function Home() {
  return (
    <div>
    <Navbar />
    <Banner />
    <Brands />
    <ProductGrid/>
    <TopSellingSection/>
    <BrowseByDressStyle/>
    <OurHappyCustomers/>
    <Footer />
    
    
    </div>
  )
}