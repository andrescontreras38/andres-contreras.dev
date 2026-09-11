import ProtectedRoute from "@/components/protected-route";
import AdminGuard from "@/components/dashboard/admin-guard";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Blog from "./pages/blog";
import BlogDetails from "./pages/blog/[slug]";
import Company from "./pages/company";
import Contact from "./pages/contact";
import Features from "./pages/features";
import Home from "./pages/home";
import CookiePolicyPage from "./pages/legal/cookie-policy";
import PrivacyPolicyPage from "./pages/legal/privacy-&-policy";
import TermsAndConditionPage from "./pages/legal/terms-&-condition";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgot-password";
import NotFound from "./pages/not-found";
import ResourcesPage from "./pages/resources";
import ResourceDetail from "./pages/resources/[slug]";


// El panel de administración se carga aparte: incluye el editor de texto
// enriquecido, que son cientos de kB que ningún visitante necesita.
const ContactsPage = lazy(() => import("./pages/dashboard/contactos"));
const ResourcesAdmin = lazy(() => import("./pages/dashboard/recursos"));
const ProfileSettings = lazy(() => import("./pages/dashboard/profile"));
const BlogDashboard = lazy(() => import("./pages/dashboard/blog"));
const BlogEditor = lazy(() => import("./pages/dashboard/blog/editor"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/company" element={<Company />} />
              <Route path="/features" element={<Features />} />
              <Route path="/recursos" element={<ResourcesPage />} />
              <Route path="/recursos/:slug" element={<ResourceDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms-&-condition" element={<TermsAndConditionPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/recursos"
                element={
                  <AdminGuard>
                    <ResourcesAdmin />
                  </AdminGuard>
                }
              />
              <Route
                path="/dashboard/contactos"
                element={
                  <AdminGuard>
                    <ContactsPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/dashboard/blog"
                element={
                  <AdminGuard>
                    <BlogDashboard />
                  </AdminGuard>
                }
              />
              <Route
                path="/dashboard/blog/new"
                element={
                  <AdminGuard>
                    <BlogEditor />
                  </AdminGuard>
                }
              />
              <Route
                path="/dashboard/blog/edit/:id"
                element={
                  <AdminGuard>
                    <BlogEditor />
                  </AdminGuard>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
