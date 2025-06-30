
import { motion } from 'framer-motion';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Award, Users, Target, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in all our endeavors, maintaining the highest standards of leadership and professionalism."
    },
    {
      icon: Users,
      title: "Brotherhood",
      description: "Our bonds go beyond professional networks - we are a family united by shared values and experiences."
    },
    {
      icon: Target,
      title: "Leadership",
      description: "Developing and nurturing leaders who make positive impacts in their communities and professions."
    },
    {
      icon: Heart,
      title: "Service",
      description: "Committed to serving humanity and making meaningful contributions to society."
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
        title="About Us - SMMOWCUB"
        description="Learn about the Senior Members of the Man O' War Club, University of Benin - our history, mission, and values."
        pathname="/about"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#E10600]/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">About SMMOWCUB</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The Senior Members of the Man O' War Club, University of Benin, represents a legacy 
              of leadership, discipline, and excellence that spans over five decades.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                To foster continued growth, mentorship, and professional development among our distinguished 
                alumni while upholding the traditions and values that define the Man O' War spirit.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through this exclusive digital platform, we connect Statesmen across the globe, creating 
                opportunities for collaboration, support, and the advancement of our shared ideals.
              </p>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="SMMOWCUB gathering"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These fundamental principles guide our actions and define our character as Statesmen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 bg-background rounded-lg shadow-sm"
                >
                  <div className="w-16 h-16 bg-[#E10600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-[#E10600]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Our Legacy</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Founded on the principles of character development and service to humanity, SMMOWCUB has been 
              shaping future leaders for generations. Our alumni have gone on to become influential figures 
              across various sectors—from government and military to business and academia.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This exclusive portal serves as a bridge connecting our distinguished graduates, ensuring that 
              the spirit of excellence and the Man O' War tradition lives on in every generation of UNIBEN graduates.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default About;
