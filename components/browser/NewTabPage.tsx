import React, { useEffect, useState, useRef, useMemo } from 'react';

interface Shortcut {
  name: string;
  url: string;
  domain: string;
  color: string;
  textColor?: string; 
}

const SHORTCUTS: Shortcut[] = [
  { name: 'Netflix', url: 'https://www.netflix.com', domain: 'netflix.com', color: '#E50914' },
  { name: 'Prime Video', url: 'https://www.primevideo.com', domain: 'primevideo.com', color: '#00A8E1' },
  { name: 'Disney+', url: 'https://www.disneyplus.com', domain: 'disneyplus.com', color: '#060d2e' },
  { name: 'HBO Max', url: 'https://play.hbomax.com', domain: 'max.com', color: '#240656' },
  { name: 'Paramount+', url: 'https://www.paramountplus.com', domain: 'paramountplus.com', color: '#0064FF' },
  { name: 'Apple TV', url: 'https://tv.apple.com', domain: 'apple.com', color: '#1c1c1c' },
  { name: 'Peacock', url: 'https://www.peacocktv.com', domain: 'peacocktv.com', color: '#000000' },
  { name: 'Hulu.jp', url: 'https://www.hulu.jp', domain: 'hulu.jp', color: '#1CE783' },
  { name: 'YouTube', url: 'https://www.youtube.com', domain: 'youtube.com', color: '#FF0000' },
  { name: 'TikTok', url: 'https://www.tiktok.com', domain: 'tiktok.com', color: '#000000' },
  { name: 'Instagram', url: 'https://www.instagram.com', domain: 'instagram.com', color: '#DD2A7B' }
];

interface NewTabPageProps {
  onNavigate: (url: string) => void;
  tabId: string;
  isActive: boolean;
}

export const NewTabPage: React.FC<NewTabPageProps> = ({ onNavigate, tabId, isActive }) => {
  // Galaxy View State: Tilt (X-axis) and Spin (Z-axis relative to the plane)
  const [viewState, setViewState] = useState({ tilt: 60, spin: 0 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  // Organize Shortcuts into Orbits
  const orbits = useMemo(() => {
    // Configuration for rings: radius in pixels
    // We split the shortcuts into 3 rings for a "galaxy" density effect
    const rings = [
      { id: 'inner', radius: 250, items: [] as Shortcut[] },
      { id: 'middle', radius: 450, items: [] as Shortcut[] },
      { id: 'outer', radius: 650, items: [] as Shortcut[] },
    ];

    SHORTCUTS.forEach((item, index) => {
      if (index < 4) {
        rings[0].items.push(item);
      } else if (index < 10) {
        rings[1].items.push(item);
      } else {
        rings[2].items.push(item);
      }
    });

    return rings;
  }, []);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    lastMouse.current = { x: clientX, y: clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const deltaX = clientX - lastMouse.current.x;
    const deltaY = clientY - lastMouse.current.y;
    
    setViewState(prev => ({
      // Dragging vertical changes tilt (clamped between 0 and 80 degrees for best visibility)
      tilt: Math.min(85, Math.max(10, prev.tilt - deltaY * 0.2)),
      // Dragging horizontal spins the galaxy
      spin: prev.spin + deltaX * 0.2
    }));
    
    lastMouse.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Auto-spin effect when not dragging
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (!isDragging.current) {
        setViewState(prev => ({ ...prev, spin: prev.spin + 0.05 }));
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div 
      className="relative w-full h-full bg-[#030014] overflow-hidden cursor-move select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1B0033_0%,_#0b001a_40%,_#000000_100%)] pointer-events-none" />
      
      {/* Distant Nebula Overlay */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-900/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-900/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}/>

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
          {[...Array(100)].map((_, i) => (
             <div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                    width: Math.random() < 0.3 ? '2px' : '1px',
                    height: Math.random() < 0.3 ? '2px' : '1px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    opacity: Math.random() * 0.8 + 0.2,
                }}
             />
          ))}
      </div>

      {/* Title */}
      <div className="absolute top-8 w-full flex justify-center z-20 pointer-events-none">
          <h1 className="flex items-center justify-center gap-4 text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-purple-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] font-sans">
              <span>Keeprix</span>
              <span className="text-2xl md:text-3xl font-light text-purple-200 relative -top-[2px] tracking-widest opacity-80">GALAXY</span>
          </h1>
      </div>

      {/* 3D Scene */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1600px' }}
      >
        {/* Galaxy Container - Controls Tilt & Spin */}
        <div 
          className="relative w-0 h-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${viewState.tilt}deg) rotateZ(${viewState.spin}deg)`,
            transition: isDragging.current ? 'none' : 'transform 0.1s linear'
          }}
        >
            {/* 
              REALISTIC GALACTIC CORE 
              1. Accretion Disk (Flat on plane)
              2. Galactic Bulge/Core (Billboarding Sphere)
            */}
            
            {/* The Accretion Disk - Swirling matter lying flat on the galaxy plane */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] pointer-events-none">
                 {/* Inner bright disk */}
                 <div className="absolute inset-0 rounded-full animate-[spin_20s_linear_infinite]"
                      style={{
                          background: 'conic-gradient(from 0deg, transparent 0%, rgba(251, 191, 36, 0.1) 10%, rgba(234, 88, 12, 0.4) 30%, rgba(251, 191, 36, 0.6) 50%, rgba(234, 88, 12, 0.4) 70%, rgba(251, 191, 36, 0.1) 90%, transparent 100%)',
                          filter: 'blur(8px)',
                      }}
                 />
                 {/* Outer gaseous ring */}
                 <div className="absolute inset-[-50px] rounded-full animate-[spin_30s_linear_infinite_reverse]"
                      style={{
                          background: 'conic-gradient(from 180deg, transparent 0%, rgba(147, 51, 234, 0.05) 20%, rgba(147, 51, 234, 0.2) 50%, rgba(147, 51, 234, 0.05) 80%, transparent 100%)',
                          filter: 'blur(20px)',
                      }}
                 />
            </div>

            {/* The Galactic Bulge - Billboarding Sphere (Faces user) */}
            <div 
                className="absolute top-1/2 left-1/2 flex items-center justify-center pointer-events-none"
                style={{
                    width: '0', height: '0',
                    transform: `rotateZ(${-viewState.spin}deg) rotateX(${-viewState.tilt}deg)`,
                }}
            >
                {/* 1. The Supermassive Dense Core (White Hot) */}
                <div className="absolute w-24 h-24 bg-white rounded-full blur-sm shadow-[0_0_50px_rgba(255,255,255,0.9)] z-20" />
                
                {/* 2. The Inner Gold Halo */}
                <div className="absolute w-40 h-40 bg-orange-300 rounded-full blur-xl opacity-80 mix-blend-screen z-10" />

                {/* 3. The Outer Red/Purple Expansive Glow */}
                <div className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full blur-[100px] opacity-20 mix-blend-screen z-0" />
                
                {/* 4. Horizontal Lens Flare Streak */}
                <div className="absolute w-[800px] h-[4px] bg-blue-300 blur-[2px] opacity-20" />
            </div>

            {/* Orbits and Planets */}
            {orbits.map((orbit, orbitIndex) => (
                <div key={orbit.id} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Orbit Track Line */}
                    <div 
                        className="rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        style={{
                            width: orbit.radius * 2,
                            height: orbit.radius * 2,
                        }}
                    />
                    
                    {/* Items on this orbit */}
                    {orbit.items.map((item, itemIndex) => {
                        const count = orbit.items.length;
                        const angleStep = 360 / count;
                        // Offset angle slightly for each ring to make it look organic
                        const angleOffset = orbitIndex * 45; 
                        const angle = itemIndex * angleStep + angleOffset;
                        
                        return (
                            <div
                                key={item.domain}
                                className="absolute top-1/2 left-1/2"
                                style={{
                                    width: '120px',
                                    height: '100px',
                                    // 1. Rotate to angle
                                    // 2. Translate out to radius
                                    // 3. Counter-rotate the item container so it doesn't spin upside down relative to the ring
                                    transform: `
                                        rotateZ(${angle}deg) 
                                        translate(${orbit.radius}px) 
                                        rotateZ(${-angle}deg)
                                    `,
                                    transformStyle: 'preserve-3d',
                                    marginTop: '-50px',
                                    marginLeft: '-60px'
                                }}
                            >
                                {/* Billboard Content: Counter-rotate against the Galaxy Tilt and Galaxy Spin to face camera */}
                                <div 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isDragging.current) onNavigate(item.url);
                                    }}
                                    className="w-full h-full cursor-pointer group"
                                    style={{
                                        transform: `rotateZ(${-viewState.spin}deg) rotateX(${-viewState.tilt}deg)`,
                                        transition: 'transform 0.1s linear' // Smooth sync
                                    }}
                                >
                                     {/* Card Visual */}
                                    <div className={`
                                        w-full h-full 
                                        bg-slate-900/40 backdrop-blur-md 
                                        border border-white/10
                                        rounded-xl
                                        flex flex-col items-center justify-center gap-2
                                        shadow-[0_0_15px_rgba(0,0,0,0.5)]
                                        group-hover:bg-slate-800/80
                                        group-hover:border-purple-400/50
                                        group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]
                                        group-hover:scale-110
                                        transition-all duration-300
                                        relative
                                    `}>
                                        {/* Connecting Line to Core (Stylistic choice, subtle) */}
                                        <div className="absolute bottom-[-20px] left-1/2 w-[1px] h-[20px] bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Logo - Shifted left 4px */}
                                        <div className="w-10 h-10 relative flex items-center justify-center -translate-x-[4px]">
                                            <img 
                                                src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
                                                alt={item.name}
                                                className={`
                                                    w-full h-full object-contain drop-shadow-lg
                                                    ${imagesLoaded[item.domain] ? 'opacity-100' : 'opacity-0'}
                                                    transition-opacity duration-500
                                                `}
                                                onLoad={() => setImagesLoaded(prev => ({ ...prev, [item.domain]: true }))}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://logo.clearbit.com/${item.domain}`;
                                                }}
                                            />
                                        </div>
                                        
                                        <span className="text-white font-bold text-xs tracking-wide text-center px-1 truncate w-full shadow-black drop-shadow-md">
                                            {item.name}
                                        </span>
                                        
                                        {/* Orbit Indicator Dot */}
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
      
      {/* HUD / Instructions */}
      <div className="absolute bottom-8 left-0 w-full flex justify-between px-12 pointer-events-none opacity-50 text-purple-200/60 text-[10px] tracking-[0.2em] uppercase font-light">
          <span>Sys: MilkyWay-01</span>
          <span>Drag to Navigate</span>
          <span>Status: Active</span>
      </div>
    </div>
  );
};