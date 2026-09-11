import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { createLead } from "@/lib/services/leads-service";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Permisiva a propósito: acepta indicativos, espacios, guiones y paréntesis.
const phoneRegex = /^\+?[\d\s().-]{7,20}$/;

const contactFormSchema = z.object({
  firstName: z.string().min(2, "Escribe tu nombre"),
  lastName: z.string().min(2, "Escribe tu apellido"),
  email: z.string().email("Revisa el correo, no parece válido"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), "Revisa el teléfono"),
  subject: z.string().min(3, "Cuéntame en pocas palabras de qué se trata"),
  message: z.string().min(10, "Un poco más de contexto me ayuda a responderte mejor"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await createLead({
        email: data.email,
        name: [data.firstName, data.lastName].filter(Boolean).join(" "),
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        source: "contacto",
      });

      toast({
        title: "Mensaje enviado",
        description: "Te respondo lo antes posible al correo que dejaste.",
        variant: "default",
      });

      // Reset form
      form.reset();

      // Show success state
      setIsSuccess(true);

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      
      // Clear any previous errors
      setError(null);
    } catch (error) {
      console.error("Error al guardar el contacto:", error);
      toast({
        title: "No se pudo enviar",
        description: "Inténtalo de nuevo o escríbeme directo a hola@contreras.dev.",
        variant: "destructive",
      });

      setError("No se pudo enviar el mensaje. Escríbeme a hola@contreras.dev si sigue fallando.");
      
      // Reset error state after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <Container className="md:space-y-10 xl:space-y-2xl space-y-8">
        {/* Header Section */}
        <div className="text-center max-w-[612px] mx-auto">
          <h2 className="h2 mb-4">
            Escríbeme
          </h2>
          <p className="">
            Entre más contexto me des sobre el proyecto, mejor te puedo
            responder: qué tienes hoy, qué quieres lograr y para cuándo.
          </p>
        </div>

        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-[822px] mx-auto">
            {/* First Name and Last Name - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu nombre"
                        {...field}
                        className="bg-card border-muted focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu apellido"
                        {...field}
                        className="bg-card border-muted focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email and Phone - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tucorreo@empresa.com"
                        {...field}
                        className="bg-card border-muted focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Tu teléfono"
                        {...field}
                        className="bg-card border-muted focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subject - Full Width */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Migración, tienda en línea, automatización con IA..."
                      {...field}
                      className="bg-card border-muted focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message - Full Width */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntame qué tienes hoy y qué quieres lograr"
                      className="min-h-[120px] bg-card border-muted focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex flex-col items-center w-full">
              <Button
                type="submit"
                className="bg-primary text-white hover:bg-primary/90 w-full"
                disabled={form.formState.isSubmitting}
              >
                Enviar mensaje
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p 
                className={cn(
                  "text-sm mt-2 min-h-[20px] transition-opacity duration-200",
                  isSuccess ? "text-green-500 opacity-100" : "opacity-0 invisible"
                )}
              >
                Message sent successfully! We'll get back to you soon.
              </p>
              <p 
                className={cn(
                  "text-sm mt-2 min-h-[20px] transition-opacity duration-200",
                  error ? "text-red-500 opacity-100" : "opacity-0 invisible"
                )}
              >
                {error}
              </p>
            </div>
          </form>
        </Form>
      </Container>
    </section>
  );
};

export default ContactForm;

