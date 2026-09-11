import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RefreshCw, ShoppingCart, Bot } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const BusinessAccount = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      icon: "/images/icons/bank.svg",
      title: "Migraciones",
      badge: "Sin downtime",
      heading: "Migra sin perder nada en el camino",
      description: "Saco sitios de plataformas legadas a un stack propio, rescatando contenido con scraping cuando hace falta.",
      Visual: RefreshCw,
      link: "/contact",
    },
    {
      icon: "/images/icons/growth-arrow.svg",
      title: "E-commerce",
      badge: "Tiendas que venden",
      heading: "Tiendas en línea que convierten",
      description: "Catálogos grandes, checkout claro y experiencias a medida como quizzes de recomendación.",
      Visual: ShoppingCart,
      link: "/contact",
    },
    {
      icon: "/images/icons/globe.svg",
      title: "IA aplicada",
      badge: "Automatización",
      heading: "IA que resuelve problemas de negocio",
      description: "Asistentes y automatizaciones con Claude API enfocados en resultados, no en demos.",
      Visual: Bot,
      link: "/contact",
    },
  ];

  return (
    <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12" id="business-account">
      <Container className="space-y-2xl">
        {/* Top Tabs Section */}
        <div className="flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 p-1 bg-[#F5F5F7] rounded-[16px]"
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`
                    flex items-center gap-4 p-[10px] rounded-[12px] transition-all duration-300 w-full justify-start
                    ${isActive
                      ? "bg-white shadow-sm text-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-white/50"
                    }
                  `}
                >
                  <div className="shrink-0 w-10 h-10">
                    <img
                      src={tab.icon}
                      alt={tab.title}
                      width="40"
                      height="40"
                      loading="lazy" />
                  </div>
                  <span className="font-medium">{tab.title}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-12 lg:gap-16">
          {/* Left Side - Text Content */}
          <div className="flex flex-col md:max-w-[366px]">
            <AnimatePresence mode="wait">
              <StaggerContainer
                key={activeTab}
                className="flex flex-col"
              >
                <AnimateOnView
                  once
                  blur
                  className="md:mb-4 mb-1.5">
                  <Badge variant="default" className="text-sm">
                    {tabs[activeTab].badge}
                  </Badge>
                </AnimateOnView>

                <AnimateOnView
                  once
                  blur
                  delay={0.2}
                >
                  <h2 className="h4 md:mb-5 mb-3">
                    {tabs[activeTab].heading}
                  </h2>
                </AnimateOnView>

                <AnimateOnView
                  once
                  blur
                  delay={0.4}
                >
                  <p className="text-lg md:mb-10 mb-4">
                    {tabs[activeTab].description}
                  </p>
                </AnimateOnView>

                <AnimateOnView
                  once
                  delay={0.6}
                >
                  <Button asChild>
                    <Link to={tabs[activeTab].link}>
                      Cuéntame tu proyecto
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </AnimateOnView>
              </StaggerContainer>
            </AnimatePresence>
          </div>

          {/* Right Side - Visual */}
          <div className="relative flex items-center justify-center md:min-h-[524px] p-4 max-w-[691px] w-full bg-card rounded-4xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-[#2563EB]/10 flex items-center justify-center"
                aria-hidden="true"
              >
                {(() => {
                  const Visual = tabs[activeTab].Visual;
                  return <Visual className="w-16 h-16 md:w-24 md:h-24 text-[#2563EB]" strokeWidth={1.5} />;
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BusinessAccount;

