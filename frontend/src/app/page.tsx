import Brands from "@/components/landingpage/brands";
import BrowseByDressStyle from "@/components/landingpage/BrowseByDressStyle";
import OurHappyCustomers from "@/components/landingpage/ourhappycustomer";
import ProductGrid from "@/components/landingpage/newarrival";
import Footer from "@/components/navbar/navbar/footer";
import Navbar from "@/components/navbar/navbar/Navbar";
import Banner from "@/components/landingpage/Banner";
import TopSellingSection from "@/components/landingpage/topselling";
import StoreList from "@/components/landingpage/storelist";


export default function Home() {
  return (
    <div>
    <Navbar />
    <Banner />
    <Brands />
    <ProductGrid/>
    <TopSellingSection/>
    <StoreList/>
    <BrowseByDressStyle/>
    <OurHappyCustomers/>
    <Footer />
    
    
    </div>
  )
}