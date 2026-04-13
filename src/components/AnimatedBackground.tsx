"use client";

import React, { useMemo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type ThemeType = "dashboard" | "routines" | "workouts" | "reminders" | "notes" | "calendar";

const themeIcons: Record<ThemeType, string[]> = {
  dashboard: [
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
  ],
  routines: [
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
  ],
  workouts: [
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6M18.65 21.35l-2.7-2.7M21.35 18.65l-2.7-2.7M2.65 5.35l2.7 2.7M5.35 2.65l2.7 2.7M19.65 15.35 15.35 19.65M8.65 4.35 4.35 8.65M8.4 19.6l-5-5M19.6 8.4l-5-5"></path></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
  ],
  reminders: [
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h3M19 12h3M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"></path></svg>'
  ],
  notes: [
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>'
  ],
  calendar: [
    '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    '<div style="width:100%;height:100%;background:#60a5fa;border-radius:50%;box-shadow:0 0 15px #60a5fa;"></div>',
    '<div style="width:100%;height:100%;background:#f472b6;border-radius:50%;box-shadow:0 0 15px #f472b6;"></div>'
  ]
};

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || "";
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      containerRef.current.style.setProperty('--mouse-x', x.toString());
      containerRef.current.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const theme: ThemeType = useMemo(() => {
    if (pathname.includes("routines")) return "routines";
    if (pathname.includes("workouts")) return "workouts";
    if (pathname.includes("reminders")) return "reminders";
    if (pathname.includes("notes")) return "notes";
    if (pathname.includes("calendar")) return "calendar";
    return "dashboard";
  }, [pathname]);

  const items = useMemo(() => {
    const svgs = themeIcons[theme] || [];
    const elements = [];
    const count = 30; // 30 elements scattered

    for (let i = 0; i < count; i++) {
        const top = ((i * 37) % 100); 
        const left = ((i * 41) % 100);
        const size = ((i * 13) % 40) + 24; 
        const animDelay = ((i * 17) % 20);
        const animDuration = ((i * 11) % 25) + 20; 
        const opacity = ((i * 23) % 13) / 100 + 0.12; 
        const SVGFilter = `blur(1px) drop-shadow(0 0 4px rgba(255,255,255,0.2))`;
        const depth = ((i * 11) % 50) + 20; // Parallax depth: 20px to 70px offset spread
        
        const svgString = svgs[i % svgs.length];
        const animationTypes = ["float", "drift", "pulse-glow", "bounce-slow"];
        let animationClass = animationTypes[i % animationTypes.length];
        
        if (theme === "calendar" && i % svgs.length > 0) {
            animationClass = "pulse-glow";
        }

        elements.push(
          <div key={i} style={{
            position: "absolute",
            top: `${top}vh`, 
            left: `${left}vw`, 
            width: `${size}px`, 
            height: `${size}px`,
            opacity, 
            filter: SVGFilter,
            color: "rgba(255, 255, 255, 0.9)",
            transform: `translate(calc(var(--mouse-x, 0) * ${depth}px), calc(var(--mouse-y, 0) * ${depth}px))`,
            transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)' // Smooth tracking
          }}>
             <div style={{
                width: "100%", height: "100%",
                animation: `${animationClass} ${animDuration}s infinite ease-in-out ${animDelay}s`
             }} dangerouslySetInnerHTML={{ __html: svgString }} />
          </div>
        );
    }
    return elements;
  }, [theme]);

  if (!mounted) return null;

  return (
    <div ref={containerRef} style={{
      position: "fixed",
      top: 0, left: 0, 
      width: "100vw", height: "100vh",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}>
      {/* Universal Depth Gradient */}
      <div className="animated-gradient-bg" style={{
        position: "absolute", inset: 0,
        zIndex: -1
      }} />

      {/* Calendar grid specific background layer */}
      {theme === "calendar" && (
        <div style={{ 
          position: "absolute", inset: 0, opacity: 0.1, 
          backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", 
          backgroundSize: "40px 40px", 
          animation: "drift 40s linear infinite" 
        }} />
      )}
      
      {items}
    </div>
  );
}
