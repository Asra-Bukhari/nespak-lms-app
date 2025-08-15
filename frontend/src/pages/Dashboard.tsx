import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Presentation, 
  FileText, 
  FolderOpen,
  Play,
  Calendar,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Dashboard = () => {
  const navigate = useNavigate();

  const moduleCards = [
    {
      title: "Trainings & Development",
      description: "Capacity building content and professional development",
      icon: BookOpen,
      color: "bg-green-500",
      count: "12 Trainings Available",
      theme: "green"
    },
    {
      title: "Nespak Representation",
      description: "Branding, company events and presentations",
      icon: Presentation,
      color: "bg-blue-500",
      count: "8 Events Upcoming",
      theme: "blue"
    },
    {
      title: "Nespak Preferences",
      description: "Internal policy guides and standards",
      icon: FileText,
      color: "bg-purple-500",
      count: "25 Documents",
      theme: "purple"
    },
    {
      title: "Project-Related Documents",
      description: "Technical drawings and presentations",
      icon: FolderOpen,
      color: "bg-orange-500",
      count: "156 Files",
      theme: "orange"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, John Doe 👋
          </h1>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
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
                    <p className="text-2xl font-bold">15</p>
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
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-gray-600">Pending trainings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moduleCards.map((module, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`${module.color} p-3 rounded-lg text-white`}>
                    <module.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="mb-4">
                    {module.count}
                  </Badge>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    switch(module.title) {
                      case "Trainings & Development":
                        navigate('/training-development');
                        break;
                      case "Nespak Representation":
                        navigate('/nespak-representation');
                        break;
                      case "Nespak Preferences":
                        navigate('/nespak-preferences');
                        break;
                      case "Project-Related Documents":
                        navigate('/project-documents');
                        break;
                    }
                  }}
                >
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