import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import IntroScreen from "@/components/IntroScreen";
import { projects } from "@/lib/projects";

const sceneImage = "/manus-storage/async-images/X9GM8StSJdVKEge4C3uzKT/image-1.webp";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><img src="/favicon-192.png" alt="" /></span>;
}

function SiteNav({ activeSection }: { activeSection: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Studio", href: "#studio", id: "studio" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];
  return (
    <header className="site-nav">
      <a href="/" className="nav-brand" aria-label="SAI DAR — home"><BrandMark /><span><b>SAI DAR</b><small>CREATIVE PRACTICE</small></span></a>
      <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
        {navItems.map((item, index) => (
          <a key={item.id} href={item.href} onClick={() => setMenuOpen(false)} className={activeSection === item.id ? "active" : ""}>
            <span className="nav-index">0{index + 1}</span>{item.label}
          </a>
        ))}
        <a className="nav-note" href="mailto:hello@alexkanary.studio">AVAILABLE FOR SELECT WORK <i /></a>
      </nav>
    </header>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [introVisible, setIntroVisible] = useState(() => typeof window !== "undefined" && !window.sessionStorage.getItem("ak-intro-seen"));
  const reduceMotion = useReducedMotion();

  const finishIntro = () => {
    window.sessionStorage.setItem("ak-intro-seen", "1");
    setIntroVisible(false);
  };

  useEffect(() => {
    if (reduceMotion) {
      finishIntro();
      return;
    }
    if (!introVisible) return;
    // 5900ms total: 900ms for welcome slide-up + 5000ms of full intro visibility
    const timer = window.setTimeout(finishIntro, 5900);
    return () => window.clearTimeout(timer);
  }, [introVisible, reduceMotion]);

  useEffect(() => {
    const sections = ["home", "projects", "studio", "contact"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: "-24% 0px -58% 0px", threshold: [0, 0.15, 0.4, 0.65] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const moveScene = (event: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current || event.pointerType === "touch") return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroRef.current.style.setProperty("--drift-x", `${x * -13}px`);
    heroRef.current.style.setProperty("--drift-y", `${y * -10}px`);
    heroRef.current.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    heroRef.current.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  return (
    <div className="site-shell">
      <a className="skip-to-content" href="#main">Skip to content</a>
      <IntroScreen visible={introVisible} onFinish={finishIntro} />
      <SiteNav activeSection={activeSection} />
      <main id="main">
        <section className="hero-scene" id="home" ref={heroRef} onPointerMove={moveScene}>
          <div className="scene-image" aria-hidden="true"><img src={sceneImage} alt="" fetchPriority="high" /></div>
          <div className="scene-shade" aria-hidden="true" />
          <div className="scene-grain" aria-hidden="true" />
          <div className="scene-topline"><span>SAI DAR / PERSONAL ARCHIVE</span><span>INDEPENDENT · 2026</span></div>
          <div className="hero-copy">
            <p className="hero-kicker"><i /> SAI DAR — DESIGNER & CREATIVE DEVELOPER</p>
            <h1>Ideas made<br />to <em>move</em> you.</h1>
            <p className="hero-description">A practice in identity, digital worlds and the details that make them feel alive.</p>
            <a className="hero-cta" href="#projects"><span>EXPLORE SELECTED WORK</span><ArrowDownRight size={15} /></a>
          </div>
          <div className="world-markers" aria-label="Featured project shortcuts">
            {projects.map((project, index) => (
              <a key={project.slug} className={`world-marker marker-${index + 1}`} href={`/work/${project.slug}`} aria-label={`Explore project ${project.number}: ${project.title}`}>
                <span className="marker-pulse" /><span className="marker-code">{project.number}</span><span className="marker-title">{project.title}</span>
              </a>
            ))}
          </div>
          <div className="scene-footer"><span><i /> DRAG TO DRIFT · SCROLL TO EXPLORE</span><a href="#projects">SELECT A MARKER TO OPEN A PROJECT <ArrowDown size={12} /></a><span>01 — 04</span></div>
          <div className="scene-coordinate" aria-hidden="true">40° 43′ 12.8″ N<br />73° 59′ 04.6″ W</div>
        </section>

        <section className="work-section" id="projects">
          <div className="section-head">
            <div className="section-label"><span>01 / SELECTED PROJECTS</span><span>2025 — 2026</span></div>
            <Reveal className="work-heading-row"><h2>A few worlds<br /><em>worth stepping into.</em></h2><p>Three independent explorations in identity, digital craft and feeling. Each begins with a question.</p></Reveal>
          </div>
          <div className="project-index">
            {projects.map((project, index) => (
              <Reveal key={project.slug} className="project-row" delay={index * 0.07}>
                <a className="project-link" href={`/work/${project.slug}`}>
                  <span className="project-index-number">{project.number}</span>
                  <span className="project-name-wrap"><span className="project-name">{project.title}</span><span className="project-subtitle">{project.subtitle}</span></span>
                  <span className="project-discipline">{project.discipline}</span>
                  <span className="project-year">{project.year}</span>
                  <span className="project-arrow"><ArrowUpRight size={18} /></span>
                  <span className="project-preview"><img src={project.cover} alt="" loading="lazy" /></span>
                </a>
              </Reveal>
            ))}
          </div>
          <div className="work-note"><span>THINK / MAKE / FEEL</span><span>THREE SMALL WORLDS, FOR NOW.</span></div>
        </section>

        <section className="studio-section" id="studio">
          <div className="section-label"><span>02 / STUDIO NOTES</span><span>HOW I LIKE TO WORK</span></div>
          <div className="studio-layout">
            <Reveal className="studio-title"><p className="studio-kicker">GOOD WORK STARTS WITH GOOD QUESTIONS.</p><h2>Make the<br />invisible <em>felt.</em></h2></Reveal>
            <Reveal className="studio-copy" delay={0.1}><p className="studio-lead">I’m Sai Dar — an independent creative working across visual identity, digital experiences and the moments that connect them.</p><p>Curiosity is the starting point. I bring a designer’s eye and a maker’s instinct to the whole process — shaping a clear idea, building a world around it, and sweating the small details that make it memorable.</p><p>I work with thoughtful people who want to make something with a point of view. From a first sketch to the final motion detail, I like staying close to the work.</p><a href="#contact" className="studio-link">A LITTLE MORE ABOUT THE PROCESS <ArrowUpRight size={14} /></a></Reveal>
          </div>
          <div className="services-line"><span>THINGS I CAN HELP WITH</span><div><i>Creative direction</i><i>Visual identity</i><i>Digital experiences</i><i>Art direction</i><i>Motion & interaction</i></div></div>
        </section>

        <section className="contact-section" id="contact">
          <div className="section-label"><span>03 / START SOMEWHERE</span><span>GOOD THINGS START WITH A NOTE.</span></div>
          <Reveal className="contact-layout"><div className="contact-copy"><p className="contact-kicker"><i /> CURRENTLY OPEN TO A GOOD QUESTION</p><h2>Have an idea<br />with a <em>pulse?</em></h2><p>Tell me what you're thinking. The half-formed idea is usually the fun part.</p><a className="contact-button" href="mailto:hello@alexkanary.studio">LET'S START A CONVERSATION <ArrowUpRight size={17} /></a></div><div className="contact-aside"><span>ELSEWHERE, TOO</span><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">INSTAGRAM <ArrowUpRight size={14} /></a><a href="https://www.are.na/" target="_blank" rel="noreferrer">ARE.NA <ArrowUpRight size={14} /></a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={14} /></a><p>HELLO@ALEXKANARY.STUDIO</p></div></Reveal>
        </section>
      </main>
      <footer className="site-footer"><a href="#home" className="footer-brand"><BrandMark /><span>SAI DAR</span></a><span className="footer-copy">© 2026 SAI DAR · MADE WITH INTENTION</span><a className="back-top" href="#home">BACK TO THE SURFACE <ArrowUpRight size={13} /></a></footer>
    </div>
  );
}
