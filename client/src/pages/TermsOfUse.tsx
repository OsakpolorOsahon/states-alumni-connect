
import { motion } from 'framer-motion';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const TermsOfUse = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <SEO 
        title="Terms of Use - SMMOWCUB"
        description="Terms of use for Senior Members of the Man O' War Club, University of Benin alumni network."
        pathname="/terms-of-use"
      />
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Use</h1>
          <div className="prose prose-lg max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>

            <h2>Membership Eligibility</h2>
            <p>
              This platform is exclusively for Senior Members of the Man O' War Club, University of Benin.
              Membership requires verification and approval by the secretariat.
            </p>

            <h2>User Conduct</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of your account</li>
              <li>Respect other members and maintain professional conduct</li>
              <li>Not engage in any illegal or harmful activities</li>
              <li>Not share sensitive information publicly</li>
            </ul>

            <h2>Content Guidelines</h2>
            <p>
              All content shared on this platform should be appropriate, respectful, and relevant
              to the SMMOWCUB community. We reserve the right to remove any content that violates
              these guidelines.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The content on this website, including text, graphics, logos, and images, is owned
              by SMMOWCUB and is protected by copyright laws.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              SMMOWCUB shall not be liable for any direct, indirect, incidental, or consequential
              damages arising from the use of this platform.
            </p>

            <h2>Contact</h2>
            <p>
              For questions regarding these terms, contact us at secretary@smmowcub.org.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default TermsOfUse;
