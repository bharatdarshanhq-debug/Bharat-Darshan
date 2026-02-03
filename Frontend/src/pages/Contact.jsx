import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/forms";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    question: "How do I book a package?",
    answer: "You can book directly through our website by clicking 'Book Now' on any package, or contact us via WhatsApp/call. We'll guide you through the process and confirm your booking with a minimal advance payment.",
  },
  {
    question: "What is the cancellation policy?",
    answer: "Cancellations made 30+ days before travel get 90% refund. 15-30 days: 50% refund. Less than 15 days: No refund, but date change may be possible. Emergency cases are handled individually.",
  },
  {
    question: "Are meals included in packages?",
    answer: "It depends on the package type. Elite packages include all meals, Pro packages include breakfast, and Premium packages include breakfast. Check individual package details for specifics.",
  },
  {
    question: "Do you provide pickup from airport/station?",
    answer: "Yes! All our packages include complimentary pickup and drop from Bhubaneswar Airport or Railway Station. For other locations, we can arrange at additional cost.",
  },
  {
    question: "Can I customize a package?",
    answer: "Absolutely! We specialize in customized tours. Tell us your preferences, dates, budget, and group size â€” we'll create a perfect itinerary just for you.",
  },
  {
    question: "Is it safe to travel to Odisha?",
    answer: "Odisha is one of the safest states in India for tourists. We ensure verified hotels, trained drivers, and 24/7 support. Solo travelers and families are equally welcome.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    package: "",
    destination: "",
  });

  const destinations = ["Puri", "Bhubaneswar", "Chilika", "Konark"];
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const [status, setStatus] = useState({ loading: false, error: null });

  // API URL construction - handles cases where VITE_API_URL includes /api
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const API_URL = API_BASE.includes('/api') ? API_BASE : `${API_BASE.replace(/\/$/, "")}/api`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    
    const contactUrl = `${API_URL}/contact`;

    
    try {
      const res = await fetch(contactUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "", package: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('[Contact] Error:', err);
      setStatus({ loading: false, error: err.message });
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 md:pt-32">
        {/* Hero */}
        <section className="bg-hero-gradient py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
                Get in Touch
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                Have questions? Ready to book? We're here to help you plan 
                the perfect Odisha adventure.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 -mt-20">
              {[
                { icon: Phone, title: "Call Us", info: "+91 72050 99129", action: "tel:+917205099129" },
                { icon: MessageCircle, title: "WhatsApp", info: "+91 72050 99129", action: "https://wa.me/917205099129" },
                { icon: Mail, title: "Email", info: "bharatdarshan.hq@gmail.com", action: "mailto:bharatdarshan.hq@gmail.com" },
                { icon: Clock, title: "Hours", info: "24/7 Support", action: null },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.action || "#"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-elevated transition-all duration-300 border border-border hover:border-primary/30"
                >
                  <div className="w-14 h-14 rounded-xl bg-hero-gradient flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.info}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 bg-warm-gradient">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-emerald-800 mb-2">Message Sent!</h3>
                    <p className="text-emerald-700">We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="+91 72050 99129"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Interested Package
                        </label>
                        <select
                          value={formData.package}
                          onChange={(e) => setFormData({ ...formData, package: e.target.value, destination: "" })}
                          className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select a package</option>
                          <option value="Premium">Premium</option>
                          <option value="Pro">Pro</option>
                          <option value="Elite">Elite</option>
                        </select>
                      </div>

                      {formData.package && (
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Destination
                          </label>
                          <select
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          >
                            <option value="">Select destination</option>
                            {destinations.map((dest) => (
                              <option key={dest} value={dest}>{dest}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        placeholder="Tell us about your travel plans..."
                      />
                    </div>


                    {status.error && (
                      <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg border border-red-200">
                        {status.error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="xl" 
                      className="w-full"
                      disabled={status.loading}
                    >
                      {status.loading ? 'Sending...' : 'Send Message'}
                      {!status.loading && <Send className="w-5 h-5 ml-2" />}
                    </Button>
                  </form>
                )}
              </motion.div>

              {/* Office Info */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Visit Our Office
                </h2>
                
                <div className="bg-card rounded-2xl overflow-hidden shadow-card mb-8">
                  <div className="h-64 bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-muted-foreground">Map placeholder</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">Bharat Darshan Travels</h3>
                    <p className="text-muted-foreground mb-4">
                      Grand Road, Near Jagannath Temple,<br />
                      Puri, Odisha - 752001, India
                    </p>
                    <div className="flex gap-3">
                      <Button variant="default" size="sm">
                        Get Directions
                      </Button>
                      <Button variant="outline" size="sm">
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="bg-hero-gradient rounded-2xl p-6 text-primary-foreground">
                  <h3 className="font-serif text-xl font-bold mb-4">Need Immediate Help?</h3>
                  <p className="text-primary-foreground/80 mb-4">
                    Our travel experts are available 24/7 to assist you with bookings, 
                    queries, or any travel emergencies.
                  </p>
                  <a href="https://wa.me/917205099129" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-secondary text-primary text-sm font-medium mb-4">
                “ FAQs
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-secondary rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-foreground pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
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

export default Contact;
