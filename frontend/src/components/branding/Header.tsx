import logo from "@/assets/nespak-logo.jpg";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  return <header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img src={logo} alt="NESPAK logo" className="h-10 w-auto" loading="eager" />
          
        </div>
        {!isAuthPage && (
          <nav className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => navigate('/signup')}>
              Register
            </Button>
          </nav>
        )}
      </div>
    </header>;
};
export default Header;