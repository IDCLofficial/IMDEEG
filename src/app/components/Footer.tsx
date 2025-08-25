"use client"

import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import { useState } from 'react';
import React from 'react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0, direction = 'up' }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const initial =
    direction === 'up'
      ? 'translate-y-6'
      : direction === 'down'
      ? '-translate-y-6'
      : direction === 'left'
      ? '-translate-x-6'
      : 'translate-x-6';

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${initial}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface FooterLink {
  name: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface ContactInfo {
  icon: React.ReactNode;
  text: string;
}

// No external props; Footer owns its content

const ContactItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-start space-x-3">
    <div className="text-white/70 mt-1">{icon}</div>
    <p className="text-white/70">{text}</p>
  </div>
);

export default function Footer() {
  // Internal content (can be swapped later to fetch from CMS)
  const logo = '/logo.png';
  const ministryName = 'Ministry of Digital Economy and eGovernment';
  const description = "Positioning Imo as Nigeria’s leading digital economy state by deploying \ne‑government platforms, building smart city infrastructure, and expanding connectivity across communities. Through SkillUp Imo, we equip youths and entrepreneurs with in‑demand digital skills, creating jobs, powering startups, and delivering faster, more transparent public services for all Imolites.";
  const contactInfo: ContactInfo[] = [
    { icon: <FiMapPin className="h-5 w-5" />, text: 'Ministry of Digital Economy & E-Government, 28 Egbu Road, Owerri, Imo State, Nigeria.' },
    { icon: <FiMail className="h-5 w-5" />, text: 'info@mdeeg.im.gov.ng' },
    { icon: <FiPhone className="h-5 w-5" />, text: '+234 913 027 0514' },
  ];
  const columns: FooterColumn = { 
    title: 'Quick Links', 
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Home', href: '/' },
      { name: 'News', href: '/news' },
      { name: 'Departments', href: '/departments' },
      { name: 'Events', href: '/events' },
    ]
  };
  const socialLinks = [
    { name: 'Facebook', href: '#', icon: <FiFacebook className="h-5 w-5" /> },
    { name: 'Twitter', href: '#', icon: <FiTwitter className="h-5 w-5" /> },
    { name: 'LinkedIn', href: '#', icon: <FiLinkedin className="h-5 w-5" /> },
  ];
  const copyright = '© 2025 Imo State Ministry of Housing and Urban Development. All rights reserved';
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    if (success) {
        const timer = setTimeout(() => setSuccess(false), 2500);
        return () => clearTimeout(timer);
    }
}, [success]);
  return (
    // <footer className="bg-[#06163A] text-white">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
    //       {/* Company Info */}
    //       <div className="space-y-6">
    //         <div className="flex items-center gap-2">
    //           <Image
    //             src={logo}
    //             alt="Company Logo"
    //             width={120}
    //             height={40}
    //             className="h-10 w-auto"
    //           />
    //           <span className='text-white/70'>Imo state {ministryName}</span>
    //         </div>
    //         <p className="text-white/70">
    //           {description}
    //         </p>
            
    //         <div className="space-y-4 mt-6">
    //           {contactInfo.map((info, index) => (
    //             <ContactItem key={index} icon={info.icon} text={info.text} />
    //           ))}
    //         </div>
    //       </div>
    //       {/* Links Columns */}
    //       {columns.map((column) => (
    //         <div key={column.title}>
    //           <h3 className="text-lg font-semibold mb-6">{column.title}</h3>
    //           <ul className="space-y-3">
    //             {column.links.map((link) => (
    //               <li key={link.name}>
    //                 <Link 
    //                   href={link.href}
    //                   className="text-white/70 hover:text-white transition-colors duration-200"
    //                 >
    //                   {link.name}
    //                 </Link>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       ))}
    //       <div className="flex flex-col space-x-4 pt-4">
    //         <h3 className="text-lg font-semibold mb-6">Social Links</h3>
    //         {socialLinks.map((social) => (
    //           <a 
    //             key={social.name}
    //             href={social.href}
    //             className="text-white/70 hover:text-white transition-colors duration-200"
    //             aria-label={social.name}
    //           >
    //             {social.icon}
    //           </a>
    //         ))}
    //       </div>
    //     </div>
        
    //     {/* Copyright */}
    //     <div className="border-t border-white/10 mt-16 pt-8">
    //       <p className="text-center text-white/60 text-sm">
    //         {copyright}
    //       </p>
    //     </div>
    //   </div>
    // </footer>


    <footer className="w-full bg-white pt-10 px-4 lg:px-18">
          <div className="mx-auto px-4 flex flex-col md:flex-row justify-between gap-8 pb-8">
              {/* Logo and Description */}
              <Reveal direction="up">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-3 mb-2">
                      <Image src={logo} alt="Imo State Logo" width={40} height={40} />
                      <span className="font-semibold text-sm text-gray-900 leading-tight">
                      Imo State Ministry<br />
                      of {ministryName}
                      </span>
                  </div>
                  <p className="text-xs text-gray-600 max-w-xs">
                      {description}
                  </p>
                </div>
              </Reveal>
              {/* Quick Links */}
              <Reveal direction="up" delay={100}>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
                  <div className="flex flex-col flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
                      {columns.links.map((link, idx) => (
                        <Reveal key={link.name} delay={idx * 60} direction="up">
                          <Link href={link.href} className="hover:underline">{link.name}</Link>
                        </Reveal>
                      ))}
                  </div>
                </div>
              </Reveal>
              {/* Newsletter and Contact */}
              <Reveal direction="up" delay={200}>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-3">Newsletter</h4>
                  <Reveal direction="up" delay={100}>
                    <form className="flex mb-3" onSubmit={async (e) => {
                        e.preventDefault();
                        setSuccess(false);
                        setLoading(true);
                        // Simulate async subscription (replace with API call if needed)
                        setTimeout(() => {
                            setSuccess(true);
                            setLoading(false);
                        }, 1000);
                    }}>
                        <input
                            type="email"
                            placeholder="Myemail@gmail.com"
                            className="border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="bg-primary-green hover:bg-primary-green/80 text-white px-4 py-2 rounded-r text-sm font-medium flex items-center justify-center min-w-[100px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-1">
                                    <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a 8 8 0 018-8v8z"></path></svg>
                                    Loading
                                </span>
                            ) : (
                                "Subscribe"
                            )}
                        </button>
                    </form>
                  </Reveal>
                  {success && (
                      <Reveal direction="up" delay={100}>
                        <div className="animate-fade-in top-30">
                          <div className="bg-white border border-green-300 shadow-lg px-6 py-4 rounded-lg flex items-center gap-3 min-w-[220px] relative">
                              <span className="text-green-600 text-base font-medium">Thank you for subscribing!</span>
                              <button
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-lg"
                              onClick={() => setSuccess(false)}
                              aria-label="Close"
                              type="button"
                              >
                              &times;
                              </button>
                          </div>
                          <style jsx global>{`
                              @keyframes fade-in {
                              from { opacity: 0; transform: translateY(-20px); }
                              to { opacity: 1; transform: translateY(0); }
                              }
                              .animate-fade-in {
                              animation: fade-in 0.4s cubic-bezier(0.4,0,0.2,1);
                              }
                          `}</style>
                        </div>
                      </Reveal>
                  )}
                  <div className="text-xs text-gray-700 space-y-1 flex flex-col">
                      {contactInfo.map((item, idx) => (
                          <Reveal key={item.text} delay={idx * 60} direction="up">
                            <span>{item.text}</span>
                          </Reveal>
                      ))}
                  </div>
                </div>
              </Reveal>
          </div>
          <Reveal direction="up" delay={150}>
            <div className="border-t border-gray-200 text-center py-3 text-sm text-gray-500">Powered by <a href="https://imodigitalcity.com/" target="_blank" rel="noopener noreferrer" className='text-primary-green hover:text-primary-green/80'>Imo Digital City Limited.</a></div>
          </Reveal>
        </footer>
  );
}
