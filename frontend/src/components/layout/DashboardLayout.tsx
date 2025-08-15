import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Bell, 
  LogOut, 
  Home, 
  BookOpen, 
  Presentation, 
  FileText, 
  FolderOpen,
  Shield
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/nespak-logo.jpg";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

const DashboardLayout = ({ 
  children, 
  title, 
  searchPlaceholder = "Search trainings, projects, documents...",
  onSearch 
}: DashboardLayoutProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Trainings & Development", path: "/training-development" },
    { icon: Presentation, label: "Nespak Representation", path: "/nespak-representation" },
    { icon: FileText, label: "Nespak Preferences", path: "/nespak-preferences" },
    { icon: FolderOpen, label: "Project Documents", path: "/project-documents" },
    { icon: Shield, label: "Admin Panel", path: "/admin-panel" }
  ];

  const handleLogout = () => {
    // TODO: Call logout API here
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b h-16 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="NESPAK logo" className="h-8 w-auto" />
            {title && <h1 className="text-lg font-semibold">{title}</h1>}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder={searchPlaceholder}
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Right Side - Notifications & Profile */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 flex items-center justify-center">
                3
              </Badge>
            </Button>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">John Doe</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-16 h-full bg-white border-r transition-all duration-300 z-40 ${
          sidebarExpanded ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                sidebarExpanded ? 'gap-3' : 'justify-center'
              } ${
                location.pathname === item.path 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => navigate(item.path)}
            >
              {sidebarExpanded ? (
                <>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </>
              ) : (
                <item.icon className="w-5 h-5" />
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;