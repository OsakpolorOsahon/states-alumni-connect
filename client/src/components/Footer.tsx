import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart, Users, Shield, Trophy } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      color: 'white',
      padding: '60px 20px 20px',
      marginTop: '50px',
      width: '100%',
      position: 'relative',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.3)',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(255,255,255,0.02) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }} />
      
      {/* Top Border Line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #E10600, #ff4444, #E10600)',
        boxShadow: '0 0 10px rgba(225, 6, 0, 0.5)'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              position: 'relative',
              padding: '10px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #E10600, #ff4444)',
              boxShadow: '0 0 20px rgba(225, 6, 0, 0.3)'
            }}>
              <img
                src="/images/logo-transparent.png"
                alt="SMMOWCUB Logo"
                style={{
                  height: '50px',
                  width: 'auto',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                }}
              />
            </div>
            <div>
              <h1 style={{
                fontSize: '42px',
                fontWeight: '800',
                margin: 0,
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '2px'
              }}>
                SMMOWCUB
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#cccccc',
                margin: '5px 0 0 0',
                letterSpacing: '1px',
                fontWeight: '300'
              }}>
                EXCELLENCE • BROTHERHOOD • LEGACY
              </p>
            </div>
          </div>
          
          <p style={{
            fontSize: '20px',
            marginBottom: '20px',
            color: '#e0e0e0',
            fontWeight: '400',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Senior Members, Man O' War Club - University of Benin
          </p>

          {/* Stats Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '15px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Users style={{ width: '24px', height: '24px', color: '#E10600', marginBottom: '5px' }} />
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>500+</div>
              <div style={{ fontSize: '12px', color: '#cccccc' }}>Active Members</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '15px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Shield style={{ width: '24px', height: '24px', color: '#E10600', marginBottom: '5px' }} />
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>50+</div>
              <div style={{ fontSize: '12px', color: '#cccccc' }}>Years Legacy</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '15px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Trophy style={{ width: '24px', height: '24px', color: '#E10600', marginBottom: '5px' }} />
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>100+</div>
              <div style={{ fontSize: '12px', color: '#cccccc' }}>Achievements</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Quick Links */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: '#E10600', 
              marginBottom: '20px', 
              fontSize: '22px',
              fontWeight: '600',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                { to: '/about', text: 'About Us' },
                { to: '/directory', text: 'Directory' },
                { to: '/news', text: 'News' },
                { to: '/hall-of-fame', text: 'Hall of Fame' },
                { to: '/contact', text: 'Contact' }
              ].map(link => (
                <li key={link.to} style={{ marginBottom: '12px' }}>
                  <Link 
                    to={link.to} 
                    style={{ 
                      color: '#e0e0e0', 
                      textDecoration: 'none',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      display: 'block',
                      padding: '8px 0',
                      borderRadius: '5px'
                    }}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: '#E10600', 
              marginBottom: '20px', 
              fontSize: '22px',
              fontWeight: '600',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>Contact Us</h3>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #E10600, #ff4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <a href="mailto:secretary@smmowcub.org" style={{ 
                color: '#e0e0e0', 
                textDecoration: 'none',
                fontSize: '16px'
              }}>
                secretary@smmowcub.org
              </a>
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #E10600, #ff4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <a href="tel:+2348030000000" style={{ 
                color: '#e0e0e0', 
                textDecoration: 'none',
                fontSize: '16px'
              }}>
                +234 (0) 803 xxx xxxx
              </a>
            </div>
            <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #E10600, #ff4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin style={{ width: '18px', height: '18px', color: 'white' }} />
              </div>
              <span style={{ 
                color: '#e0e0e0',
                fontSize: '16px',
                maxWidth: '200px',
                textAlign: 'left'
              }}>
                University of Benin, Benin City, Edo State, Nigeria
              </span>
            </div>
          </div>

          {/* Social Media */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '30px',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              color: '#E10600', 
              marginBottom: '20px', 
              fontSize: '22px',
              fontWeight: '600',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>Follow Us</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <a 
                href="https://www.facebook.com/csmowcub1154" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
              >
                <Facebook style={{ width: '24px', height: '24px', color: 'white' }} />
              </a>
              <a 
                href="https://www.x.com/csmowcub1154" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
              >
                <Twitter style={{ width: '24px', height: '24px', color: 'white' }} />
              </a>
              <a 
                href="https://www.instagram.com/csmowcub1154" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
              >
                <Instagram style={{ width: '24px', height: '24px', color: 'white' }} />
              </a>
              <a 
                href="http://www.linkedin.com/in/csmowcub1154" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none'
                }}
              >
                <Linkedin style={{ width: '24px', height: '24px', color: 'white' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: '30px',
          marginTop: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <p style={{ 
              color: '#cccccc', 
              fontSize: '14px', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              © 2025 SMMOWCUB. All rights reserved. Made with <Heart style={{ width: '14px', height: '14px', color: '#E10600' }} /> for our brotherhood.
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Link to="/privacy-policy" style={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                fontSize: '14px',
                transition: 'color 0.3s ease'
              }}>
                Privacy Policy
              </Link>
              <Link to="/terms-of-use" style={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                fontSize: '14px',
                transition: 'color 0.3s ease'
              }}>
                Terms of Use
              </Link>
              <Link to="/guidelines" style={{ 
                color: '#cccccc', 
                textDecoration: 'none', 
                fontSize: '14px',
                transition: 'color 0.3s ease'
              }}>
                Guidelines
              </Link>
            </div>
          </div>
          
          {/* Motto */}
          <div style={{
            padding: '20px',
            borderRadius: '10px',
            background: 'rgba(225, 6, 0, 0.1)',
            border: '1px solid rgba(225, 6, 0, 0.3)',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#E10600',
              fontSize: '18px',
              fontWeight: '600',
              margin: 0,
              fontStyle: 'italic'
            }}>
              "Strong to Serve, Ready to Lead"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;