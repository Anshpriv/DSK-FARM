import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Stay', href: '#stay' },
    { name: 'Amenities', href: '#amenities' },
    { name: 'Info', href: '#info' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex flex-col justify-center">
            <span className="text-3xl font-bold text-green-700 tracking-tight">DSK Farm</span>
            <span className="text-xs text-orange-500 font-semibold tracking-widest uppercase">By Hempushpa Farm</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <a 
              href={`tel:${CONTACT_INFO.phone1}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Phone size={18} />
              Book Now
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-green-600 block px-3 py-3 rounded-md text-base font-bold text-center"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex justify-center">
               <a 
                href={`tel:${CONTACT_INFO.phone1}`}
                className="w-full mx-4 bg-orange-500 text-white text-center py-3 rounded-xl font-bold shadow-md"
              >
                Call to Book
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;