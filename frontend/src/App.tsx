import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TrainingDevelopment from "./pages/TrainingDevelopment";
import NespakRepresentation from "./pages/NespakRepresentation";
import NespakPreferences from "./pages/NespakPreferences";
import ProjectDocuments from "./pages/ProjectDocuments";
import ContentPage from "./pages/ContentPage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/training-development" element={<TrainingDevelopment />} />
          <Route path="/nespak-representation" element={<NespakRepresentation />} />
          <Route path="/nespak-preferences" element={<NespakPreferences />} />
          <Route path="/project-documents" element={<ProjectDocuments />} />
          <Route path="/content/:id" element={<ContentPage />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
