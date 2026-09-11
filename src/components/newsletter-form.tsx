import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLead } from "@/lib/services/leads-service";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { useRef, useState } from "react";
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
  description = "Migraciones, e-commerce e IA aplicada, sin relleno.",
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
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get("email") as string || "").trim();
    if (!email || isSending) return;

    setIsSending(true);
    setFailed(false);

    try {
      await createLead({ email, source: "newsletter" });

      onSubmit?.(email);
      formRef.current?.reset();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      // Un correo repetido no es un fallo para quien se suscribe: ya está dentro.
      const duplicated = (error as { code?: string })?.code === "23505";
      if (duplicated) {
        formRef.current?.reset();
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        console.error("Error al guardar la suscripción:", error);
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
          {failed ? "No se pudo guardar. Inténtalo de nuevo." : "Listo, quedaste suscrito."}
        </p>
      </div>
    </form>
  );
};

export default NewsletterForm;

