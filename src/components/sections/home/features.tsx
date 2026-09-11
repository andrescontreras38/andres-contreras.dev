import Container from "@/components/container";
import FeatureCard from "@/components/ui/feature-card";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type FeatureItem = {
  id: string;
  type: "feature";
  icon: string;
  title: string;
  description: string;
};

type LottieItem = {
  id: string;
  type: "lottie";
};

const items: (FeatureItem | LottieItem)[] = [
  {
    id: "fast-reliable",
    type: "feature",
    icon: "/images/icons/star.svg",
    title: "Rápido y confiable",
    description: "Entregas reales, con avances visibles desde la primera semana."
  },
  {
    id: "flex-integrations",
    type: "feature",
    icon: "/images/icons/arrow.svg",
    title: "Integraciones flexibles",
    description: "Se conecta con tus herramientas actuales o vía APIs a medida."
  },
  {
    id: "coin-animation",
    type: "lottie",
  },
  {
    id: "transparent-pricing",
    type: "feature",
    icon: "/images/icons/tag.svg",
    title: "Alcance transparente",
    description: "Sabes qué se construye y por qué, en cada etapa del proyecto."
  },
  {
    id: "global-reach",
    type: "feature",
    icon: "/images/icons/globe.svg",
    title: "Trabajo remoto",
    description: "Colaboro con equipos y clientes desde cualquier zona horaria."
  },
];

// Four plates of a floating stack, darkest at the base and brightest at the
// surface. `taper` counteracts the perspective enlargement of the upper plates
// so they read as equal tiers rather than a funnel.
const stackPlates = [
  { z: -36, taper: 1, fill: "linear-gradient(145deg, rgba(30,64,175,0.50), rgba(15,23,42,0.28))", edge: "rgba(96,165,250,0.30)" },
  { z: -12, taper: 0.96, fill: "linear-gradient(145deg, rgba(37,99,235,0.52), rgba(30,58,138,0.28))", edge: "rgba(96,165,250,0.40)" },
  { z: 12, taper: 0.92, fill: "linear-gradient(145deg, rgba(59,130,246,0.55), rgba(37,99,235,0.30))", edge: "rgba(147,197,253,0.52)" },
  { z: 36, taper: 0.88, fill: "linear-gradient(145deg, rgba(125,211,252,0.52), rgba(59,130,246,0.32))", edge: "rgba(191,232,255,0.70)" },
];

const Features = ({ heroRef }: { heroRef?: React.RefObject<HTMLElement> | null }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [isDesktop, setIsDesktop] = useState(false);

  // Check for desktop on mount and resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    return () => {
      window.removeEventListener("resize", checkDesktop);
    };
  }, []);

  // Lottie Scroll Animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  });

  useEffect(() => {
    const calculateOffset = () => {
      if (!heroRef?.current || !lottieContainerRef.current) return;

      const heroRect = heroRef.current.getBoundingClientRect();
      const containerRect = lottieContainerRef.current.getBoundingClientRect();

      const heroCenterX = heroRect.left + heroRect.width / 2;

      const heroCenterY = heroRect.top + heroRect.height / 2 + window.scrollY + 250;

      const containerCenterX = containerRect.left + containerRect.width / 2;
      const containerCenterY = containerRect.top + containerRect.height / 2 + window.scrollY;

      const offsetX = heroCenterX - containerCenterX;
      const offsetY = heroCenterY - containerCenterY;

      setOffset({ x: offsetX, y: offsetY });
    };

    const timeoutId = setTimeout(() => {
      calculateOffset();
    }, 100);

    window.addEventListener("resize", calculateOffset);
    window.addEventListener("scroll", calculateOffset);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", calculateOffset);
      window.removeEventListener("scroll", calculateOffset);
    };
  }, [heroRef]);

  const x = useTransform(scrollYProgress, [0, 1], [offset.x, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [offset.y, 0]);
  // Capped at 2.4: past that the composited 3D layer is rasterized at 1x and
  // upscaled, and the plate edges go soft.
  const scale = useTransform(scrollYProgress, [0, 1], [2.4, 1]);

  return (
    <section ref={sectionRef} className="md:pt-20 xl:pt-[100px] pt-12 md:pb-20 pb-12" id="features">
      <Container className="md:space-y-10 xl:space-y-2xl space-y-8">
        {/* Section header */}
        <AnimateOnView>
          <h2 className="h4 text-center max-w-[389px] mx-auto mb-4">
            Desarrollo rápido, seguro y <span className="text-muted-foreground">a la medida de tu negocio</span>
          </h2>
        </AnimateOnView>

        {/* Features grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-4 relative">
          {items.map((item, index) => {
            if (item.type === "lottie") {
              return (
                <div
                  key={item.id}
                  className="w-full h-full lg:col-span-1 sm:col-span-2 col-span-1"
                >
                  {/*
                    The stack is scroll-linked to the hero and has to render
                    outside this tile while it flies in, so nothing that wraps
                    it may clip. Only the surface layer clips itself.
                  */}
                  <div className="relative h-full rounded-lg">
                    {/* Tile surface: one deep ground with a single light from above */}
                    <div className="absolute inset-0 rounded-lg overflow-hidden bg-[#05070d] pointer-events-none">
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(115% 80% at 50% 8%, rgba(37,99,235,0.34) 0%, rgba(37,99,235,0.08) 42%, rgba(5,7,13,0) 70%)",
                        }}
                      />
                      <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#60A5FA]/45 to-transparent" />
                    </div>

                    {/* Foreground — unclipped, so the stack can fly in from the hero */}
                    <div className="relative h-full flex items-center justify-center p-0 sm:p-6">
                      <div ref={lottieContainerRef} className="w-32 h-32 sm:w-40 sm:h-40 md:w-full md:h-full relative flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={isDesktop ? { x, y, scale } : {}}
                        >
                          {/* Camera. The plates spread ~150px vertically once
                              tilted, so the scene is scaled down to fit the
                              smaller tiles instead of spilling out of them. */}
                          <div className="scale-[0.72] sm:scale-90 md:scale-100" style={{ perspective: 820 }}>
                            {/* Fixed tilt. The turntable spin lives on the child so the
                                tilt is applied first and the spin axis stays vertical. */}
                            <div
                              style={{
                                width: 116,
                                height: 116,
                                transformStyle: "preserve-3d",
                                transform: "rotateX(58deg)",
                              }}
                            >
                              <motion.div
                                className="relative w-full h-full"
                                style={{ transformStyle: "preserve-3d" }}
                                animate={{ rotateZ: 360 }}
                                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                              >
                                {/* Ground plane: the light the stack casts, and the floor it sits on */}
                                <div
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                  style={{
                                    transform: "translateZ(-58px)",
                                    background:
                                      "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.30) 0%, rgba(59,130,246,0.07) 36%, rgba(0,0,0,0) 66%)",
                                  }}
                                >
                                  <div
                                    className="absolute inset-0"
                                    style={{
                                      backgroundImage:
                                        "linear-gradient(rgba(125,180,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(125,180,255,0.22) 1px, transparent 1px)",
                                      backgroundSize: "16px 16px",
                                      WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 8%, transparent 62%)",
                                      maskImage: "radial-gradient(circle at 50% 50%, black 8%, transparent 62%)",
                                    }}
                                  />
                                </div>

                                {/* The stack */}
                                {stackPlates.map((plate) => (
                                  <div
                                    key={plate.z}
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-[13px]"
                                    style={{
                                      transform: `translateZ(${plate.z}px) scale(${plate.taper})`,
                                      background: plate.fill,
                                      border: `1px solid ${plate.edge}`,
                                      boxShadow: "0 18px 30px -18px rgba(2,6,23,0.9)",
                                    }}
                                  />
                                ))}

                                {/* A pulse of light rising through the layers */}
                                <motion.div
                                  aria-hidden="true"
                                  className="absolute inset-4 rounded-full"
                                  style={{
                                    background:
                                      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(165,214,255,0.55) 30%, rgba(59,130,246,0) 64%)",
                                  }}
                                  animate={{ z: [-40, 44, -40], opacity: [0, 0.95, 0] }}
                                  transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
                                />
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <AnimateOnView
                key={item.id}
                once
                y={40}
                delay={index * 0.1}
                className={`relative z-10 
                  ${index < 2 ? 'lg:col-span-1 sm:col-span-2 col-span-1' : 'lg:col-span-1 sm:col-span-3 col-span-1'}
                  `}
              >
                <FeatureCard icon={item.icon} title={item.title} description={item.description} />
              </AnimateOnView>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Features;