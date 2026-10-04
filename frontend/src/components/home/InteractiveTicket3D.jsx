import React, { useState, useRef, useCallback } from 'react';
import { ShieldCheck, Calendar, Clock, MapPin, Users, QrCode, Sparkle } from 'lucide-react';

/**
 * InteractiveTicket3D
 * Hardware-accelerated 3D digital pass showcase.
 * Features multi-layer 3D depth, idle levitation motion, and interactive mouse-tilt reflection.
 */
const InteractiveTicket3D = () => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 4, y: -6 });
  const [isHovered, setIsHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 30, y: 30 });

  const handlePointerMove = useCallback((e) => {
    if (!cardRef.current || e.pointerType === 'touch') return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const boundedX = Math.max(0, Math.min(1, x));
    const boundedY = Math.max(0, Math.min(1, y));

    // Calculate 3D tilt angles (up to 12 degrees for dynamic ticket feel)
    const tiltY = (boundedX - 0.5) * 18;
    const tiltX = -(boundedY - 0.5) * 18;

    setTilt({ x: tiltX, y: tiltY });
    setGlare({ x: boundedX * 100, y: boundedY * 100 });
  }, []);

  const handlePointerEnter = () => setIsHovered(true);

  const handlePointerLeave = () => {
    setIsHovered(false);
    // Smoothly return to default pleasant isometric angle
    setTilt({ x: 3, y: -4 });
  };

  return (
    <div className="perspective-1200 w-full max-w-md mx-auto py-4">
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
        className={`relative bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 text-left shadow-2xl transition-shadow duration-300 ${
          !isHovered ? 'animate-float-3d' : ''
        }`}
      >
        {/* Dynamic Specular Sheen */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 overflow-hidden"
          style={{
            opacity: isHovered ? 0.22 : 0.08,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 60%)`,
          }}
        />

        {/* Top Floating Badge Layer (Z: 30px) */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 animate-pulse-subtle"></div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
              SkillOrbit Pass
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CONFIRMED</span>
          </span>
        </div>

        {/* Middle Event Details Layer (Z: 25px) */}
        <div style={{ transform: 'translateZ(25px)' }} className="space-y-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              Tech Symposium 2026
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              National AI & Quantum Computing Summit
            </h3>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">Date & Time</span>
              <div className="text-white font-medium flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>Oct 24, 2026</span>
              </div>
              <div className="text-slate-300 text-[11px] flex items-center space-x-1 mt-0.5">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>09:30 AM IST</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">Allocation</span>
              <div className="text-white font-medium flex items-center space-x-1">
                <Users className="w-3 h-3 text-emerald-400" />
                <span>3 Seats Confirmed</span>
              </div>
              <div className="text-slate-300 text-[11px] flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-indigo-400" />
                <span>Hall A, Main Campus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Perforation Notch Decor */}
        <div className="relative my-5 -mx-7 flex items-center">
          <div className="w-3.5 h-7 bg-white rounded-r-full border-r border-slate-300"></div>
          <div className="flex-1 border-t-2 border-dashed border-slate-700 mx-2"></div>
          <div className="w-3.5 h-7 bg-white rounded-l-full border-l border-slate-300"></div>
        </div>

        {/* Bottom Barcode & Security Ledger (Z: 20px) */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="flex items-center justify-between pt-1"
        >
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Reference Hash
            </div>
            <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
              EVT-20261024-9421
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center space-x-1">
              <span>●</span>
              <span>Atomic Inventory Locked</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white text-slate-900 border border-slate-200 shadow-sm">
            <QrCode className="w-8 h-8" />
          </div>
        </div>

        {/* 3D Depth Lighting Shadow */}
        <div
          aria-hidden="true"
          className="absolute -bottom-3 inset-x-6 h-4 bg-indigo-950/40 rounded-2xl blur-md pointer-events-none -z-10"
        />
      </div>
    </div>
  );
};

export default InteractiveTicket3D;
