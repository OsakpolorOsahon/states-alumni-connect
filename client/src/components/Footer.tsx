import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  // Add logging to debug
  React.useEffect(() => {
    console.log('Footer component mounted');
  }, []);

  return (
    <div style={{
      backgroundColor: '#E10600',
      color: 'white',
      padding: '40px 20px',
      marginTop: '50px',
      width: '100%',
      minHeight: '300px',
      display: 'block',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: 'white'
        }}>
          SMMOWCUB FOOTER
        </h1>
        
        <p style={{
          fontSize: '18px',
          marginBottom: '30px',
          color: 'white'
        }}>
          Senior Members, Man O' War Club - University of Benin
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Quick Links */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '20px' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us</Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/directory" style={{ color: 'white', textDecoration: 'none' }}>Directory</Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/news" style={{ color: 'white', textDecoration: 'none' }}>News</Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/hall-of-fame" style={{ color: 'white', textDecoration: 'none' }}>Hall of Fame</Link>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '20px' }}>Contact</h3>
            <div style={{ marginBottom: '10px' }}>
              <Mail style={{ display: 'inline', marginRight: '10px', width: '16px', height: '16px' }} />
              <a href="mailto:secretary@smmowcub.org" style={{ color: 'white', textDecoration: 'none' }}>
                secretary@smmowcub.org
              </a>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <Phone style={{ display: 'inline', marginRight: '10px', width: '16px', height: '16px' }} />
              <a href="tel:+2348030000000" style={{ color: 'white', textDecoration: 'none' }}>
                +234 (0) 803 xxx xxxx
              </a>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <MapPin style={{ display: 'inline', marginRight: '10px', width: '16px', height: '16px' }} />
              <span style={{ color: 'white' }}>
                University of Benin, Benin City, Edo State, Nigeria
              </span>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '20px' }}>Follow Us</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <a href="https://www.facebook.com/csmowcub1154" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                <Facebook style={{ width: '24px', height: '24px' }} />
              </a>
              <a href="https://www.x.com/csmowcub1154" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                <Twitter style={{ width: '24px', height: '24px' }} />
              </a>
              <a href="https://www.instagram.com/csmowcub1154" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                <Instagram style={{ width: '24px', height: '24px' }} />
              </a>
              <a href="http://www.linkedin.com/in/csmowcub1154" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                <Linkedin style={{ width: '24px', height: '24px' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid white',
          paddingTop: '20px',
          marginTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
            © 2025 SMMOWCUB. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
              Terms of Use
            </Link>
            <Link to="/guidelines" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
              Community Guidelines
            </Link>
            <Link to="/user-manual" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
              User Manual
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;