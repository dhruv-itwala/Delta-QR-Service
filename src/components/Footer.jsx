import React from 'react';
import { ExternalLink, Code2 } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      name: 'Portfolio',
      url: 'https://dhruv-itwala-portfolio.onrender.com/',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Dhruv-Itwala',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/dhruv-itwala/',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/itwala_dhruv',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      url: 'https://api.whatsapp.com/send/?phone=9104438800&text&type=phone_number&app_absent=0',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@dhruvitwala?si=81XhgXpErB6sjjx5',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor"></polygon>
        </svg>
      )
    }
  ];

  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Left Section: Developer Credits */}
        <div className="developer-credits-card">
          <div className="dev-meta">
            <div className="dev-badge">
              <Code2 size={14} />
              <span>Developed by</span>
            </div>
            <a
              href="https://dhruv-itwala-portfolio.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="dev-name-link"
              title="Visit Dhruv Itwala's Portfolio"
            >
              <span>DHRUV ITWALA</span>
              <ExternalLink size={14} className="ext-icon" />
            </a>
          </div>

          {/* Social Icons Row */}
          <div className="dev-socials-row">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                title={item.name}
                aria-label={item.name}
              >
                {item.icon}
                <span className="social-tooltip">{item.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Right / Bottom Info */}
        <div className="footer-app-info">
          <p className="app-copyright">
            <strong>Detla Qr Service</strong> &bull; Free opensource for you
          </p>
          <p className="app-privacy-note">
            Privacy-First &bull; Zero Server Tracking &bull; 100% Client-Side Processing
          </p>
        </div>
      </div>
    </footer>
  );
}

