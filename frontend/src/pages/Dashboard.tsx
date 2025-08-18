import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Presentation, FileText, FolderOpen, Play, Calendar, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface DashboardStats {
  trainings: number;
  events: number;
  documents: number;
  files: number;
  modulesAccessed: number;
  newUploads: number;
  completedModules: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    trainings: 0,
    events: 0,
    documents: 0,
    files: 0,
    modulesAccessed: 0,
    newUploads: 0,
    completedModules: 0
  });

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    // Fetch dashboard stats
    axios.get(`${API_BASE_URL}/api/dashboard/stats?userId=${userId}`)
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to fetch dashboard stats:", err));

    // Fetch user info
    axios.get(`${API_BASE_URL}/api/users/${userId}`)
      .then(res => setUserName(res.data.name))
      .catch(err => console.error("Failed to fetch user info:", err));
  }, []);

  const moduleCards = [
    { title: "Trainings & Development", path: "/training-development", description: "Capacity building content and professional development", icon: BookOpen, color: "bg-green-500", count: `${stats.trainings} Trainings Available` },
    { title: "Nespak Representation", path: "/nespak-representation", description: "Branding, company events and presentations", icon: Presentation, color: "bg-blue-500", count: `${stats.events} Events Upcoming` },
    { title: "Nespak Preferences",  path: "/nespak-preferences", description: "Internal policy guides and standards", icon: FileText, color: "bg-purple-500", count: `${stats.documents} Documents` },
    { title: "Project-Related Documents", path: "/project-documents", description: "Technical drawings and presentations", icon: FolderOpen, color: "bg-orange-500", count: `${stats.files} Files` }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 p-4 bg-red-50 square-lg">
        <h2 className="text-xl font-semibold text-red-700">NESPAK Digital Learning Platform</h2>
        <p className="text-gray-700 mt-1">
          Your gateway to professional development, training, and company resources.
        </p>
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {userName}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.modulesAccessed}</p>
                  <p className="text-sm text-gray-600">Modules accessed this week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.newUploads}</p>
                  <p className="text-sm text-gray-600">New uploads this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completedModules}</p>
                  <p className="text-sm text-gray-600">Completed Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {moduleCards.map((module, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`${module.color} p-3 rounded-lg text-white`}>
                    <module.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription className="mt-1">{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-4">{module.count}</Badge>
                <Button className="w-full" onClick={() => navigate(module.path)}>
  View Content
</Button>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
