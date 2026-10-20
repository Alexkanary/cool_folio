import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { enableMusic, disableMusic } from "../audio/audioManager";
import styles from "./welcome.module.css";

type Puff = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
};

export default function Welcome({ onContinue }: { onContinue: (withMusic: boolean) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const puffsRef = useRef<Puff[]>([]);
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const blurredImgRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const idleTimerRef = useRef<number | null>(null);
  const isMovingRef = useRef(false);

  // Preload and pre-blur the background forest image
  useEffect(() => {
    const img = new Image();
    img.src = "/images/darkforest.jpg";
    img.onload = () => {
      imgRef.current = img;
      // Create pre-blurred and darkened offscreen canvas
      const off = document.createElement("canvas");
      const ctx = off.getContext("2d");
      if (ctx) {
        off.width = window.innerWidth;
        off.height = window.innerHeight;
        ctx.filter = "blur(8px) brightness(0.45)";
        ctx.drawImage(img, 0, 0, off.width, off.height);
        blurredImgRef.current = off;
      }
    };

    const handleResize = () => {
      if (!imgRef.current) return;
      const off = document.createElement("canvas");
      const ctx = off.getContext("2d");
      if (ctx) {
        off.width = window.innerWidth;
        off.height = window.innerHeight;
        ctx.filter = "blur(8px) brightness(0.45)";
        ctx.drawImage(imgRef.current, 0, 0, off.width, off.height);
        blurredImgRef.current = off;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smoke trail canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const addPuff = (x: number, y: number, spreadBoost = 1) => {
      puffsRef.current.push({
        x,
        y,
        radius: (120 + Math.random() * 40) * spreadBoost,
        maxRadius: (180 + Math.random() * 60) * spreadBoost,
        opacity: 0.08,
        life: 0,
        maxLife: 3.0,
        vx: (Math.random() - 0.5) * 12,
        vy: -15 - Math.random() * 15,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      isMovingRef.current = true;
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        isMovingRef.current = false;
      }, 3000);

      const x = e.clientX;
      const y = e.clientY;
      const last = lastMouseRef.current;

      const spreadBoost = isHovered ? 1.4 : 1.0;

      if (last) {
        const dist = Math.hypot(x - last.x, y - last.y);
        const steps = Math.max(1, Math.floor(dist / 15));
        for (let i = 1; i <= steps; i++) {
          const lerpX = last.x + ((x - last.x) * i) / steps;
          const lerpY = last.y + ((y - last.y) * i) / steps;
          addPuff(lerpX, lerpY, spreadBoost);
        }
      } else {
        addPuff(x, y, spreadBoost);
      }
      lastMouseRef.current = { x, y };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      isMovingRef.current = true;
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      addPuff(x, y, isHovered ? 1.4 : 1.0);
      lastMouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    let lastFrame = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;

      ctx.clearRect(0, 0, width, height);

      const puffs = puffsRef.current;
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          puffs.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const progress = p.life / p.maxLife;
        p.radius += (p.maxRadius - p.radius) * 0.05;
        // Quadratic fade out
        const currentAlpha = p.opacity * (1 - progress * progress);

        // Draw puff on temporary offscreen or directly using globalAlpha
        ctx.save();
        ctx.globalAlpha = Math.max(0, currentAlpha);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Composite forest photo through smoke mask
      if (blurredImgRef.current && puffs.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(blurredImgRef.current, 0, 0, width, height);
        ctx.restore();
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [isHovered]);

  const handleContinue = async (withMusic: boolean) => {
    if (isExiting) return;
    if (withMusic) {
      try {
        await enableMusic();
      } catch (err) {
        console.error("Music playback failed:", err);
        setPlaybackError("Music could not be started. Continuing without sound.");
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => onContinue(false), 900);
        }, 1200);
        return;
      }
    } else {
      disableMusic();
    }
    setIsExiting(true);
    setTimeout(() => onContinue(withMusic), 900);
  };

  const speedMultiplier = isHovered ? 1.3 : 1.0;

  return (
    <motion.div
      className={styles.welcomeRoot}
      initial={{ y: 0 }}
      animate={isExiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <canvas ref={canvasRef} className={styles.smokeCanvas} />

      <div className={styles.topBar}>
        <span>SAI DAR / ARCHIVE</span>
        <span>2026</span>
      </div>

      <div className={styles.centerContainer}>
        <div
          className={styles.logoWrap}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <p className={styles.subtitle}>SAI DAR · PORTFOLIO</p>
          <svg className={styles.svgLogo} viewBox="0 0 420 110" aria-label="SAI DAR Logo">
            <defs>
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Background static clean text */}
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#e9ecee"
              fillOpacity="0.82"
              fontFamily="'Cinzel', 'Cormorant Garamond', Georgia, serif"
              fontSize="64"
              letterSpacing="0.14em"
            >
              SAI DAR
            </text>

            {/* Running glowing light path */}
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="none"
              stroke="#8fd0ff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeDasharray="40 360"
              filter="url(#neonGlow)"
              fontFamily="'Cinzel', 'Cormorant Garamond', Georgia, serif"
              fontSize="64"
              letterSpacing="0.14em"
            >
              SAI DAR
              <animate
                attributeName="stroke-dashoffset"
                values="400;0"
                dur={`${5 / speedMultiplier}s`}
                repeatCount="indefinite"
                begin="0s"
              />
            </text>
          </svg>
        </div>

        <h1 className={styles.heading} id="welcome-heading">
          Continue with music?
        </h1>
        <p className={styles.description}>A little sound for the journey.</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={() => handleContinue(true)}
          >
            CONTINUE WITH MUSIC
          </button>
          <button
            type="button"
            className={styles.secondaryAction}
            onClick={() => handleContinue(false)}
          >
            Continue without sound
          </button>
        </div>

        {playbackError && <p className={styles.playbackError}>{playbackError}</p>}
      </div>

      <div className={styles.bottomBar}>
        <span>MOVE CURSOR TO REVEAL</span>
        <span>MY JOURNEY | MY PORTFOLIO</span>
      </div>
    </motion.div>
  );
}
