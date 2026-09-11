import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLead } from "@/lib/services/leads-service";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { useId, useRef, useState } from "react";
import { buttonVariants } from "./ui/button";

interface NewsletterFormProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  buttonClassName?: string;
  inputClassName?: string;
  formClassName?: string;
  gap?: string;
  onSubmit?: (email: string) => void;
}

const NewsletterForm = ({
  title = "Actualizaciones de contreras.dev",
  description = "Automatización, agentes con IA y desarrollo, sin relleno.",
  placeholder = "Tu correo",
  buttonText = "Suscribirme",
  buttonVariant,
  buttonClassName,
  inputClassName,
  formClassName,
  gap,
  onSubmit,
}: NewsletterFormProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mensajeError, setMensajeError] = useState("No se pudo guardar. Inténtalo de nuevo.");
  const formRef = useRef<HTMLFormElement>(null);
  // El formulario aparece más de una vez por página (cabecera y pie), así que
  // el identificador tiene que ser único o los `label` apuntarían al mismo sitio.
  const trampaId = useId();

  const marcarExito = () => {
    formRef.current?.reset();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const email = ((datos.get("email") as string) || "").trim();
    if (!email || isSending) return;

    // Campo trampa: invisible para una persona, irresistible para un bot que
    // rellena todo lo que encuentra. Se finge éxito para no enseñarle al bot
    // que lo detectamos.
    if (datos.get("sitio-web-empresa")) {
      marcarExito();
      return;
    }

    setIsSending(true);
    setFailed(false);

    try {
      await createLead({ email, source: "newsletter" });

      onSubmit?.(email);
      marcarExito();
    } catch (error) {
      const codigo = (error as { code?: string })?.code;

      // Un correo repetido no es un fallo para quien se suscribe: ya está dentro.
      // P0001 es el freno de envíos: tampoco tiene sentido pedirle que reintente
      // "de nuevo" cuando lo que necesita es esperar.
      if (codigo === "23505") {
        marcarExito();
      } else if (codigo === "P0001") {
        setMensajeError((error as { message: string }).message);
        setFailed(true);
        setTimeout(() => setFailed(false), 5000);
      } else {
        console.error("Error al guardar la suscripción:", error);
        setMensajeError("No se pudo guardar. Inténtalo de nuevo.");
        setFailed(true);
        setTimeout(() => setFailed(false), 5000);
      }
    } finally {
      setIsSending(false);
    }
  };

  const gapClass = gap || "gap-1 md:gap-2.5";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={cn("block", formClassName)}>
      {/* Campo trampa para bots. Invisible y fuera del foco del teclado. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={trampaId}>Deja este campo vacío</label>
        <input
          id={trampaId}
          name="sitio-web-empresa"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col">
        <div className={`flex ${gapClass}`}>
          <div className="w-full">
            <Input
              type="email"
              name="email"
              placeholder={placeholder}
              className={cn(
                "w-full text-white placeholder:text-muted-foreground focus:border-primary",
                isSuccess && "border-green-500 focus:border-green-500",
                inputClassName
              )}
              required
            />
          </div>
          <Button
            type="submit"
            variant={buttonVariant}
            className={buttonClassName}
            disabled={isSending}
          >
            {isSending ? "Enviando..." : buttonText}
          </Button>
        </div>
        <p
          role="status"
          className={cn(
            "text-sm mt-1 min-h-[20px] transition-opacity duration-200",
            isSuccess && "text-green-500 opacity-100",
            failed && "text-red-400 opacity-100",
            !isSuccess && !failed && "opacity-0 invisible"
          )}
        >
          {failed ? mensajeError : "Listo, quedaste suscrito."}
        </p>
      </div>
    </form>
  );
};

export default NewsletterForm;

