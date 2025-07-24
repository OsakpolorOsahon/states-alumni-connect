
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ContactSection = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      info: "csmowcub1154@gmail.com",
      description: "Get in touch with our secretariat"
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+234 705 735 8410",
      description: "Speak directly with our team"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "University of Benin, Benin City",
      description: "Edo State, Nigeria"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Get in <span className="text-[#E10600]">Touch</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Have questions about membership, events, or want to connect with fellow alumni? 
              We're here to help and would love to hear from you.
            </p>

            <div className="space-y-6 mb-8">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon;
                return (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="bg-[#E10600]/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-[#E10600]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{method.title}</h4>
                      <p className="text-[#E10600] font-medium mb-1">{method.info}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link to="/contact">
              <Button className="bg-[#E10600] hover:bg-[#C10500] group">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/community-event-2.jpg"
                alt="SMMOWCUB alumni gathering and fellowship"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#E10600]/20 rounded-lg"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
