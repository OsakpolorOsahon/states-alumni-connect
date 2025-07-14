
import { motion } from 'framer-motion';
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import HistorySection from "@/components/HistorySection";
import SimpleDirectorySection from "@/components/SimpleDirectorySection";
import HallOfFameSection from "@/components/HallOfFameSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background dark:bg-background page-transition smooth-scroll"
    >
      <SEO 
        title="SMMOWCUB – Senior Members of the Man O' War Club, UNIBEN"
        description="Official portal for Senior Members of the Man O' War Club, University of Benin alumni network. Connect with fellow statesmen and build lasting professional relationships."
        pathname="/"
      />
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <HistorySection />
      <SimpleDirectorySection />
      <HallOfFameSection />
      <ContactSection />
      <Footer />
    </motion.div>
  );
};

export default Index;
