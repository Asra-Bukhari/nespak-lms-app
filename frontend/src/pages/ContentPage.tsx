import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Clock, User, Calendar, CheckCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import YouTube, { YouTubeEvent } from "react-youtube";
import logo from "@/assets/nespak-logo.jpg";

const ContentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Utility: Extract YouTube Video ID
  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    return match ? match[1] : "";
  };

  // Fetch content & user progress
  useEffect(() => {
    if (!id) return;
    const user_id = localStorage.getItem("user_id");

    const fetchContent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/content/${id}`);
        setContent(res.data);

        const viewRes = await axios.post("http://localhost:5000/api/views/get-or-create", {
          user_id,
          content_id: id,
        });

        const userProgress = viewRes.data.progress || 0;
        setProgress(userProgress);
        if (userProgress === 100) setIsCompleted(true);
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [id]);

  // Track progress while video plays
  const handleStateChange = (event: YouTubeEvent) => {
    if (isCompleted) return; // lock progress if completed

    if (event.data === 1) {
      // playing → start interval
      intervalRef.current = setInterval(() => {
        if (playerRef.current && !isCompleted) {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          if (total > 0) {
            const percent = (current / total) * 100;
            setProgress(Math.min(100, percent));
          }
        }
      }, 2000);
    } else {
      // paused/ended → clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  // Save progress when back is clicked
  const handleBack = async () => {
    const user_id = localStorage.getItem("user_id");
    if (user_id && content && !isCompleted) {
      try {
        await axios.post("http://localhost:5000/api/views/update-progress", {
          user_id,
          content_id: id,
          progress,
        });
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    }

    switch (content.section_name) {
      case "Training & Development":
        navigate("/training-development");
        break;
      case "NESPAK Representation":
        navigate("/nespak-representation");
        break;
      case "NESPAK Preferences":
        navigate("/nespak-preferences");
        break;
      case "Project Documents":
        navigate("/project-documents");
        break;
      default:
        navigate("/dashboard");
    }
  };

  // Mark course as complete
  const handleMarkComplete = async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;

    try {
      await axios.post("http://localhost:5000/api/views/mark-complete", {
        user_id,
        content_id: id,
      });

      setProgress(100);
      setIsCompleted(true);
    } catch (err) {
      console.error("Error marking complete:", err);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!content) return <div className="p-10 text-center">Content not found</div>;

  const videoId = extractYouTubeId(content.video_url);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b h-16 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src={logo} alt="NESPAK logo" className="h-8 w-auto" />
            <h1 className="text-lg font-semibold">{content.title}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video & Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-0">
                  <YouTube
                    videoId={videoId}
                    opts={{ width: "100%", height: "400" }}
                    onReady={(e) => {
                      playerRef.current = e.target;
                      const duration = e.target.getDuration();
                      const startTime = (progress / 100) * duration;
                      if (startTime > 0) e.target.seekTo(startTime, true);
                    }}
                    onStateChange={handleStateChange}
                  />
                </CardContent>
              </Card>

              {/* Content Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{content.speaker_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{content.level || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(content.uploaded_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">{content.section_name}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {content.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Material */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Related Material
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.slide_url ? (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Course Slide</span>
                      <Button size="sm" variant="outline" onClick={() => window.open(content.slide_url, "_blank")}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No slides available</p>
                  )}
                </CardContent>
              </Card>

              {/* Course Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Course Completion</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${progress.toFixed(0)}%` }}></div>
                      </div>
                    </div>

                    {isCompleted ? (
                      <Button className="w-full" disabled variant="secondary">
                        <CheckCircle className="w-4 h-4 mr-2" /> Completed
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={handleMarkComplete}>
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* About the Speaker */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Speaker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {content.speaker_name?.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{content.speaker_name}</h3>
                      <p className="text-gray-600">Speaker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentPage;
