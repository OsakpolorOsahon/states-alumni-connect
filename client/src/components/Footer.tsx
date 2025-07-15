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

  return (
    <footer className="bg-gray-900 dark:bg-black text-white relative z-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/images/logo-transparent.png"
                alt="SMMOWCUB Logo"
                className="h-12 w-auto mr-3"
              />
              <div>
                <h3 className="text-2xl font-bold text-[#E10600]">SMMOWCUB</h3>
                <p className="text-sm text-gray-300">Senior Members, Man O' War Club</p>
              </div>
            </div>
            
            <p className="text-gray-300 max-w-md leading-relaxed mb-6">
              Bringing together the legacy and leadership of UNIBEN's Man O' War Club alumni 
              through an exclusive digital brotherhood.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-[#E10600] transition-all duration-300 hover:scale-110 transform"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#E10600]">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#E10600] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#E10600]">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-[#E10600] mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:secretary@smmowcub.org"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  secretary@smmowcub.org
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-[#E10600] mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+2348030000000"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                >
                  +234 (0) 803 xxx xxxx
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#E10600] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  University of Benin, Benin City, Edo State, Nigeria
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 SMMOWCUB. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-use"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Terms of Use
              </Link>
              <Link
                to="/guidelines"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                Community Guidelines
              </Link>
              <Link
                to="/user-manual"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              >
                User Manual
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;