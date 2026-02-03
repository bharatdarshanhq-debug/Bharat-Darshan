import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Lock, ArrowRight, Lightbulb, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/forms";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchDestinations } from "@/services/packageService";

const comingSoonStates = [
  { name: "Rajasthan", icon: "🏰" },
  { name: "Kerala", icon: "🌴" },
  { name: "Goa", icon: "🏖️" },
  { name: "Varanasi", icon: "🕉️" },
  { name: "Tamil Nadu", icon: "🛕" },
  { name: "Himachal", icon: "🏔️" },
];

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch destinations from API
  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Error loading destinations:', err);
        setError(err.message || 'Failed to load destinations');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDestinations();
  }, []);

  const totalPages = Math.ceil(destinations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDestinations = destinations.slice(startIndex, startIndex + itemsPerPage);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 md:pt-32">
        {/* Hero Banner */}
        <section className="bg-hero-gradient py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
                Explore Destinations
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Discover the diverse beauty of India through ancient temples, 
                pristine beaches, majestic mountains, and rich cultural heritage.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Destinations Section */}
        <section className="py-16 bg-warm-gradient">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4">
                Active Destinations
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
                India's Hidden Gems
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Handpicked destinations that showcase the true soul of India. 
                From spiritual sanctuaries to natural wonders, explore it all.
              </p>
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading destinations...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && destinations.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No destinations available at the moment.</p>
              </div>
            )}

            {/* Destinations List */}
            {!isLoading && !error && destinations.length > 0 && (
              <>
                <div className="space-y-20">
                  {currentDestinations.map((dest, index) => (
                    <motion.div
                      key={dest._id || dest.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
                    >
                      {/* Image Section */}
                      <div className="w-full lg:w-1/2 relative group">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                          
                          {/* Floating Badges */}
                          <div className="absolute top-6 left-6 flex flex-col gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-foreground text-sm font-bold shadow-lg backdrop-blur-sm">
                              <MapPin className="w-4 h-4 text-primary" />
                              {dest.location || dest.stateName || 'India'}
                            </span>
                          </div>
                          
                          <div className="absolute bottom-6 left-6 right-6">
                             <div className="flex justify-between items-end">
                                <div>
                                  <p className="text-white/80 text-sm font-medium mb-1 tracking-wider uppercase">Best Time to Visit</p>
                                  <div className="flex items-center gap-2 text-white font-semibold">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    {dest.bestTime || 'Year Round'}
                                  </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="w-full lg:w-1/2 space-y-6">
                        <div>
                          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">
                            {dest.tagline || 'Discover'}
                          </span>
                          <h3 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {dest.name}
                          </h3>
                          <p className="text-muted-foreground text-lg leading-relaxed">
                            {dest.description}
                          </p>
                        </div>

                        {/* Highlights Grid */}
                        {dest.mustVisit && dest.mustVisit.length > 0 && (
                          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
                            <h4 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                              <span className="w-8 h-1 bg-primary rounded-full"></span>
                              Must Experiences
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              {dest.mustVisit.map((attr) => (
                                <div key={attr} className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                                  <span className="text-foreground/80 font-medium">{attr}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Traveler Tip */}
                        {dest.travelTips && dest.travelTips.length > 0 && (
                          <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                              <Lightbulb className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-bold text-orange-900 text-sm mb-1">Traveler Tip</h5>
                              <p className="text-orange-800/80 text-sm">
                                {dest.travelTips[0]}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <Link to={`/packages?state=${dest.stateName?.toLowerCase() || 'odisha'}&destination=${dest.name}`}>
                            <Button size="lg" className="rounded-full px-8">
                              Explore {dest.name} Packages
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-20 flex justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 p-0 rounded-full"
                    >
                      &lt;
                    </Button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-full font-medium transition-all ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground shadow-lg scale-110"
                              : "bg-card hover:bg-secondary text-foreground"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 p-0 rounded-full"
                    >
                      &gt;
                    </Button>
                  </div>
                )}

                <div className="text-center mt-8 text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, destinations.length)} of {destinations.length} Destinations
                </div>
              </>
            )}
          </div>
        </section>

        {/* Coming Soon States */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-secondary text-primary text-sm font-medium mb-4">
                🚀 Expanding Soon
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                More States Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're working hard to bring you the same quality travel experience 
                across more incredible destinations in India.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {comingSoonStates.map((state, index) => (
                <motion.div
                  key={state.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group cursor-not-allowed"
                >
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-muted to-secondary border border-border flex flex-col items-center justify-center p-4 opacity-60">
                    <span className="text-4xl mb-2">{state.icon}</span>
                    <span className="font-medium text-foreground">{state.name}</span>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-foreground/5 flex items-center justify-center">
                    <div className="bg-card px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Lock className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">Coming Soon</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Destinations;
