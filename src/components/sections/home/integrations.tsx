import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { Atom, Braces, Database, FileCode2, Bot, Server } from "lucide-react";
import { useMemo, useRef } from "react";

const techStack = [
  { name: "Next.js", Icon: FileCode2 },
  { name: "React", Icon: Atom },
  { name: "Node.js", Icon: Server },
  { name: "Python", Icon: Braces },
  { name: "Supabase", Icon: Database },
  { name: "Claude API", Icon: Bot },
];

interface LogoItem {
  id: number;
  x: number;
  y: number;
  scrollThreshold: number;
}

interface LogoProps {
  index: number;
  logo: LogoItem;
  scrollYProgress: MotionValue<number>;
}

const Logo = ({ index, logo, scrollYProgress }: LogoProps) => {
  const opacity = useTransform(
    scrollYProgress,
    [logo.scrollThreshold - 0.15, logo.scrollThreshold],
    [0, 1],
    { clamp: true }
  );

  const scale = useTransform(
    scrollYProgress,
    [logo.scrollThreshold - 0.15, logo.scrollThreshold],
    [0.8, 1],
    { clamp: true }
  );

  const tech = techStack[index % techStack.length];
  const TechIcon = tech.Icon;

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-2"
      style={{
        left: `${logo.x}%`,
        top: `${logo.y}%`,
        transform: 'translate(-50%, -50%)',
        opacity,
        scale,
      }}
      transition={{
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[91px] md:h-[91px] rounded-2xl bg-white shadow-md flex items-center justify-center">
        <TechIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 text-[#2563EB]" strokeWidth={1.5} />
      </div>
      <span className="text-xs sm:text-sm font-medium text-muted-foreground">{tech.name}</span>
    </motion.div>
  );
};

const Integrations = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const logos = useMemo(() => {
    const logoCount = techStack.length;

    // Use safer positions on mobile to prevent logos from going off-screen
    const positions = isMobile
      ? [
        { x: 20, y: 15 },
        { x: 80, y: 15 },
        { x: 20, y: 45 },
        { x: 80, y: 45 },
        { x: 20, y: 78 },
        { x: 80, y: 78 },
      ]
      : [
        { x: 12, y: 15 },
        { x: 50, y: 12 },
        { x: 88, y: 15 },
        { x: 12, y: 80 },
        { x: 50, y: 85 },
        { x: 88, y: 80 },
      ];

    const baseLogos: LogoItem[] = Array.from({ length: logoCount }, (_, i) => ({
      id: i,
      x: positions[i].x,
      y: positions[i].y,
      scrollThreshold: 0,
    }));

    const shuffle = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const shuffledLogos = shuffle(baseLogos);

    const thresholds = [0.15, 0.28, 0.41, 0.54, 0.67, 0.8];
    return shuffledLogos.map((logo, index) => ({
      ...logo,
      scrollThreshold: thresholds[index],
    }));
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="relative bg-card" id="integrations" style={{ height: '300vh' }}>
      {/* Sticky centered text container */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <Container className="relative z-10">
          <AnimateOnView>
            <h2 className="h2 text-center max-w-[644px] mx-auto mb-4">
              Trabajo con el <span className="text-muted-foreground">stack que tu proyecto necesita</span>
            </h2>
          </AnimateOnView>
        </Container>

        {/* Random positioned tech icons - positioned relative to viewport */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none">
          {logos.map((logo, i) => (
            <Logo key={logo.id} index={i} logo={logo} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
