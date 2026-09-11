import Container from "@/components/container";
import Logo from "@/components/logo";
import NewsletterForm from "@/components/newsletter-form";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/andrescontreras38", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { label: "Email", href: "mailto:hola@contreras.dev", icon: Mail },
];

const pagesLinks = [
  {
    title: "Inicio",
    href: "/",
  },
  {
    title: "Servicios",
    href: "/features",
  },
  {
    title: "Sobre mí",
    href: "/company",
  },
  {
    title: "Recursos",
    href: "/recursos",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Contacto",
    href: "/contact",
  },
];

const innerLinks = [
  {
    title: "Casos",
    href: "/features",
  },
  {
    title: "Preguntas frecuentes",
    href: "/contact",
  },
  {
    title: "Escríbeme",
    href: "mailto:hola@contreras.dev",
  },
];

const Footer = () => {

  return (
    <footer className="relative bg-black text-white pt-36 pb-8 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute bottom-0 left-0 pointer-events-none w-[533px] h-[601px] z-10">
        <img src="/images/common/footer-pattern.svg" alt="pattern" />
      </div>

      <Container className="relative z-20">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
          <div
            className="space-y-[60px] max-w-[310px]"
          >

            <div>
              <Link to="/">
                <Logo size="md" className="mb-6" />
              </Link>
              <p className="text-muted">
                Desarrollador full-stack especializado en migraciones, e-commerce e IA aplicada a problemas reales de negocio.
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="text-white">
                Contacto:
              </p>
              <p className="text-muted">
                hola@contreras.dev
              </p>
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                    aria-label={label}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-muted hover:text-white hover:border-white/40 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-[537px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Column 2: Pages */}
            <AnimateOnView
              once
              delay={0.1}
            >
              <h3 className="text-lg font-semibold mb-6">Páginas</h3>
              <ul className="space-y-3">
                {pagesLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.href} className="text-muted hover:text-white transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AnimateOnView>

            {/* Column 3: Utility & Newsletter */}
            <AnimateOnView
              once
              delay={0.2}
              className="space-y-8 lg:col-span-2"
            >
              {/* Utility Links */}
              <div>
                <h3 className="text-lg font-semibold mb-6">Más</h3>
                <ul className="space-y-3">
                  {innerLinks.map((link, index) => (
                    <li key={index}>
                      {link.href.startsWith("mailto:") ? (
                        <a href={link.href} className="text-muted hover:text-white">
                          {link.title}
                        </a>
                      ) : (
                        <Link to={link.href} className="text-muted hover:text-white">
                          {link.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Actualizaciones de contreras.dev
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Notas sobre migraciones, e-commerce e IA aplicada, directo a tu correo.
                </p>
                <NewsletterForm
                  buttonVariant="secondary"
                  buttonClassName="bg-white text-black hover:bg-white/90 px-4 h-10"
                  inputClassName="bg-foreground"
                  formClassName="flex"
                  gap="gap-1"
                />
              </div>
            </AnimateOnView>

          </div>

        </div>

        {/* Bottom Bar: Copyright and Legal Links */}
        <AnimateOnView
          once
          delay={0.3}
          className="border-t border-[#2a2a2a] pt-8 mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Andrés Contreras.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/privacy-policy"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Política de privacidad
              </Link>
              <Link
                to="/terms-&-condition"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Términos y condiciones
              </Link>
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Administrar
              </Link>
            </div>
          </div>
        </AnimateOnView>
      </Container>
    </footer>
  );
};

export default Footer;

