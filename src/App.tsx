import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { portfolioData } from './data/portfolioData';

// --- Icons (lucide-react) ---
import { 
  ArrowRight, Award, GraduationCap, Mail, MapPin, Phone, 
  Scale, Shield, Star, Menu, Moon, Sun, X 
} from 'lucide-react';

// --- Global Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95, rotateX: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    rotateX: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

// --- Spotlight Overlay ---
const Spotlight = () => {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, .hover-trigger')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 hidden dark:block"
      style={{
        background: `radial-gradient(${isHovering ? '600px' : '420px'} circle at ${position.x}px ${position.y}px, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.08) 35%, rgba(245, 158, 11, 0.03) 60%, transparent 80%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
};

// --- GlowHeading component for local coordinates to prevent compounding viewport offsets ---
interface GlowHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2';
}

const GlowHeading = ({ children, className = '', as = 'h2' }: GlowHeadingProps) => {
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const Component = as;

  return (
    <Component
      onMouseMove={handleMouseMove}
      style={{
        ['--mouse-x' as any]: `${coords.x}px`,
        ['--mouse-y' as any]: `${coords.y}px`
      }}
      className={`reveal-glow-text relative ${className}`}
    >
      {children}
    </Component>
  );
};

// --- Custom Cards with Smooth/Heavy Black Background Morphs & Local Spotlight tracking ---

const EducationCard = ({ item, index, isDarkMode }: { item: any, index: number, isDarkMode: boolean, key?: React.Key }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.04, y: -8 }}
      transition={{ type: "spring", stiffness: 140, damping: 14 }}
      style={{
        ['--mouse-x' as any]: `${coords.x}px`,
        ['--mouse-y' as any]: `${coords.y}px`
      }}
      className={`relative p-5 sm:p-8 md:p-12 border overflow-hidden rounded-sm cursor-pointer transition-all duration-700 ease-out z-10
        ${isHovered 
          ? (isDarkMode 
              ? 'bg-white text-zinc-900 border-zinc-350 shadow-2xl' 
              : 'bg-black text-white border-zinc-550 shadow-2xl') 
          : (isDarkMode 
              ? 'bg-neutral-950/95 text-zinc-350 border-zinc-900' 
              : 'bg-zinc-100/50 text-zinc-900 border-zinc-200')
        }
      `}
    >
      {/* Light spotlight reflection following pointer inside card */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-sm"
        style={{
          background: `radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, 0.16), transparent 80%)`,
        }}
      />
      
      <div className="flex justify-between items-start relative z-10">
        <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-sm transition-colors duration-750 ease-in-out
          ${isHovered 
            ? (isDarkMode ? 'bg-zinc-100 text-zinc-850' : 'bg-neutral-900 text-zinc-200') 
            : 'bg-zinc-200/60 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-100 md:dark:text-zinc-300'
          }
        `}>
          {item.period}
        </span>
        <GraduationCap size={26} className={`transition-colors duration-750 ease-in-out ${isHovered ? (isDarkMode ? 'text-zinc-900' : 'text-zinc-100') : 'text-zinc-400 dark:text-zinc-100 md:dark:text-zinc-650'}`} />
      </div>
      
      <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-display font-black mt-8 mb-3 tracking-tight transition-colors duration-750 ease-in-out
        ${isHovered ? (isDarkMode ? 'text-zinc-900' : 'text-white') : 'text-zinc-900 dark:text-zinc-50'}
      `}>
        {item.degree}
      </h3>
      
      <p className={`text-lg sm:text-xl font-medium transition-colors duration-750 ease-in-out
        ${isHovered ? (isDarkMode ? 'text-zinc-600' : 'text-zinc-300') : 'text-zinc-655 dark:text-zinc-100 md:dark:text-zinc-400'}
      `}>
        {item.institution}
      </p>
    </motion.div>
  );
};

const OrganizationCard = ({ item, index, isDarkMode }: { item: any, index: number, isDarkMode: boolean, key?: React.Key }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const isBento = index === 0;

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.04, y: -8 }}
      transition={{ type: "spring", stiffness: 140, damping: 14 }}
      style={{
        ['--mouse-x' as any]: `${coords.x}px`,
        ['--mouse-y' as any]: `${coords.y}px`
      }}
      className={`relative p-5 sm:p-8 md:p-12 border overflow-hidden rounded-sm cursor-pointer transition-all duration-700 ease-out flex flex-col justify-between min-h-[260px] z-10
        ${isBento ? 'lg:col-span-2' : ''}
        ${isHovered 
          ? (isDarkMode ? 'bg-white text-zinc-900 border-zinc-350 shadow-2xl' : 'bg-black text-white border-zinc-500 shadow-2xl') 
          : (isDarkMode ? 'bg-neutral-950/95 text-zinc-350 border-zinc-900' : 'bg-zinc-100/50 text-zinc-900 border-zinc-200')
        }
      `}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-sm"
        style={{
          background: `radial-gradient(220px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${isHovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.03)'}, transparent 80%)`,
        }}
      />
      
      {/* Background tech grid reveals subtly on hover */}
      <div className={`absolute top-0 right-0 w-48 h-48 tech-grid transition-opacity pointer-events-none duration-700 ${isHovered ? 'opacity-25 text-zinc-100' : 'opacity-[0.05] text-zinc-400 dark:text-zinc-650'}`}></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          {item.status === 'AKTIF' ? (
             <span className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-sm transition-colors duration-750 ${isHovered ? (isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-105 text-neutral-900') : 'bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-neutral-900'}`}>
               AKTIF
             </span>
          ) : (
            <div className={`w-10 h-[2px] transition-colors duration-750 ${isHovered ? (isDarkMode ? 'bg-zinc-900' : 'bg-zinc-400') : 'bg-zinc-300 dark:bg-zinc-700'} mt-2`}></div>
          )}
          <span className={`text-xs font-black tracking-widest uppercase transition-colors duration-750 ${isHovered ? (isDarkMode ? 'text-zinc-500' : 'text-zinc-300') : 'text-zinc-550 dark:text-zinc-100 md:dark:text-zinc-400'}`}>
            {item.period}
          </span>
        </div>
        
        <h3 className={`font-display font-black tracking-tight mb-3 transition-all duration-500 ${isHovered ? 'translate-x-3 ' + (isDarkMode ? 'text-zinc-900' : 'text-white') : 'text-zinc-900 dark:text-zinc-50'} ${isBento ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-2xl'}`}>
          {item.role}
        </h3>
        <p className={`text-lg transition-colors duration-750 ease-in-out ${isHovered ? (isDarkMode ? 'text-zinc-550' : 'text-zinc-350') : 'text-zinc-650 dark:text-zinc-100 md:dark:text-zinc-400'}`}>
          {item.organization}
        </p>
      </div>

      <div className="relative z-10 flex justify-end mt-8">
        <ArrowRight size={24} className={`transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0 ' + (isDarkMode ? 'text-zinc-900' : 'text-white') : 'opacity-30 -translate-x-2 text-zinc-900 dark:text-zinc-400'}`} />
      </div>
    </motion.div>
  );
};

const AwardCard = ({ item, index, isDarkMode }: { item: any, index: number, isDarkMode: boolean, key?: React.Key }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'star': return <Star size={32} className="text-inherit" />;
      case 'award': return <Award size={32} className="text-inherit" />;
      case 'shield': return <Shield size={32} className="text-inherit" />;
      case 'scale': return <Scale size={32} className="text-inherit" />;
      default: return <Award size={32} />;
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, x: 12 }}
      transition={{ type: "spring", stiffness: 140, damping: 14 }}
      style={{
        ['--mouse-x' as any]: `${coords.x}px`,
        ['--mouse-y' as any]: `${coords.y}px`
      }}
      className={`relative group flex flex-col sm:flex-row sm:items-center justify-between p-5 sm:p-8 md:p-12 border overflow-hidden rounded-sm cursor-pointer transition-all duration-700 ease-out gap-6 sm:gap-4 z-10
        ${isHovered 
          ? (isDarkMode ? 'bg-white text-zinc-900 border-zinc-350 shadow-2xl' : 'bg-black text-white border-zinc-500 shadow-2xl') 
          : (isDarkMode ? 'bg-neutral-950/95 text-zinc-350 border-zinc-900' : 'bg-zinc-100/50 text-zinc-900 border-zinc-200')
        }
      `}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-sm"
        style={{
          background: `radial-gradient(240px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${isHovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.03)'}, transparent 80%)`,
        }}
      />

      <div className="flex items-center gap-6 sm:gap-8 relative z-10">
        <div className={`w-20 h-20 border flex items-center justify-center transition-all duration-700 rounded-sm shrink-0
          ${isHovered 
            ? (isDarkMode ? 'bg-zinc-100 text-zinc-900 border-zinc-200' : 'bg-neutral-900 text-white border-zinc-700') 
            : 'bg-zinc-100 dark:bg-neutral-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800'
          }
        `}>
          {getIcon(item.type)}
        </div>
        <h3 className={`font-display font-black text-xl sm:text-2xl lg:text-3xl transition-colors duration-750 ease-in-out ${isHovered ? (isDarkMode ? 'text-zinc-900' : 'text-white') : 'text-zinc-900 dark:text-zinc-100'}`}>
          {item.title}
        </h3>
      </div>

      <div className={`text-xs font-bold tracking-widest border px-6 py-3 self-start sm:self-auto shrink-0 relative z-10 transition-colors duration-750 ease-in-out
        ${isHovered 
          ? (isDarkMode ? 'bg-zinc-100 text-zinc-800 border-zinc-300' : 'bg-neutral-950 text-zinc-200 border-zinc-700') 
          : 'bg-zinc-150/50 dark:bg-neutral-900 text-zinc-500 dark:text-zinc-100 md:dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
        }
      `}>
        TAHUN {item.year}
      </div>
    </motion.div>
  );
};

// --- Beautiful Glowing/Explanatory CV Button Component ---
const CvButton = ({ className = "" }: { className?: string }) => {
  return (
    <div className="relative inline-block">
      <a 
        href="/files/cv-arpan.pdf"
        download="CV_Muhammad_Apriliansyah_Arpan.pdf"
        className={`px-5 py-2.5 bg-emerald-500/15 dark:bg-emerald-950/40 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm border border-emerald-500/30 dark:border-emerald-800/50 shadow-[0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] select-none text-center cursor-pointer inline-flex items-center gap-1.5 ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>UNDUH CV</span>
      </a>
    </div>
  );
};

// --- Navbar Component ---
const Navbar = ({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean, toggleDarkMode: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 py-6 bg-zinc-50/90 dark:bg-black/95 backdrop-blur-xl border-b border-zinc-200/85 dark:border-zinc-900/85 transition-colors duration-500"
      >
        <div className="font-display font-black text-xl sm:text-2xl tracking-tight text-neutral-900 dark:text-zinc-50 transition-colors duration-500 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {portfolioData.header.logo}
        </div>
        
        <div className="hidden md:flex items-center gap-10 h-full text-xs font-black tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
          {portfolioData.header.navLinks.map((link) => (
            <a key={link.name} href={link.href} className="relative group hover:text-neutral-900 dark:hover:text-zinc-50 transition-colors py-2">
              <span className="relative z-10">{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2.5 text-zinc-500 hover:text-neutral-900 dark:hover:text-zinc-50 transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Illuminated and explained CV button */}
          <CvButton />

          <a 
            href="#contact"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-emerald-600/25 border border-emerald-500/10"
          >
            HUBUNGI SAYA
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2 text-zinc-500">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-neutral-900 dark:text-zinc-50">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-zinc-50 dark:bg-neutral-950 pt-28 px-6 flex flex-col gap-6 md:hidden transition-colors duration-500 overflow-y-auto pb-12 max-h-screen"
          >
            {portfolioData.header.navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-display font-extrabold text-neutral-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-900 pb-4"
              >
                {link.name}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-5">
              <CvButton className="w-full py-4 text-center flex justify-center animate-none" />
              <a 
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-8 py-4 bg-emerald-600 text-white text-sm font-bold tracking-widest uppercase hover:bg-emerald-500 transition-colors rounded-sm text-center"
              >
                HUBUNGI SAYA
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Hero Section ---
const Hero = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center border-b border-zinc-200 dark:border-zinc-900 overflow-hidden pt-28 transition-colors duration-550">
      {/* Absolute background patterns and beautiful neon glow spheres */}
      <div className="absolute inset-0 tech-grid opacity-[0.16] dark:opacity-[0.03] text-zinc-400 dark:text-zinc-600"></div>
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-[250px] h-[250px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl -z-10 animate-pulse" style={{ animationDuration: '15s' }}></div>
      
      <div className="absolute top-0 right-0 w-1/2 h-full bg-zinc-150/30 dark:bg-neutral-900/10 border-l border-zinc-200 dark:border-zinc-900 -z-10 hidden lg:block transition-colors duration-500"></div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Text Section - Order 2 on Mobile (so photo loads FIRST), 1 on Desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 order-2 lg:order-1 flex flex-col items-start gap-8 w-full"
          >
            <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
              <div className="w-8 h-[2px] bg-emerald-500"></div>
              {portfolioData.hero.subtitle}
            </div>
            
            {/* Spotlight revealed heading in dark mode */}
            <GlowHeading as="h1" className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[1.1] tracking-tight text-neutral-900 dark:text-zinc-50 transition-colors duration-500">
              Muhammad <br className="hidden md:block"/>
              Apriliansyah Arpan
            </GlowHeading>
            
            <p className="text-zinc-650 dark:text-zinc-200 md:dark:text-zinc-400 text-lg md:text-xl md:leading-relaxed max-w-xl pl-6 border-l-4 border-emerald-500 py-2 transition-colors duration-500">
              {portfolioData.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 w-full sm:w-auto">
              <div className="flex flex-col items-stretch sm:items-start gap-1 w-full sm:w-auto">
                <a 
                  href="/files/cv-arpan.pdf"
                  download="CV_Muhammad_Apriliansyah_Arpan.pdf"
                  className="px-10 py-5 bg-neutral-900 dark:bg-zinc-100 text-zinc-50 dark:text-neutral-900 text-xs font-bold tracking-widest uppercase hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 transition-all duration-300 rounded-sm text-center w-full sm:w-auto cursor-pointer shadow-lg shadow-black/10 hover:shadow-emerald-600/10 flex items-center justify-center gap-2 select-none"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-neutral-900 animate-pulse"></span>
                  <span>{portfolioData.hero.primaryButton}</span>
                </a>
              </div>
              <a 
                href="#contact"
                className="px-10 py-5 bg-transparent border-2 border-neutral-900 dark:border-zinc-100 text-neutral-900 dark:text-zinc-100 text-xs font-bold tracking-widest uppercase hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 hover:border-emerald-600 dark:hover:border-emerald-500 transition-all duration-300 rounded-sm text-center w-full sm:w-auto hover-trigger flex items-center justify-center"
              >
                {portfolioData.hero.secondaryButton}
              </a>
            </div>
            
            {/* Hero CTA buttons end */}
          </motion.div>

          {/* Photo Section - Order 1 on Mobile (shows first!), 2 on Desktop */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex-1 order-1 lg:order-2 w-full max-w-md mx-auto relative hover-trigger"
          >
            <div className="relative aspect-[3/4] p-5 bg-zinc-50 dark:bg-neutral-950 border border-zinc-200 dark:border-zinc-900 shadow-2xl transition-colors duration-500">
              {/* Grid corner details */}
              <div className="absolute -top-6 -right-6 w-32 h-32 tech-grid opacity-50 dark:opacity-20 text-zinc-400 dark:text-zinc-700 -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 tech-grid opacity-50 dark:opacity-20 text-zinc-400 dark:text-zinc-700 -z-10"></div>
              
              {/* Profile Image - Smoothly fades grayscale color back to colorful on hover */}
              <div className="w-full h-full overflow-hidden relative">
                <img 
                  src="../files/arpan.jpeg" 
                  alt="M.A. Arpan"
                  className="w-full h-full object-cover relative z-10 grayscale border border-zinc-200/50 dark:border-zinc-850/50 transition-all duration-700 ease-in-out hover:grayscale-0 hover:scale-[1.03]"
                />
              </div>
              
              {/* Badge */}
              <div className="absolute bottom-8 -left-8 bg-zinc-50 dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-900 p-6 shadow-xl z-20 hidden md:block transition-colors duration-500">
                <p className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Fokus Utama</p>
                <p className="font-display font-bold text-base text-neutral-900 dark:text-zinc-50 leading-tight">Pelayanan Publik <br/> & Sosial</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// --- Education Section (01) ---
const Education = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <section id="education" className="py-24 md:py-32 border-b border-zinc-200 dark:border-zinc-900 px-4 sm:px-8 md:px-16 lg:px-24 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-4 sm:left-8 md:left-16 lg:left-24 w-px h-full bg-zinc-250 dark:bg-zinc-900 -z-10"></div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <motion.div
               initial={{ y: 20, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-200 md:dark:text-zinc-400 uppercase mb-4">{portfolioData.education.sectionId}</p>
              <GlowHeading as="h2" className="text-4xl md:text-5xl font-display font-extrabold text-neutral-900 dark:text-zinc-100 transition-colors duration-550">{portfolioData.education.title}</GlowHeading>
            </motion.div>
          </div>
        </div>
        
        <div className="lg:w-2/3 relative">
          <div className="absolute left-[7px] md:left-[15px] top-4 bottom-4 w-px bg-linear-to-b from-emerald-500/50 via-indigo-500/50 to-amber-500/50 hidden md:block"></div>
          {/* Decorative double glowing dots along the timeline */}
          <div className="absolute left-[3px] md:left-[11px] top-1/4 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950 shadow-md hidden md:block animate-pulse"></div>
          <div className="absolute left-[3px] md:left-[11px] top-3/4 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white dark:border-zinc-950 shadow-md hidden md:block animate-pulse" style={{ animationDelay: '1s' }}></div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-16 md:pl-16 relative"
          >
            {portfolioData.education.items.map((item, index) => (
              <EducationCard key={index} item={item} index={index} isDarkMode={isDarkMode} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Organization Section (02) ---
const Organizations = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <section id="organization" className="py-24 md:py-32 border-b border-zinc-200 dark:border-zinc-900 px-4 sm:px-8 md:px-16 lg:px-24 relative bg-zinc-100/50 dark:bg-neutral-900/5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 md:mb-24 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8"
        >
          <div>
            <p className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-200 md:dark:text-zinc-400 uppercase mb-4">{portfolioData.organizations.sectionId}</p>
            <GlowHeading as="h2" className="text-4xl md:text-5xl font-display font-extrabold mb-6 text-neutral-900 dark:text-zinc-100 transition-colors duration-550">{portfolioData.organizations.title}</GlowHeading>
            <p className="text-zinc-650 dark:text-zinc-200 md:dark:text-zinc-400 text-lg border-l-4 border-zinc-300 dark:border-zinc-700 pl-6 py-2 max-w-3xl">
              {portfolioData.organizations.subtitle}
            </p>
          </div>
        </motion.div>

        <motion.div 
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-900 shadow-sm"
        >
          {portfolioData.organizations.items.map((item, index) => (
            <OrganizationCard key={index} item={item} index={index} isDarkMode={isDarkMode} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// --- Awards Section (03) ---
const Awards = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <section id="awards" className="py-24 md:py-32 border-b border-zinc-200 dark:border-zinc-900 px-4 sm:px-8 md:px-16 lg:px-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <motion.div
               initial={{ y: 20, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
            >
              <p className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-200 md:dark:text-zinc-400 uppercase mb-4">{portfolioData.awards.sectionId}</p>
              <GlowHeading as="h2" className="text-4xl md:text-5xl font-display font-extrabold mb-6 text-neutral-900 dark:text-zinc-100 transition-colors duration-550">{portfolioData.awards.title}</GlowHeading>
              <p className="text-zinc-650 dark:text-zinc-200 md:dark:text-zinc-400 text-lg border-l-4 border-zinc-300 dark:border-zinc-700 pl-6 py-2">{portfolioData.awards.subtitle}</p>
            </motion.div>
          </div>
        </div>
        
        <div className="lg:w-2/3">
          <motion.div 
             variants={containerVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="flex flex-col gap-6"
          >
            {portfolioData.awards.items.map((item, index) => (
              <AwardCard key={index} item={item} index={index} isDarkMode={isDarkMode} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- ContactCard Component with local spotlight and interactive 3rd party actions ---
const ContactCard = ({ item, isDarkMode }: { item: any, isDarkMode: boolean, key?: React.Key }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone size={26} className="text-inherit animate-pulse" />;
      case 'email': return <Mail size={26} className="text-inherit" />;
      case 'location': return <MapPin size={26} className="text-inherit animate-bounce" style={{ animationDuration: '3s' }} />;
      default: return <Mail size={26} className="text-inherit" />;
    }
  };

  // Setup click action URL based on contact type
  const getHref = () => {
    if (item.type === 'phone') {
      const cleanPhone = item.value.replace(/[^0-9+]/g, '');
      let waNum = cleanPhone;
      if (waNum.startsWith('0')) {
        waNum = '62' + waNum.slice(1);
      } else if (waNum.startsWith('+62')) {
        waNum = '62' + waNum.slice(3);
      }
      return `https://wa.me/${waNum}`;
    }
    if (item.type === 'email') {
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.value)}&su=${encodeURIComponent('Hubungan Kontak Portofolio Interaktif')}`;
    }
    if (item.type === 'location') {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.value)}`;
    }
    return '#';
  };

  return (
    <motion.a
      href={getHref()}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ type: "spring", stiffness: 140, damping: 14 }}
      style={{
        ['--mouse-x' as any]: `${coords.x}px`,
        ['--mouse-y' as any]: `${coords.y}px`
      }}
      className={`relative group flex items-center justify-between p-6 sm:p-8 border overflow-hidden rounded-sm cursor-pointer transition-all duration-700 ease-out gap-4 z-10 w-full select-none
        /* Mobile: directly visible, bright/light cards with glowing accents */
        bg-white dark:bg-zinc-900 border-emerald-500/30 text-zinc-900 dark:text-zinc-100 shadow-md md:shadow-none
        
        /* Desktop: falls back smoothly to dark spotlight style unless hovered */
        md:border-zinc-200 md:dark:border-zinc-900
        ${isHovered 
          ? (isDarkMode ? 'md:bg-white md:text-zinc-900 md:border-zinc-350 md:shadow-2xl' : 'md:bg-black md:text-white md:border-zinc-500 md:shadow-2xl') 
          : (isDarkMode ? 'md:bg-neutral-950/95 md:text-zinc-350 md:border-zinc-900' : 'md:bg-zinc-100/50 md:text-zinc-900 md:border-zinc-200')
        }
      `}
    >
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-sm"
        style={{
          background: `radial-gradient(180px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, 0.16), transparent 80%)`,
        }}
      />

      <div className="flex items-center gap-6 relative z-10">
        <div className={`w-14 h-14 border flex items-center justify-center transition-all duration-700 rounded-sm shrink-0
          bg-emerald-50 dark:bg-zinc-805 text-emerald-600 dark:text-emerald-400 border-emerald-500/20
          md:bg-zinc-100 md:dark:bg-neutral-900 md:text-zinc-900 md:dark:text-zinc-100 md:border-zinc-200 md:dark:border-zinc-805
          ${isHovered 
            ? (isDarkMode ? 'md:bg-zinc-100 md:text-zinc-900 md:border-zinc-250' : 'md:bg-neutral-900 md:text-white md:border-zinc-700') 
            : ''
          }
        `}>
          {getIcon(item.type)}
        </div>
        <div>
          <span className={`text-[10px] font-bold tracking-widest uppercase block mb-1 transition-colors duration-750
            text-emerald-650 dark:text-emerald-400 md:text-zinc-500 md:dark:text-zinc-400
            ${isHovered 
              ? (isDarkMode ? 'md:text-zinc-500' : 'md:text-zinc-300') 
              : ''
            }
          `}>
            {item.label}
          </span>
          <h3 className={`font-display font-medium text-base sm:text-lg transition-colors duration-750 ease-in-out 
            text-zinc-900 dark:text-zinc-50 md:text-zinc-900 md:dark:text-zinc-105
            ${isHovered ? (isDarkMode ? 'md:text-zinc-900' : 'md:text-white') : ''}
          `}>
            {item.value}
          </h3>
        </div>
      </div>

      <div className={`text-xs font-bold tracking-widest border px-4 py-2 shrink-0 relative z-10 transition-colors duration-750 ease-in-out hidden sm:block
        bg-emerald-500/10 text-emerald-655 border-emerald-500/30
        md:bg-zinc-150/50 md:dark:bg-neutral-900 md:text-zinc-400 md:dark:text-zinc-150 md:border-zinc-200 md:dark:border-zinc-850
        ${isHovered 
          ? (isDarkMode ? 'md:bg-zinc-100 md:text-zinc-805' : 'md:bg-neutral-950 md:text-zinc-205 md:border-zinc-750') 
          : ''
        }
      `}>
        {item.type === 'phone' ? 'WA CHAT' : item.type === 'email' ? 'SEND MAIL' : 'MAPS'}
      </div>
    </motion.a>
  );
};

// --- Contact Section (04) ---
const Contact = ({ isDarkMode }: { isDarkMode: boolean }) => {
  // =========================================================================
  // INSTRUKSI TESTING EMAIL UNTUK USER:
  // Anda dapat mengisi string di bawah ini dengan email Anda sendiri untuk pengujian.
  // Contoh: const targetEmail = "punyaokto@gmail.com";
  // Jika dibiarkan kosong (""), website akan menampilkan instruksi/panduan langsung di formulir.
  // =========================================================================
  const targetEmail = "rianm8683@gmail.com"; // Silakan isi email penerima di sini untuk testing

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [gmailComposeUrl, setGmailComposeUrl] = useState('');
  const [rawMessageBody, setRawMessageBody] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | null; msg: string }>({ type: null, msg: '' });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !message) {
      setStatus({ 
        type: 'error', 
        msg: 'Harap lengkapi semua kolom input (Nama Lengkap dan Pesan) sebelum mengirim.' 
      });
      return;
    }

    if (!targetEmail) {
      setStatus({
        type: 'info',
        msg: 'Email penerima belum didefinisikan.'
      });
      return;
    }

    const mailSubject = `Pesan Kontak Baru dari Portofolio: ${name}`;
    const mailBody = `Halo Muhammad Apriliansyah Arpan,\n\nSaya ${name} mengirimkan pesan berikut melalui website portofolio Anda:\n\n"${message}"\n\n=========================\nDikirim dari Portofolio Interaktif.`;

    const mailtoSubject = encodeURIComponent(mailSubject);
    const mailtoBody = encodeURIComponent(mailBody);

    // Gmail Direct web composer url
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${mailtoSubject}&body=${mailtoBody}`;
    setGmailComposeUrl(gmailUrl);
    setRawMessageBody(mailBody);

    // Directly open Gmail compose window in a new tab
    window.open(gmailUrl, '_blank');
    
    setStatus({
      type: 'success',
      msg: 'Pesan berhasil diproses! Anda telah diarahkan ke halaman Gmail Web di tab baru untuk mengirim pesan secara instan. Jika peramban memblokir pop-up, Anda selalu dapat menekan tombol di bawah untuk membuka Gmail atau menyalin isi pesan Anda!'
    });

    // Reset fields
    setName('');
    setMessage('');
  };

  return (
    <section id="contact" className="py-24 md:py-32 border-b border-zinc-200 dark:border-zinc-900 px-4 sm:px-8 md:px-16 lg:px-24 bg-zinc-50 dark:bg-black relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 right-0 w-1/3 h-full tech-grid opacity-[0.16] dark:opacity-[0.03] -z-10 text-zinc-450 dark:text-zinc-700"></div>
      {/* Decorative neon colored spheres for high design polish */}
      <div className="absolute bottom-10 left-10 w-[280px] h-[280px] rounded-full bg-emerald-550/10 dark:bg-emerald-550/5 blur-3xl -z-10" />
      <div className="absolute top-10 right-10 w-[240px] h-[240px] rounded-full bg-amber-550/5 dark:bg-amber-550/3 blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        <div className="lg:w-1/2 flex flex-col justify-center">
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
           >
            <p className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-405 uppercase mb-4">{portfolioData.contact.sectionId}</p>
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-6 text-neutral-900 dark:text-zinc-100 reveal-glow-text transition-colors duration-550">{portfolioData.contact.title}</h2>
            <p className="text-zinc-650 dark:text-zinc-200 md:dark:text-zinc-400 text-lg border-l-4 border-emerald-550 dark:border-zinc-300 pl-6 py-1.5 mb-16 max-w-md">
               {portfolioData.contact.subtitle}
            </p>

            <div className="space-y-6">
              {portfolioData.contact.info.map((info, idx) => (
                <ContactCard key={info.type} item={info} isDarkMode={isDarkMode} />
              ))}
            </div>
           </motion.div>
        </div>

        <div className="lg:w-1/2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-zinc-100 dark:bg-neutral-950 p-5 sm:p-8 md:p-14 border border-zinc-200 dark:border-zinc-900 shadow-xl relative transition-colors duration-500"
          >
            {/* Decorative frame */}
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-550 dark:bg-zinc-100"></div>
            
            <form className="space-y-10 pt-4" onSubmit={handleSendMessage}>
              <AnimatePresence>
                {status.type && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -15 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{ overflow: 'hidden' }}
                    className={`p-5 rounded-sm text-sm leading-relaxed border relative transition-colors duration-300 ${
                      status.type === 'error' 
                        ? 'bg-red-500/10 text-red-650 dark:text-red-400 border-red-500/20' 
                        : status.type === 'info'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {/* Dimiss / Close Button */}
                    <button
                      type="button"
                      onClick={() => setStatus({ type: null, msg: '' })}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                      aria-label="Tutup notifikasi"
                    >
                      <X size={16} />
                    </button>

                    <p className={`font-bold mb-1.5 uppercase tracking-wider text-xs flex items-center gap-2 ${
                      status.type === 'error'
                        ? 'text-red-655 dark:text-red-400'
                        : status.type === 'info'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-405'
                    }`}>
                      {status.type === 'error' && 'Kesalahan Input'}
                      {status.type === 'info' && 'Petunjuk Pengujian'}
                      {status.type === 'success' && 'Sukses Mengirim'}
                    </p>
                    <div className="pr-6">
                      <p>{status.msg}</p>
                      {status.type === 'success' && gmailComposeUrl && (
                        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                          <a 
                            href={gmailComposeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-widest uppercase transition-colors rounded-sm text-center shadow-md flex items-center justify-center gap-1.5"
                          >
                            <span>KIRIM VIA GMAIL WEB</span>
                            <ArrowRight size={14} />
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(rawMessageBody);
                              setStatus({ 
                                type: 'success', 
                                msg: 'Teks pesan berhasil disalin ke clipboard! Anda dapat menempelkannya langsung di aplikasi kirim email Anda.' 
                              });
                            }}
                            className="px-4 py-2.5 bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-805 text-xs font-bold tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
                          >
                            SALIN PESAN
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs font-bold tracking-widest text-neutral-900 dark:text-zinc-100 uppercase mb-4">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda" 
                  className="w-full bg-zinc-50 dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-805 px-4 py-4 sm:px-6 sm:py-5 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-zinc-150 text-base sm:text-lg text-zinc-900 dark:text-zinc-50 transition-all rounded-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-neutral-900 dark:text-zinc-100 uppercase mb-4">Pesan</label>
                <textarea 
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pesan Anda di sini..." 
                  className="w-full bg-zinc-50 dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-805 px-4 py-4 sm:px-6 sm:py-5 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:focus:ring-zinc-150 text-base sm:text-lg resize-none text-zinc-900 dark:text-zinc-50 transition-all rounded-sm"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-neutral-900 dark:bg-zinc-100 text-zinc-50 dark:text-neutral-900 py-4 sm:py-6 text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-4 group rounded-sm hover-trigger"
              >
                <span>Kirim Pesan</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Footer Section ---
const Footer = () => {
  return (
    <footer className="py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-900 px-4 sm:px-8 md:px-16 lg:px-24 bg-zinc-50 dark:bg-black transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="font-display font-black text-2xl sm:text-3xl tracking-tight text-neutral-900 dark:text-zinc-50 duration-500 transition-colors">
          {portfolioData.footer.logo}
        </div>
        <p className="text-sm md:text-base text-zinc-650 dark:text-zinc-200 md:dark:text-zinc-400 text-center md:text-left duration-500 transition-colors">
          {portfolioData.footer.copyright}
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-black tracking-widest text-zinc-500 dark:text-zinc-200 md:dark:text-zinc-400 uppercase">
          {portfolioData.footer.links.map(link => (
            <a key={link.name} href={link.href} className="hover:text-neutral-900 dark:hover:text-zinc-50 transition-colors duration-500">
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// --- Main Application ---
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [globalCoords, setGlobalCoords] = useState({ x: -2000, y: -2000 });

  useEffect(() => {
    // Check initial user systems theme settings
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Update body / HTML class tag for dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Track cursor coordinates globally across viewport to assign to inline style properties
    const handleGlobalMove = (e: MouseEvent) => {
      setGlobalCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMove);
    return () => window.removeEventListener('mousemove', handleGlobalMove);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div 
      style={{
        ['--mouse-x' as any]: `${globalCoords.x}px`,
        ['--mouse-y' as any]: `${globalCoords.y}px`
      }}
      className="bg-zinc-50 dark:bg-black min-h-screen text-neutral-900 dark:text-zinc-50 selection:bg-neutral-900 selection:text-zinc-50 dark:selection:bg-zinc-50 dark:selection:text-neutral-900 transition-colors duration-500 dark-page-transition relative"
    >
      <Spotlight />
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Hero isDarkMode={isDarkMode} />
        <Education isDarkMode={isDarkMode} />
        <Organizations isDarkMode={isDarkMode} />
        <Awards isDarkMode={isDarkMode} />
        <Contact isDarkMode={isDarkMode} />
      </main>
      <Footer />
    </div>
  );
}
