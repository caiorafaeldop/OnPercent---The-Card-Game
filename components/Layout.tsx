import React from 'react';
import { Tab } from '../types';
import { ListIcon, CalendarIcon, BookIcon, TrophyIcon, MoonIcon, SunIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, isDark, toggleTheme }) => {
  const navItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'habits', icon: <ListIcon className="w-6 h-6" />, label: 'Hábitos' },
    { id: 'dashboard', icon: <CalendarIcon className="w-6 h-6" />, label: 'Dashboard' },
    { id: 'journal', icon: <BookIcon className="w-6 h-6" />, label: 'Diário' },
    { id: 'profile', icon: <TrophyIcon className="w-6 h-6" />, label: 'Perfil' },
  ];

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      
      {/* Top Bar for Theme Toggle */}
      <div className="absolute top-0 right-0 p-4 z-50">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-all active:scale-95"
        >
          {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-hidden relative max-w-md mx-auto w-full h-full pt-12">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="h-20 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900 flex justify-around items-center px-4 pb-2 z-40 max-w-md mx-auto w-full fixed bottom-0 left-0 right-0 md:relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center space-y-1 w-16 transition-all duration-300
                ${isActive ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70'}
              `}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;