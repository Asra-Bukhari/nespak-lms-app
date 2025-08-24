import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import axios from "axios";
import logo from "@/assets/nespak-logo.jpg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
}

const DashboardLayout = ({ 
  children, 
  title, 
  searchPlaceholder = "Search trainings, projects, documents...",
  onSearch 
}: DashboardLayoutProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user info
  useEffect(() => {
    const userId =  sessionStorage.getItem("user_id");
    if (!userId) return;

    axios.get(`${API_BASE_URL}/api/users/${userId}`)
      .then(res => {
        setUser(res.data);
        setNewName(res.data.name);
      })
      .catch(err => console.error("Failed to fetch user:", err));
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

const handleSaveName = () => {
  const userId = sessionStorage.getItem("user_id");
  const token = sessionStorage.getItem("token"); // if your API needs auth

  if (!userId || !newName.trim()) return;

  axios.patch(
    `${API_BASE_URL}/api/users/${userId}`,
    { name: newName },
    {
      headers: {
        Authorization: `Bearer ${token}` // optional if your API requires it
      }
    }
  )
  .then(res => {
    setUser(res.data);        // update local state
    setEditingName(false);    // hide edit input
  })
  .catch(err => console.error("Failed to update name:", err));
};


  const filteredSidebarItems = useMemo(() => {
    const items = [
      { icon: Home, label: "Dashboard", path: "/dashboard" },
      { icon: BookOpen, label: "Trainings & Development", path: "/training-development" },
      { icon: Presentation, label: "Nespak Representation", path: "/nespak-representation" },
      { icon: FileText, label: "Nespak Preferences", path: "/nespak-preferences" },
      { icon: FolderOpen, label: "Project Documents", path: "/project-documents" },
    ];

    if (user?.role === "admin") {
      items.push({ icon: Shield, label: "Admin Panel", path: "/admin-panel" });
    }

    return items;
  }, [user]);

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("token");
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Only show search bar on pages NOT dashboard or admin-panel
  const showSearchBar = !["/dashboard", "/admin-panel"].some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b h-16 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="NESPAK logo" className="h-8 w-auto" />
          </div>

          {/* Search Bar */}
          {showSearchBar && (
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
          )}

          {/* Right Side - Notifications & Profile */}
          <div className="flex items-center gap-4">
             {/*<Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500 flex items-center justify-center">
                3
              </Badge>
            </Button>*/}
            
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                {user ? (
                  <AvatarFallback>{getInitials(newName)}</AvatarFallback>
                ) : (
                  <AvatarFallback>JD</AvatarFallback>
                )}
              </Avatar>

              {editingName ? (
                <div className="flex gap-1 items-center">
                  <Input 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-32"
                  />
                  <Button size="sm" onClick={handleSaveName}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditingName(false); setNewName(user?.name || ""); }}>Cancel</Button>
                </div>
              ) : (
                <span 
                  className="text-sm font-medium cursor-pointer hover:underline" 
                  onClick={() => setEditingName(true)}
                >
                  {user?.name || "John Doe"}
                </span>
              )}

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
          {filteredSidebarItems.map((item, index) => (
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
