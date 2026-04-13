"use client";

import React, { useState, useEffect } from "react";
import { motivationalQuotes } from "@/lib/quotes";
import TiltCard from "./TiltCard";

export default function MotivationalQuote() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [fade, setFade] = useState(false);

  // Pick random quote
  const getRandomQuote = () => {
    const random = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[random];
  };

  useEffect(() => {
    setQuote(getRandomQuote());
    setFade(true); // Trigger initial fade in
  }, []);

  const handleNewQuote = () => {
    setFade(false); // Trigger fade out
    setTimeout(() => {
      setQuote(getRandomQuote());
      setFade(true); // Fade back in with new quote
    }, 400); // 400ms duration matches the css transition
  };

  if (!quote.text) return <div style={{ height: "200px" }}></div>; 

  return (
    <TiltCard className="card" style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2rem",
        marginBottom: "2.5rem",
        overflow: "hidden",
        textAlign: "center",
        boxShadow: "0 0 25px rgba(139, 92, 246, 0.15)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        background: "transparent"
    }}>
      {/* Background ambient glowing particles */}
      <div style={{ position: "absolute", top: "10%", left: "10%", width: "80px", height: "80px", background: "rgba(59, 130, 246, 0.2)", borderRadius: "50%", filter: "blur(30px)", animation: "pulse-glow 6s infinite" }}></div>
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "100px", height: "100px", background: "rgba(192, 132, 252, 0.15)", borderRadius: "50%", filter: "blur(40px)", animation: "drift 10s infinite" }}></div>
      <div style={{ position: "absolute", top: "40%", right: "20%", opacity: 0.3, animation: "float 5s infinite" }}>✨</div>
      <div style={{ position: "absolute", bottom: "30%", left: "15%", opacity: 0.2, animation: "float 7s infinite 1s" }}>🌟</div>

      <div style={{
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: fade ? 1 : 0,
          transform: fade ? "translateY(0)" : "translateY(15px)",
          zIndex: 1,
          maxWidth: "800px"
      }}>
        <h2 style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: "1rem",
            background: "linear-gradient(to right, #c084fc, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center"
        }}>
            "{quote.text}"
        </h2>
        <p style={{
            fontSize: "1.1rem",
            color: "var(--text-secondary)",
            fontWeight: 500,
            letterSpacing: "0.5px"
        }}>
            — {quote.author}
        </p>
      </div>

      <button 
        onClick={handleNewQuote}
        className="btn-secondary"
        style={{
            marginTop: "2rem",
            zIndex: 1,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-full)"
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.44l5.36 5.36"/></svg>
        New Quote
      </button>
    </TiltCard>
  );
}
