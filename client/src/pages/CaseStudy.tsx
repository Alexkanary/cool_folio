import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRoute } from "wouter";
import { findProject, projects } from "@/lib/projects";
import NotFound from "@/pages/NotFound";

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><img src="/favicon-192.png" alt="" /></span>;
}

export default function CaseStudy() {
  const [, params] = useRoute("/work/:slug");
  const project = findProject(params?.slug);
  const reduceMotion = useReducedMotion();
  if (!project) return <NotFound />;
  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="case-shell">
      <a className="skip-to-content" href="#case-main">Skip to content</a>
      <header className="case-nav"><a href="/" className="case-brand" aria-label="SAI DAR — home"><Mark /><span><b>SAI DAR</b><small>CREATIVE PRACTICE</small></span></a><a href="/#projects" className="back-work"><ArrowLeft size={14} /> PROJECTS</a><a href="/#contact" className="case-contact">CONTACT <ArrowUpRight size={14} /></a></header>
      <main id="case-main" className="case-main">
        <motion.section className="case-intro" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.7 }}>
          <div className="case-overline"><span>PROJECT {project.number} / 03</span><span>{project.year} · {project.discipline}</span></div>
          <div className="case-title-row"><h1>{project.title}<em>{project.subtitle}</em></h1><p>{project.summary}</p></div>
          <div className="case-cover"><img src={project.cover} alt={project.alt} /><span>SELECTED PROJECT / {project.year}</span></div>
        </motion.section>
        <section className="case-details">
          <div className="case-detail-label"><span>THE PROJECT</span><span>01—03</span></div>
          <div className="case-detail-grid"><div className="case-role"><span>ROLE</span><p>{project.role}</p><span>DISCIPLINE</span><p>{project.discipline}</p></div><article><span>THE BRIEF</span><p>{project.overview}</p></article><article><span>THE IDEA</span><p>{project.idea}</p></article></div>
        </section>
        <section className="case-gallery" aria-label={`${project.title} project gallery`}>
          <div className="gallery-image gallery-image-main"><img src={project.cover} alt={`${project.title} visual — full composition`} /><span>01 / FIRST IMPRESSION</span></div>
          <div className="gallery-side"><div className="gallery-image gallery-image-crop"><img src={project.cover} alt={`${project.title} visual detail`} /><span>02 / DETAILS IN MOTION</span></div><div className="gallery-caption" style={{ "--swatch-a": project.palette[0], "--swatch-b": project.palette[1], "--swatch-c": project.palette[2] } as React.CSSProperties}><div className="case-palette"><i /><i /><i /></div><span>THE LANGUAGE OF {project.title}</span></div></div>
        </section>
        <section className="case-outcome"><span>THE RESULT</span><p>{project.outcome}</p><span>MADE WITH INTENTION, ALWAYS.</span></section>
        <a className="next-project" href={`/work/${next.slug}`}><span>NEXT PROJECT&nbsp; / &nbsp;{next.number}</span><span className="next-project-title">{next.title} <ArrowRight size={22} /></span><small>{next.subtitle}</small></a>
      </main>
      <footer className="site-footer case-footer"><a href="/" className="footer-brand"><Mark /><span>SAI DAR</span></a><span className="footer-copy">© 2026 SAI DAR</span><a className="back-top" href="/#projects">ALL PROJECTS <ArrowUpRight size={13} /></a></footer>
    </div>
  );
}
