import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import ComingSoonStates from "@/components/home/ComingSoonStates";
import Newsletter from "@/components/home/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedPackages />
        <WhyChooseUs />
        <Testimonials />
        <ComingSoonStates />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
