
import { motion } from 'framer-motion';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Shield, Users, Heart, AlertTriangle } from 'lucide-react';

const Guidelines = () => {
  const sections = [
    {
      icon: Users,
      title: "Community Standards",
      content: [
        "Maintain professional and respectful communication at all times",
        "Use appropriate language and avoid offensive content",
        "Respect diverse opinions and engage in constructive discussions",
        "Help foster a welcoming environment for all members"
      ]
    },
    {
      icon: Shield,
      title: "Data & Privacy",
      content: [
        "Protect your personal information and that of other members",
        "Do not share sensitive information publicly",
        "Respect members' privacy settings and boundaries",
        "Report any suspected privacy violations immediately"
      ]
    },
    {
      icon: Heart,
      title: "Member Conduct",
      content: [
        "Uphold the values and traditions of the Man O' War Club",
        "Support fellow members in their professional and personal growth",
        "Participate actively in community discussions and events",
        "Mentor newer members and share your expertise"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Harassment, bullying, or discriminatory behavior",
        "Spam, promotional content, or commercial solicitation",
        "Sharing false or misleading information",
        "Any illegal activities or content"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <SEO 
        title="Community Guidelines - SMMOWCUB"
        description="Community guidelines and member conduct for Senior Members of the Man O' War Club, University of Benin."
        pathname="/guidelines"
      />
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These guidelines help maintain the integrity and spirit of our exclusive alumni community.
              All members are expected to uphold these standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-card rounded-lg p-6 shadow-lg border"
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className="h-8 w-8 text-[#E10600] mr-3" />
                    <h2 className="text-2xl font-semibold">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + (itemIndex * 0.1) }}
                        className="flex items-start"
                      >
                        <div className="w-2 h-2 bg-[#E10600] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 bg-muted rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Approval Process</h3>
            <p className="text-muted-foreground mb-4">
              All new member applications go through a verification process:
            </p>
            <ol className="space-y-2 text-muted-foreground">
              <li>1. Submit complete registration with required information</li>
              <li>2. Verification of Man O' War Club membership credentials</li>
              <li>3. Review by the secretariat for approval</li>
              <li>4. Welcome to the SMMOWCUB community upon approval</li>
            </ol>
            <p className="mt-4 text-sm text-muted-foreground">
              For questions about the approval process, contact secretary@smmowcub.org
            </p>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Guidelines;
