"use client";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { LogOut, Menu, User, XIcon, FileText } from "lucide-react";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Container from "../../container";
import Logo from "@/components/logo";

const pages = [
  {
    name: "Servicios",
    href: "/features"
  },
  {
    name: "Sobre mí",
    href: "/company"
  },
  {
    name: "Recursos",
    href: "/recursos"
  },
  {
    name: "Blog",
    href: "/blog"
  },
  {
    name: "Contacto",
    href: "/contact"
  }
]

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, profile, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const scrollRafRef = React.useRef<number | null>(null);

  const handleScroll = React.useCallback(() => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      setIsScrolled(window.scrollY > 24);
    });
  }, []);

  React.useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [handleScroll]);

  const closeSheet = React.useCallback(() => setIsOpen(false), []);

  const handleSignOut = React.useCallback(async () => {
    await signOut();
    toast.success("Sesión cerrada");
    navigate("/");
  }, [signOut, navigate]);

  const getInitials = () => {
    const first = profile?.first_name || "";
    const last = profile?.last_name || "";
    if (first || last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-[padding,background-color,border-color] duration-300",
        isScrolled
          ? "border-b border-white/10 bg-black/80 py-4 backdrop-blur-md"
          : "border-b border-transparent pt-6 md:pt-10"
      )}>
      <Container className="flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 xl:w-[35%] md:w-[30%] w-fit">
          <Logo size="md" />
          <span className="sr-only">Andrés Contreras</span>
        </Link>

        {/* <!-- Mobile --> */}
        <div className="flex items-center gap-2 lg:hidden">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                  <Avatar className="h-9 w-9 border border-white/20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary text-sm">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 z-50">
                <div className="px-3 py-2">
                  <p className="text-sm text-white">Hola, {getDisplayName()}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                      <Link to="/dashboard/blog" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Panel del blog
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                  </>
                )}
                <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                  <Link to="/dashboard/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-white/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <div
                className="cursor-pointer lg:hidden text-white h-11 w-11 flex items-center justify-center">
                <Menu
                  className="w-6 h-6"
                />
              </div>
            </SheetTrigger>

            <SheetContent
              className="flex flex-col justify-between bg-black border-foreground"
            >
              <div className="h-full flex flex-col">
                <SheetHeader className="flex flex-row justify-between border-b border-foreground">
                  <SheetTitle className="flex items-center">
                    <Link to="/" className="flex items-center" onClick={closeSheet}>
                      <Logo size="sm" />
                    </Link>
                  </SheetTitle>
                  <div className="flex items-center gap-2">
                    <SheetPrimitive.Close
                      className="h-11 w-11 flex items-center justify-center data-[state=open]:bg-white right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none">
                      <XIcon className="size-5 text-white" />
                      <span className="sr-only">Close</span>
                    </SheetPrimitive.Close>
                  </div>
                </SheetHeader>
                <div className="px-5 py-6 flex flex-col h-full justify-between flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    {pages.map((page) => (
                      <Link key={page.href} to={page.href} onClick={closeSheet} className="block py-2 text-muted hover:text-primary transition-colors">
                        {page.name}
                      </Link>
                    ))}
                    {!user && (
                      <Button asChild variant="gray" size="default" className="mt-4 w-full">
                        <Link to="/contact" onClick={closeSheet}>Cuéntame tu proyecto</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* <!-- Desktop --> */}
        <NavigationMenu className="hidden lg:block mx-auto">
          <NavigationMenuList className="gap-1">
            {pages.map((page) => (
              <NavigationMenuItem key={page.href}>
                <NavigationMenuLink asChild>
                  <Link to={page.href} className="px-4 py-2 text-white whitespace-nowrap hover:text-primary transition-colors">
                    {page.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex gap-2 items-center xl:w-[35%] md:w-[30%] w-fit justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity">
                  <span className="text-sm text-white">Hola, {getDisplayName()}</span>
                  <Avatar className="h-10 w-10 border border-white/20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 z-50">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">{profile?.first_name} {profile?.last_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                      <Link to="/dashboard/blog" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Panel del blog
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                  </>
                )}
                <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                  <Link to="/dashboard/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-white/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="gray" size="default">
              <Link to="/contact">Cuéntame tu proyecto</Link>
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
