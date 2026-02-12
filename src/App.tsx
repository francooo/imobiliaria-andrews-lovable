import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import PropertyDetails from "./components/PropertyDetails";
import AdminPanel from "./components/AdminPanel";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider as AdminAuthProvider } from "./hooks/useAuth";
import { AuthProvider as ClientAuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute as ClientProtectedRoute } from "./components/auth/ProtectedRoute";
import ClientLogin from "./pages/ClientLogin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ClientArea from "./pages/ClientArea";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClientAuthProvider>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Admin Routes */}
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Client Routes */}
              <Route path="/cliente/login" element={<ClientLogin />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/esqueci-senha" element={<ForgotPassword />} />
              <Route
                path="/area-cliente"
                element={
                  <ClientProtectedRoute>
                    <ClientArea />
                  </ClientProtectedRoute>
                }
              />

              {/* Property Routes */}
              <Route path="/imovel/:id" element={<PropertyDetails />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </ClientAuthProvider>
  </QueryClientProvider>
);

export default App;
