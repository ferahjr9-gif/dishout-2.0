import React from 'react';
import { COLORS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import AnimatedLogo from './AnimatedLogo';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logout } = useAuth();
  
  const navItems = [
    { id: 'home', label: 'SnapFood' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'terms', label: 'Terms' }
  ];

  const handleAuthAction = async () => {
    if (currentUser) {
      try {
        await logout();
        setCurrentPage('home');
      } catch (error) {
        console.error("Failed to log out", error);
      }
    } else {
      setCurrentPage('auth');
    }
  };

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
          className="flex items-center hover:opacity-90 transition-opacity group"
          aria-label="SnapFood Home"
        >
          <div className="flex items-center tracking-tighter select-none font-bold font-['Space_Grotesk']">
            {/* 'Snap' in White */}
            <span className="text-2xl md:text-3xl text-white">Snap</span>
            
            {/* 'Food' with Infinity Symbol */}
            <div className="flex items-center ml-px">
              {/* 'F' in Green */}
              <span className="text-2xl md:text-3xl text-[#4ADE80]">F</span>
              
              {/* Animated Icon (Yellow) - Replaces 'oo' */}
              {/* Negative margins to pull F and d closer */}
              <div className="-mx-1 md:-mx-1.5 flex items-center justify-center pt-1.5 md:pt-2">
                <AnimatedLogo />
              </div>
              
              {/* 'd' in Green */}
              <span className="text-2xl md:text-3xl text-[#4ADE80]">d</span>
            </div>
          </div>
        </button>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            {navItems.slice(1).map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.id ? 'text-[#4ADE80]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 hidden md:block"></div>

          <button
            onClick={handleAuthAction}
            className={`text-sm font-bold px-4 py-1.5 rounded-lg transition-all ${
              currentUser 
                ? 'text-gray-300 hover:text-white hover:bg-white/10' 
                : 'bg-[#4ADE80] text-[#121212] hover:bg-[#22C55E] shadow-lg shadow-green-900/20'
            }`}
          >
            {currentUser ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;