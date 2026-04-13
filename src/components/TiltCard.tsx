"use client";

import React, { useRef, useState } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className = "card", style, ...props }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Core center mapping for tilt mapping
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6; 
    const rotateY = ((x - centerX) / centerX) * 6;  

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
    cardRef.current.style.setProperty("--x", `${x}px`);
    cardRef.current.style.setProperty("--y", `${y}px`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)";
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease-out";
      cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${className} tilt-card`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease-out",
        boxShadow: isHovered 
            ? "0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.15)" 
            : "",
        ...style
      }}
      {...props}
    >
      {/* Dynamic Inner Reflective Specular Light */}
      <div 
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          borderRadius: "inherit",
          background: "radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.2), transparent 40%)",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
