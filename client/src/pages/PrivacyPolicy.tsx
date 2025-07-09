
import { motion } from 'framer-motion';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <SEO 
        title="Privacy Policy - SMMOWCUB"
        description="Privacy policy for Senior Members of the Man O' War Club, University of Benin alumni network."
        pathname="/privacy-policy"
      />
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account,
              update your profile, or contact us. This includes your name, email address, phone number,
              professional information, and any other information you choose to provide.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share
              your information only in the following circumstances:
            </p>
            <ul>
              <li>With your consent</li>
              <li>For legal reasons or to protect rights</li>
              <li>With service providers who assist us in operating our platform</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at
              secretary@smmowcub.org.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;
