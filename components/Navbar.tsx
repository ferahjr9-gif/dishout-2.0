import React from 'react';
import { COLORS } from '../constants';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'DishOut' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'terms', label: 'Terms' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div 
        className="max-w-4xl mx-auto rounded-2xl px-6 py-3 flex justify-between items-center"
        style={{
          background: COLORS.glassBg,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${COLORS.glassBorder}`
        }}
      >
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-2xl font-bold tracking-tighter"
        >
          <span className="text-white">Dish</span>
          <span style={{ color: COLORS.vibrantPersimmon }}>Out</span>
        </button>

        <div className="flex space-x-6">
          {navItems.slice(1).map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentPage === item.id ? 'text-[#FF4500]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;