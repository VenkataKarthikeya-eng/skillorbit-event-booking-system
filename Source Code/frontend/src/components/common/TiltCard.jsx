import React, { useState, useRef, useCallback } from 'react';

/**
 * TiltCard Component
 * Provides hardware-accelerated 3D perspective and subtle dynamic specular sheen on mouse hover.
 * Retains accessibility standards and zero cursor hijack/scroll disruption.
 */
const TiltCard = ({
  children,
  className = '',
  maxTilt = 7,
  scale = 1.015,
  perspective = 1000,
  showGlare = true,
  onClick,
}) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      // Skip on pure touch pointers to prevent touch-drag jitter
      if (e.pointerType === 'touch') return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const boundedX = Math.max(0, Math.min(1, x));
      const boundedY = Math.max(0, Math.min(1, y));

      const tiltY = (boundedX - 0.5) * (maxTilt * 2);
      const tiltX = -(boundedY - 0.5) * (maxTilt * 2);

      setTilt({ x: tiltX, y: tiltY });
      if (showGlare) {
        setGlare({
          x: boundedX * 100,
          y: boundedY * 100,
          opacity: 0.15,
        });
      }
    },
    [maxTilt, showGlare]
  );

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const transformStyle = isHovered
    ? `perspective(${perspective}px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
          : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic Specular Sheen (Subtle light reflection across card surface) */}
      {showGlare && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 65%)`,
          }}
        />
      )}
    </div>
  );
};

export default TiltCard;
