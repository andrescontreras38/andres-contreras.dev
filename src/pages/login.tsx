import Logo from "@/components/logo";
import SEO from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Acceso de administración. El sitio no tiene registro público: la única cuenta
 * que existe es la de Andrés, creada desde Supabase. Por eso aquí no hay
 * proveedores externos ni enlace a "crear cuenta".
 */
const Login = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si ya hay sesión, no tiene sentido mostrar el formulario.
  useEffect(() => {
    if (user) navigate("/dashboard/blog", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      // Sin distinguir si falló el correo o la contraseña: decirlo revelaría
      // qué correos tienen cuenta.
      setError("Correo o contraseña incorrectos.");
      setSending(false);
      return;
    }

    navigate("/dashboard/blog", { replace: true });
  };

  return (
    <>
      <SEO
        title="Acceso | Andrés Contreras"
        description="Acceso de administración."
        canonicalUrl="/login"
        noIndex
      />

      <main className="min-h-screen bg-[#05070d] flex flex-col items-center justify-center px-6 py-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(5,7,13,0) 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative w-full max-w-[380px]">
          <Link to="/" className="flex justify-center mb-10">
            <Logo size="md" />
          </Link>

          <h1 className="text-2xl font-semibold text-white text-center mb-2">Entrar al panel</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Desde aquí publicas artículos y recursos.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Correo
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between mt-6 text-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al sitio
            </Link>
            <Link
              to="/forgot-password"
              className="text-muted-foreground hover:text-white transition-colors"
            >
              Olvidé mi contraseña
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
