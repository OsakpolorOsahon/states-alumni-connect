import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Directory', href: '/directory' },
    { name: 'News', href: '/news' },
    { name: 'News & Events', href: '/news-events' },
    { name: 'Hall of Fame', href: '/hall-of-fame' },
    { name: 'Contact', href: '/contact' },
    { name: 'User Manual', href: '/user-manual' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/csmowcub1154', label: 'Facebook' },
    { icon: Twitter, href: 'https://www.x.com/csmowcub1154', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/csmowcub1154', label: 'Instagram' },
    { icon: Linkedin, href: 'http://www.linkedin.com/in/csmowcub1154', label: 'LinkedIn' },
  ];

  // Debug: Let's add a simple test to see if the footer is rendering
  console.log("Footer component is rendering");

  return (
    <footer 
      className="bg-red-500 text-white w-full min-h-[200px] p-8" 
      style={{ 
        backgroundColor: '#E10600',
        color: 'white',
        minHeight: '200px',
        padding: '2rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">FOOTER TEST</h1>
        <p className="text-white text-xl mb-8">This is a test footer to check if it's rendering</p>
        
        {/* Brand Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/logo-transparent.png"
              alt="SMMOWCUB Logo"
              className="h-12 w-auto mr-3"
            />
            <div>
              <h3 className="text-2xl font-bold text-white">SMMOWCUB</h3>
              <p className="text-sm text-white">Senior Members, Man O' War Club</p>
            </div>
          </div>
          
          <p className="text-white max-w-md mx-auto leading-relaxed mb-6">
            Bringing together the legacy and leadership of UNIBEN's Man O' War Club alumni 
            through an exclusive digital brotherhood.
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-8">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white text-red-600 rounded-full hover:bg-gray-200 transition-all duration-300"
                  aria-label={social.label}
                >
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-white hover:text-gray-300 transition-colors duration-300 px-4 py-2 border border-white rounded"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-white" />
              <a
                href="mailto:secretary@smmowcub.org"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                secretary@smmowcub.org
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-white" />
              <a
                href="tel:+2348030000000"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                +234 (0) 803 xxx xxxx
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-white" />
              <span className="text-white">
                University of Benin, Benin City, Edo State, Nigeria
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white">
          <p className="text-white text-sm mb-4">
            © 2025 SMMOWCUB. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/privacy-policy"
              className="text-white hover:text-gray-300 text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              className="text-white hover:text-gray-300 text-sm transition-colors duration-300"
            >
              Terms of Use
            </Link>
            <Link
              to="/guidelines"
              className="text-white hover:text-gray-300 text-sm transition-colors duration-300"
            >
              Community Guidelines
            </Link>
            <Link
              to="/user-manual"
              className="text-white hover:text-gray-300 text-sm transition-colors duration-300"
            >
              User Manual
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;