import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Presentation,
  FileText,
  FolderOpen,
  Play,
  Calendar,
  TrendingUp,
  MessageSquare,
  Star
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  const [feedback, setFeedback] = useState("");
  const [topic, setTopic] = useState("");
  const [rating, setRating] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const userId = sessionStorage.getItem("user_id");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios
      .get(`${API_BASE_URL}/api/dashboard/stats?userId=${userId}`, config)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch dashboard stats:", err));

    axios
      .get(`${API_BASE_URL}/api/users/${userId}`, config)
      .then((res) => setUserName(res.data.name))
      .catch((err) => console.error("Failed to fetch user info:", err));
  }, []);

  const handleFeedbackSubmit = async () => {
    const userId = sessionStorage.getItem("user_id");
    if (!userId || !feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/feedback`, {
        user_id: userId,
        message: feedback,
        topic,
        rating
      });
      setFeedback("");
      setTopic("");
      setRating(0);
      setSuccessMsg("✅ Thank you! Your feedback has been submitted.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleStarClick = (starValue: number) => {
    if (rating === starValue) {
      setRating(starValue - 1); 
    } else {
      setRating(starValue);
    }
  };

  const moduleCards = [
    {
      title: "Trainings & Development",
      path: "/training-development",
      description: "Capacity building content and professional development",
      icon: BookOpen,
      color: "bg-green-500",
      count: `${stats.trainings} Trainings Available`
    },
    {
      title: "Nespak Representation",
      path: "/nespak-representation",
      description: "Branding, company events and presentations",
      icon: Presentation,
      color: "bg-blue-500",
      count: `${stats.events} Events Upcoming`
    },
    {
      title: "Nespak Preferences",
      path: "/nespak-preferences",
      description: "Internal policy guides and standards",
      icon: FileText,
      color: "bg-purple-500",
      count: `${stats.documents} Documents`
    },
    {
      title: "Project-Related Documents",
      path: "/project-documents",
      description: "Technical drawings and presentations",
      icon: FolderOpen,
      color: "bg-orange-500",
      count: `${stats.files} Files`
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 p-4 bg-red-50 square-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-red-700">
            NESPAK Digital Learning Platform
          </h2>
          <p className="text-gray-700 mt-1">
            Your gateway to professional development, training, and company resources.
          </p>
        </div>

        {/* Feedback Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Give Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Feedback</DialogTitle>
              <DialogDescription>
                We value your input. Please share your thoughts about the platform.
              </DialogDescription>
            </DialogHeader>

            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic (e.g., Dashboard design, Training content)"
              className="mt-3"
            />


            <div className="flex items-center gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>

            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              className="min-h-[120px] mt-3"
            />

            {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}

            <DialogFooter>
              <Button
                onClick={handleFeedbackSubmit}
                disabled={isSubmitting || !feedback.trim()}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {userName}
        </h1>

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
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
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
                <Badge variant="secondary" className="mb-4">
                  {module.count}
                </Badge>
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
