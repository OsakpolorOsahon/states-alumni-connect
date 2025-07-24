
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleDirectoryClick = () => {
    // Directory is public, always navigate to it
    navigate('/directory');
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with red overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
        {/* You can replace this with an actual background image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-[#E10600] opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight bounce-in">
          Senior Members Man O' War Club{" "}
          <span className="text-[#E10600] glitch-hover">University Of Benin</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed slide-in-left">
          A secure portal for our Statesmen to connect, learn, and be recognized.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 slide-in-right">
          <Button 
            onClick={handleDirectoryClick}
            size="lg" 
            className="bg-[#E10600] hover:bg-[#C10500] text-white px-8 py-3 text-lg font-semibold btn-animated ripple-effect tilt-hover"
            aria-label="View Alumni Directory"
          >
            View Directory
          </Button>
          <Link to="/signup">
            <Button 
              size="lg" 
              className="bg-white hover:bg-gray-100 text-[#E10600] border-2 border-white px-8 py-3 text-lg font-semibold btn-animated ripple-effect tilt-hover"
              aria-label="Member Sign Up"
            >
              Member Sign Up
            </Button>
          </Link>

        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center items-center space-x-6 mb-8 progressive-load">
          <a 
            href="https://www.facebook.com/csmowcub1154" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-[#E10600] transition-colors duration-200 icon-hover"
            aria-label="Follow us on Facebook"
          >
            <Facebook className="h-6 w-6" />
          </a>
          <a 
            href="https://www.x.com/csmowcub1154" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-[#E10600] transition-colors duration-200 icon-hover"
            aria-label="Follow us on Twitter"
          >
            <Twitter className="h-6 w-6" />
          </a>
          <a 
            href="https://www.instagram.com/csmowcub1154" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-[#E10600] transition-colors duration-200"
            aria-label="Follow us on Instagram"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a 
            href="http://www.linkedin.com/in/csmowcub1154" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-[#E10600] transition-colors duration-200"
            aria-label="Follow us on LinkedIn"
          >
            <Linkedin className="h-6 w-6" />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
