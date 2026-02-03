import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo_Bharat_Darshan.webp';
import adminAuthService from '../services/adminAuthService';
import { toast } from 'sonner';

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await adminAuthService.login(email, password);

      if (response.success) {
        toast.success("Login Successful", {
          description: "Welcome back to the Admin Panel."
        });
        navigate('/');
      } else {
        toast.error("Login Failed", {
          description: response.error || "Invalid credentials."
        });
      }
    } catch (error) {
      toast.error("Login Error", {
        description: "Something went wrong. Please try again."
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-background/50 border border-input rounded-xl px-4 py-3 pl-11 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 placeholder:text-muted-foreground/50";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md z-10 px-4">
        <div className="text-center mb-8">
          <motion.img 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            src={logo} 
            alt="Bharat Darshan" 
            className="h-24 mx-auto mb-4 drop-shadow-lg"
          />
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground mt-2"
          >
            Enter your credentials to access the admin panel
          </motion.p>
        </div>

        <motion.div 
          layout
          className="glass-card rounded-2xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className={iconClasses} />
              <input 
                type="text" 
                placeholder="Email Address"
                className={inputClasses}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className={iconClasses} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                className={inputClasses}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer/Help Links */}
        <div className="mt-8 text-center space-x-6 text-sm text-muted-foreground/60">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
        </div>
      </div>
    </div>
  );
}
