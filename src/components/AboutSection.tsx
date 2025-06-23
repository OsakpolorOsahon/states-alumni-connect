
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About SMMOWCUB
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column with red accent border */}
          <div className="relative">
            <div className="absolute left-0 top-0 w-1 h-full bg-[#E10600]"></div>
            <div className="pl-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                The Student Man O' War Command of the University of Benin (SMMOWCUB) stands as a beacon of leadership, discipline, and excellence. Founded on the principles of character development and service to humanity, our organization has been shaping future leaders for over five decades.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Our alumni, known as Statesmen, have gone on to become influential leaders across various sectors—from government and military to business and academia. This exclusive portal serves as a bridge connecting our distinguished graduates, fostering continued growth, mentorship, and professional development.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                Through shared values of integrity, courage, and service, we continue to uphold the legacy that defines the Man O' War tradition, ensuring that the spirit of excellence lives on in every generation of UNIBEN graduates.
              </p>
              
              <Link to="/history">
                <Button 
                  variant="outline" 
                  className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white group"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column with image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="SMMOWCUB Alumni in uniform at a ceremonial gathering"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#E10600] rounded-lg opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
