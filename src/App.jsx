import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";

const HeroScene = lazy(() => import("./components/HeroScene"));

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const headlineLines = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.12 } },
};

const headlineLine = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const services = [
  {
    number: "01",
    title: "Web design & development",
    description:
      "Distinctive, responsive websites made to communicate clearly and move your business forward.",
  },
  {
    number: "02",
    title: "Web applications",
    description:
      "Purpose-built digital products and tools shaped around the way your team and customers work.",
  },
  {
    number: "03",
    title: "UI/UX design",
    description:
      "Clear, accessible user experiences shaped around real customer needs and business goals.",
  },
  {
    number: "04",
    title: "E-commerce",
    description:
      "Easy-to-use online stores that make it simpler for customers to discover and buy from you.",
  },
  {
    number: "05",
    title: "AI & workflow automation",
    description:
      "Practical automation that reduces repetitive work and helps your existing tools work together.",
  },
  {
    number: "06",
    title: "Digital strategy",
    description:
      "A focused roadmap for turning your business goals into the right digital products and services.",
  },
];

const steps = [
  {
    number: "01",
    title: "Understand",
    description:
      "We get to know your goals, your people, and the problem worth solving.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "We shape a clear direction, then turn it into a considered digital experience.",
  },
  {
    number: "03",
    title: "Grow",
    description:
      "We launch with care and stay focused on what will make the work better over time.",
  },
];

const projects = [
  {
    number: "01",
    name: "Ember & Bun",
    category: "Restaurant · Fire-grilled favorites",
    url: "https://ember-bun-six.vercel.app/",
    description:
      "A bold, flame-kissed restaurant experience made to turn a first look into a first bite.",
  },
  {
    number: "02",
    name: "Grilli",
    category: "Restaurant · Dining & reservations",
    url: "https://grill-app-two.vercel.app/",
    description:
      "An elegant restaurant destination pairing a rich visual story with effortless discovery.",
  },
];

const heroPhrases = [
  "Launch smarter.",
  "Think bigger.",
  "Create more.",
  "Make it real.",
];

function ProjectPreview({ project }) {
  const previewRef = useRef(null);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / 1200);
    });
    observer.observe(preview);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={previewRef} className="project-preview-frame">
      <iframe
        className="project-preview"
        src={project.url}
        title={`${project.name} website preview`}
        loading="lazy"
        referrerPolicy="no-referrer"
        style={{ "--preview-scale": scale }}
      />
    </div>
  );
}

function BrandMark({ compact = false, animated = false, markOnly = false, href = "#top" }) {
  const BrandContainer = href ? "a" : "div";
  const BrandBar = animated ? motion.span : "span";

  return (
    <BrandContainer
      className={`brand${compact ? " brand--compact" : ""}`}
      href={href || undefined}
      aria-label="Humbytes"
    >
      <span className="brand-mark" aria-hidden="true">
        {[0, 1, 2, 3].map((bar) => (
          <BrandBar
            key={bar}
            animate={animated ? { scaleY: [1, bar === 3 ? 0.72 : 0.82, 1] } : undefined}
            transition={
              animated
                ? { duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: bar * 0.11 }
                : undefined
            }
          />
        ))}
      </span>
      {!markOnly && (
        <span className="brand-copy">
          <span className="brand-name">HUMBYTES</span>
          {!compact && <span className="brand-tagline">WEB · SOFTWARE · AI</span>}
        </span>
      )}
    </BrandContainer>
  );
}

function LoadingScreen({ reducedMotion }) {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -12 }}
      transition={{ duration: reducedMotion ? 0.2 : 0.48, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <motion.div
        className="loading-lockup"
        initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0.2 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <BrandMark animated={!reducedMotion} markOnly href={null} />
      </motion.div>
      <div className="loading-track">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reducedMotion ? 0.15 : 1.25, ease: [0.65, 0, 0.35, 1] }}
        />
      </div>
    </motion.div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [heroPhraseIndex, setHeroPhraseIndex] = useState(0);
  const [typedHeroPhrase, setTypedHeroPhrase] = useState(heroPhrases[0]);
  const [isDeletingHeroPhrase, setIsDeletingHeroPhrase] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (shouldReduceMotion) return undefined;

    const currentPhrase = heroPhrases[heroPhraseIndex];
    const isPhraseComplete = typedHeroPhrase === currentPhrase && !isDeletingHeroPhrase;
    const delay = isPhraseComplete
      ? 1500
      : isDeletingHeroPhrase
        ? typedHeroPhrase
          ? 45
          : 350
        : 72;

    const timer = window.setTimeout(() => {
      if (isPhraseComplete) {
        setIsDeletingHeroPhrase(true);
      } else if (isDeletingHeroPhrase && typedHeroPhrase) {
        setTypedHeroPhrase((phrase) => phrase.slice(0, -1));
      } else if (isDeletingHeroPhrase) {
        setHeroPhraseIndex((index) => (index + 1) % heroPhrases.length);
        setIsDeletingHeroPhrase(false);
      } else {
        setTypedHeroPhrase(currentPhrase.slice(0, typedHeroPhrase.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [heroPhraseIndex, isDeletingHeroPhrase, shouldReduceMotion, typedHeroPhrase]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIsLoading(false),
      shouldReduceMotion ? 350 : 1500
    );

    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <main id="top" className="site-shell">
      <AnimatePresence>
        {isLoading && <LoadingScreen key="brand-loader" reducedMotion={shouldReduceMotion} />}
      </AnimatePresence>

      <motion.header
        className="site-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.3 }}
      >
        <div className="header-inner">
          <BrandMark compact />
          <button
            className={`menu-toggle${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
          <nav
            id="site-navigation"
            className={`site-nav${menuOpen ? " site-nav--open" : ""}`}
            aria-label="Main navigation"
          >
            <motion.a href="#services" onClick={closeMenu} whileHover={{ y: -2, color: "#ff702b" }} transition={{ duration: 0.18 }}>Services</motion.a>
            <motion.a href="#projects" onClick={closeMenu} whileHover={{ y: -2, color: "#ff702b" }} transition={{ duration: 0.18 }}>Projects</motion.a>
            <motion.a href="#approach" onClick={closeMenu} whileHover={{ y: -2, color: "#ff702b" }} transition={{ duration: 0.18 }}>Approach</motion.a>
            <motion.a className="nav-contact" href="#contact" onClick={closeMenu} whileHover={{ y: -2, borderColor: "#ff702b" }} transition={{ duration: 0.18 }}>
              Start a project <span aria-hidden="true">↗</span>
            </motion.a>
          </nav>
        </div>
      </motion.header>

      <section className="hero section-wrap" aria-labelledby="hero-title">
        <div className="hero-video-layer" aria-hidden="true" />
        <motion.div className="hero-copy" variants={reveal} initial="hidden" animate="visible" transition={{ delay: shouldReduceMotion ? 0 : 0.15 }}>
          <p className="eyebrow"><span className="status-dot" /> Independent digital studio · Australia & beyond</p>
          <motion.h1 id="hero-title" variants={headlineLines} initial="hidden" animate="visible" aria-label="Build better. Launch smarter.">
            <span className="hero-line" aria-hidden="true"><motion.span variants={headlineLine}>Build better.</motion.span></span>
            <span className="hero-line hero-line--accent" aria-hidden="true">
              <motion.span variants={headlineLine}>
                <span>{typedHeroPhrase}<span className="typing-cursor" /></span>
              </motion.span>
            </span>
          </motion.h1>
          <p className="hero-description">
            Modern websites and web applications for businesses, startups & growing brands.
          </p>
          <motion.a className="button button--orange" href="mailto:humbytes@gmail.com" whileHover={{ y: -4, scale: 1.035 }} whileTap={{ y: 0, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 22 }}>
            Tell us what you are building <span aria-hidden="true">↗</span>
          </motion.a>
        </motion.div>

        <motion.div className="hero-scene-wrap" variants={reveal} initial="hidden" animate="visible" transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}>
          {!isLoading && (
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          )}
          <span className="scene-label scene-label--top">HUMBYTES / DIGITAL STUDIO</span>
          <span className="scene-label scene-label--bottom">MOVE TO EXPLORE <span aria-hidden="true">↗</span></span>
        </motion.div>

        <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.65 }}>
          <span>Web development & digital solutions</span>
          <a href="#services">Explore what we do <span aria-hidden="true">↓</span></a>
        </motion.div>
      </section>

      <motion.section className="services section-wrap" id="services" aria-labelledby="services-title" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <motion.div className="section-heading" variants={reveal}>
          <p className="eyebrow">What we do</p>
          <h2 id="services-title">Good work.<br /><span>Built for the real world.</span></h2>
          <p className="section-intro">
            From your first idea to the next stage of growth, we make digital work that earns its place.
          </p>
        </motion.div>
        <div className="service-list">
          {services.map((service) => (
            <motion.article className="service-row" key={service.number} variants={reveal} whileHover={{ x: 8 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}>
              <span className="row-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <motion.span className="row-arrow" aria-hidden="true" whileHover={{ x: 4, y: -4, rotate: 45 }}>↗</motion.span>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="projects section-wrap"
        id="projects"
        aria-labelledby="projects-title"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={stagger}
      >
        <motion.div className="projects-heading" variants={reveal}>
          <div>
            <p className="eyebrow">Selected work · Live previews</p>
            <h2 id="projects-title">Our projects.<br /><span>Made to make a mark.</span></h2>
          </div>
          <p className="projects-intro">
            A closer look at digital experiences we’ve brought to life. Explore
            each site right here, or open it in a new tab.
          </p>
        </motion.div>
        <div className="project-grid">
          {projects.map((project) => (
            <motion.article className="project-card" key={project.number} variants={reveal}>
              <div className="project-browser">
                <div className="project-browser-bar" aria-hidden="true">
                  <span className="browser-dot" />
                  <span className="browser-dot" />
                  <span className="browser-dot" />
                  <span className="browser-address">{project.url.replace("https://", "")}</span>
                  <span className="browser-open">↗</span>
                </div>
                <ProjectPreview project={project} />
              </div>
              <div className="project-details">
                <div className="project-meta">
                  <span className="row-number">{project.number}</span>
                  <span>{project.category}</span>
                </div>
                <div className="project-title-row">
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                  </div>
                  <a
                    className="project-link"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.name} website (opens in a new tab)`}
                  >
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="approach section-wrap" id="approach" aria-labelledby="approach-title" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <motion.div className="approach-heading" variants={reveal}>
          <p className="eyebrow">A clear path from idea to impact</p>
          <h2 id="approach-title">Small team.<br /><span>Thoughtful by design.</span></h2>
        </motion.div>
        <div className="steps-list">
          {steps.map((step) => (
            <motion.article className="step" key={step.number} variants={reveal}>
              <span className="row-number">{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="contact section-wrap" id="contact" aria-labelledby="contact-title" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
        <motion.div className="contact-rule" variants={reveal}><span /> Let’s make something useful</motion.div>
        <motion.div className="contact-content" variants={reveal}>
          <h2 id="contact-title">Your next<br /><span>starts here.</span></h2>
          <div className="contact-action">
            <p>Have a project in mind? Tell us a little about it.</p>
            <motion.a className="email-link" href="mailto:humbytes@gmail.com" whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              humbytes@gmail.com <span aria-hidden="true">↗</span>
            </motion.a>
          </div>
        </motion.div>
      </motion.section>

      <motion.footer className="site-footer section-wrap" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
        <BrandMark />
        <p>Web development & digital solutions</p>
        <span className="copyright">© {new Date().getFullYear()} HUMBYTES</span>
      </motion.footer>
      </main>
    </MotionConfig>
  );
}

export default App;
