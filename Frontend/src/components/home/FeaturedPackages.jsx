import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/forms";
import { Star, ArrowRight, Clock, MapPin, Users, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPackages } from "@/services/packageService";

/**
 * Component to display a curated list of featured packages.
 * Fetches packages from API and shows one from each tier (Elite, Pro, Premium).
 */
const FeaturedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setLoading(true);
        const data = await fetchPackages();
        
        // Get packages from Puri or Bhubaneswar for featured section
        const relevantPackages = data.filter(p => 
          ["Puri", "Bhubaneswar"].includes(p.primaryDestination)
        );
        
        // Get one package of each type (Elite, Pro, Premium)
        const elitePkg = relevantPackages.find(p => p.type === "Elite");
        const proPkg = relevantPackages.find(p => p.type === "Pro");
        const premiumPkg = relevantPackages.find(p => p.type === "Premium");
        
        // Create distinct list
        const sortedPackages = [elitePkg, proPkg, premiumPkg].filter(Boolean);
        
        // If we don't have enough tier-specific packages, just use the first 3
        if (sortedPackages.length === 0 && data.length > 0) {
          setPackages(data.slice(0, 3));
        } else {
          setPackages(sortedPackages);
        }
      } catch (err) {
        console.error('Error loading featured packages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPackages();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#FAF9F6]">
        <div className="container mx-auto px-4 flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </section>
    );
  }

  if (error || packages.length === 0) {
    return null; // Don't show the section if there's an error or no packages
  }

  return (
    <section className="py-24 bg-[#FAF9F6]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-wider uppercase mb-4">
            Curated Experiences
          </span>
          <p className="text-gray-500 text-lg">
            Handpicked packages designed to give you the best of Odisha's spiritual heritage, natural beauty, and cultural richness.
          </p>
        </motion.div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {packages.map((pkg, index) => {
            const isElite = pkg.type === "Elite";
            const isPro = pkg.type === "Pro";
            
            // Get the main image - handle both array and single image
            const mainImage = Array.isArray(pkg.images) && pkg.images.length > 0 
              ? pkg.images[0] 
              : (pkg.image || '/placeholder.svg');
            
            // Get locations array or construct from primaryDestination
            const locations = pkg.locations || [pkg.primaryDestination];
            
            // Get highlights or facilities
            const features = pkg.highlights || pkg.facilities || [];
            
            return (
              <motion.div
                key={pkg._id || pkg.id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group rounded-3xl transition-all duration-300 h-full flex flex-col overflow-hidden bg-white text-gray-900 shadow-xl border border-gray-100 hover:border-orange-100"
              >
                {/* Image Section */}
                <div className="h-56 w-full overflow-hidden relative">
                    <img 
                        src={mainImage} 
                        alt={pkg.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                    {/* Badge Overlay */}
                     <div className="absolute top-4 left-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                        isElite ? "bg-amber-500 text-black" : 
                        isPro ? "bg-blue-500 text-white" : 
                        "bg-emerald-500 text-white"
                        }`}>
                        {pkg.type}
                        </span>
                    </div>
                     {/* Rating Overlay */}
                     <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                        <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                        <span className="text-gray-900">{pkg.rating || 4.5}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
 
                     <div className="mb-4">
                        {/* Title */}
                        <h3 className="text-xl font-serif font-bold mb-2 text-gray-900">
                        {pkg.name}
                        </h3>
                        
                        {/* Duration & Group Size */}
                        <div className="flex items-center gap-4 text-xs mt-2 mb-3">
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            {pkg.duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Users className="w-3.5 h-3.5" />
                            {pkg.groupSize}
                        </div>
                        </div>

                        {/* Locations */}
                        <div className="flex items-start gap-1.5 text-xs mb-4 text-orange-500">
                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">
                            {locations.join(" → ")}
                        </span>
                        </div>
                    </div>

                    {/* Facilities (Tags) */}
                    <div className="flex flex-wrap gap-2 mb-8">
                    {features.slice(0, 4).map((feature, i) => (
                        <span 
                        key={i} 
                        className="text-xs px-2.5 py-1 rounded-md font-medium bg-orange-50 text-orange-700 border border-orange-100"
                        >
                        {feature}
                        </span>
                    ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-auto px-8 pb-8">
                    <Link to={`/packages?state=odisha&destination=${pkg.primaryDestination}`}>
                    <Button 
                        variant="outline" 
                        className="w-full py-6 rounded-xl text-base font-medium transition-all hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                    >
                        View Details
                    </Button>
                    </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-16">
          <Link to="/packages">
             <span className="text-gray-500 hover:text-orange-600 font-medium inline-flex items-center gap-2 transition-colors cursor-pointer">
               View packages for other destinations <ArrowRight className="w-4 h-4" />
             </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
