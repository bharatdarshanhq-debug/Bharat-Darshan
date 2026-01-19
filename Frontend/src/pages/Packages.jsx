import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Users, MapPin, ArrowRight, Filter, Search, Lock } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/forms";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-puri-beach.jpg";
import konarkImage from "@/assets/konark-temple.jpg";
const chilikaImage = null; // Keeping as is from original file
import jagannathImage from "@/assets/jagannath-temple.jpg";
import lingarajImage from "@/assets/lingaraj-temple.jpg";

import { packages as allPackages } from "@/data/packages";
import DestinationView from "@/components/DestinationView";

const Packages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDestination = searchParams.get("destination");

  // Scroll to top when destination changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedDestination]);

  // Get unique destinations from actual data
  const uniqueDestinations = [...new Set(allPackages.map(pkg => pkg.primaryDestination))];

  // Extra/Coming Soon Cards to make up the grid
  const comingSoonCards = [
    { name: "Kashmir" },
    { name: "Goa" },
    { name: "Kerala" },
    { name: "Andaman" },
    { name: "Varanasi" },
    { name: "Himachal" }
  ];

  const filteredPackages = allPackages.filter((pkg) => {
    if (selectedDestination) {
      return pkg.primaryDestination === selectedDestination;
    }
    return true; 
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 md:pt-32">
        {selectedDestination ? (
           <DestinationView 
              destination={selectedDestination}
              packages={filteredPackages}
              allPackages={allPackages}
              onBack={() => setSearchParams({})}
           />
        ) : (
          <>
            {/* Hero Banner */}
            <section className="relative h-64 md:h-80 overflow-hidden">
              <img
                src={heroImage}
                alt="Odisha Travel Packages"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 to-foreground/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
                    Travel Packages
                  </h1>
                  <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto px-4">
                    Curated experiences for every budget and travel style
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Destination Grid View (Default) */}
            <div className="py-16 bg-[#FAF9F6] min-h-[60vh]">
              <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                   <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Select your Destination package</h2>
                 </div>


                 <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Real Destinations */}
                    {uniqueDestinations.map((dest, index) => {
                      const destPkgs = allPackages.filter(p => p.primaryDestination === dest);
                      const coverImage = destPkgs[0]?.image || heroImage;
                      
                      return (
                        <motion.div
                          key={dest}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                          onClick={() => setSearchParams({ destination: dest })}
                        >
                           <img 
                             src={coverImage} 
                             alt={dest} 
                             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                           
                           <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                                 <ArrowRight className="w-6 h-6 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                              </div>
                           </div>

                           <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <h3 className="font-serif text-3xl font-bold text-white mb-2">{dest}</h3>
                              <p className="text-white/80 mb-6 font-medium flex items-center gap-2">
                                 <MapPin className="w-4 h-4 text-primary" />
                                 {destPkgs.length} Packages Available
                              </p>
                              
                              <Button className="w-full bg-white text-black hover:bg-primary hover:text-white border-none rounded-xl font-bold">
                                View Details
                              </Button>
                           </div>
                        </motion.div>
                      );
                    })}

                    {/* Coming Soon / Extra Cards */}
                    {comingSoonCards.map((card, index) => (
                       <motion.div
                          key={`coming-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (uniqueDestinations.length + index) * 0.1 }}
                          className="relative h-[450px] rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8 group hover:border-primary/30 hover:bg-gray-100 transition-all cursor-default"
                       >
                          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Lock className="w-8 h-8 text-gray-300" />
                          </div>
                          <h3 className="font-serif text-2xl font-bold text-gray-400 mb-3">{card.name}</h3>
                          <span className="inline-block px-4 py-1.5 bg-gray-200 text-gray-500 text-xs font-bold rounded-full uppercase tracking-wider">
                            Coming Soon
                          </span>
                          <p className="mt-4 text-xs text-gray-400 max-w-[80%]">
                             We are working on adding exciting packages for {card.name}.
                          </p>
                       </motion.div>
                    ))}
                 </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Packages;
