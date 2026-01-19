import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const states = [
  { name: "Rajasthan", icon: "🏰" },
  { name: "Kerala", icon: "🌴" },
  { name: "Goa", icon: "🏖️" },
  { name: "Varanasi", icon: "🕉️" },
  { name: "Tamil Nadu", icon: "🛕" },
  { name: "Himachal", icon: "🏔️" },
];

const ComingSoonStates = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-primary text-sm font-medium mb-4">
            Expanding Soon
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Coming Soon to More States
          </h2>
          <p className="text-muted-foreground text-lg">
            We're expanding across India! Soon you'll be able to explore more 
            incredible destinations with the same trust and quality.
          </p>
        </motion.div>

        {/* States Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {states.map((state, index) => (
            <motion.div
              key={state.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-[#F3EFEA] rounded-2xl p-6 flex flex-col items-center justify-center transition-all hover:shadow-md aspect-[4/5]">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">
                  {state.icon}
                </div>
                
                <div className="bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm mb-3">
                  <Lock className="w-3 h-3 text-orange-500" />
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">
                    Coming Soon
                  </span>
                </div>

                <h3 className="font-medium text-gray-700 text-lg">
                  {state.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Want us to come to your state first?{" "}
            <a href="/contact" className="text-primary font-medium hover:underline">
              Let us know!
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoonStates;
