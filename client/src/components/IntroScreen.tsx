import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type IntroScreenProps = { visible: boolean; onFinish: () => void };

export default function IntroScreen({ visible, onFinish }: IntroScreenProps) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="intro-screen" role="dialog" aria-modal="true" aria-label="Folio portfolio introduction" initial={{ opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}>
          <div className="intro-topline"><span>FOLIO&nbsp; / &nbsp;ALEX K.</span><span>PERSONAL CREATIVE ARCHIVE · 2026</span></div>
          <div className="intro-center">
            <motion.div className="intro-mark" initial={{ scale: 0.72, rotate: -25, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }} aria-hidden="true"><span>A</span><span>K</span><i /></motion.div>
            <div className="intro-title-wrap">
              <motion.p initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.65 }}>AN INDEPENDENT CREATIVE PRACTICE</motion.p>
              <motion.h1 initial={{ y: 36, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>Ideas made to <em>move</em> you.</motion.h1>
            </div>
          </div>
          <div className="intro-bottomline"><span className="intro-status"><i /> PREPARING THE PORTFOLIO</span><button type="button" onClick={onFinish} className="intro-skip">ENTER PORTFOLIO <ArrowUpRight size={14} aria-hidden="true" /></button></div>
          <motion.div className="intro-progress" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.7, ease: "easeInOut" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
