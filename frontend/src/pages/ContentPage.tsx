import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Clock,
  User,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import YouTube, { YouTubeEvent } from "react-youtube";
import logo from "@/assets/nespak-logo.jpg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ContentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

const { toast } = useToast()

  // Admin update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    speaker_name: "",
    video_url: "",
    slide_url: "",
    section_id: "",
    tags: "",
  });

  // Load role from sessionStorage
const [role, setRole] = useState<string | null>(null);


useEffect(() => {
  const userId = sessionStorage.getItem("user_id");
  if (!userId) return;

  axios
    .get(`${API_BASE_URL}/api/users/${userId}`)
    .then((res) => {
      setRole(res.data.role?.toLowerCase()); // normalize role
    })
    .catch((err) => console.error("Failed to fetch user role:", err));
}, []);

  // Utility: Extract YouTube Video ID
  const extractYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
    );
    return match ? match[1] : "";
  };

  // Fetch content & user progress
  useEffect(() => {
    if (!id) return;
    const user_id = sessionStorage.getItem("user_id");

    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/content/${id}`);
        setContent(res.data);

        // Prefill form if admin
        setForm({
          title: res.data.title,
          description: res.data.description,
          speaker_name: res.data.speaker_name,
          video_url: res.data.video_url,
          slide_url: res.data.slide_url,
          section_id: res.data.section_id || "",
          tags: res.data.tags?.join(", ") || "",
        });

        const viewRes = await axios.post(
          "http://localhost:5000/api/views/get-or-create",
          {
            user_id,
            content_id: id,
          }
        );

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
    if (isCompleted) return;

    if (event.data === 1) {
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  // Save progress when back is clicked
  const handleBack = async () => {
    const user_id = sessionStorage.getItem("user_id");
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
    const user_id = sessionStorage.getItem("user_id");
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

// Triggered when user clicks Delete button (opens dialog)
const confirmDelete = () => {
  setShowDeleteModal(true);
};

// State for delete modal
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

// Actual delete API call
const handleDelete = async () => {
  try {
    await axios.delete(`${API_BASE_URL}/api/content/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    });

    setDeleteMessage("✅ Content deleted successfully!");

    // Auto-close after 1.5s and go back
    setTimeout(() => {
      setShowDeleteModal(false);
      navigate("/dashboard");
    }, 1500);
  } catch (err) {
    console.error("Error deleting content:", err);
    setDeleteMessage("❌ Failed to delete content. Try again.");
  }
};



  // Update Content
  const handleUpdate = async () => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/content/${id}`,
        {
          ...form,
          tags: form.tags.split(",").map((t: string) => t.trim()),
        },
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }
      );
      alert("Content updated!");
      setShowUpdateModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Error updating content:", err);
      alert("Error updating content");
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
                      <CardTitle className="text-2xl mb-2">
                        {content.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {content.speaker_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {content.level || "N/A"}
                          </span>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(content.slide_url, "_blank")
                        }
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No slides available
                    </p>
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
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${progress.toFixed(0)}%` }}
                        ></div>
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
                        {content.speaker_name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {content.speaker_name}
                      </h3>
                      <p className="text-gray-600">Speaker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Actions */}
              {role === "admin" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Admin Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => setShowUpdateModal(true)}
                    >
                      Update Content
                    </Button>
                   <Button
  className="w-full"
  variant="destructive"
  onClick={confirmDelete} 
>
  Delete Content
</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

{showUpdateModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col">
      
      {/* Scrollable content */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-semibold border-b pb-2">
          Update Content
        </h2>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter content title"
            className="border-gray-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-primary resize-none"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Enter content description"
            rows={4}
          />
        </div>

        {/* Speaker Name */}
        <div className="space-y-2">
          <Label htmlFor="speaker_name">Speaker Name</Label>
          <Input
            id="speaker_name"
            value={form.speaker_name}
            onChange={(e) =>
              setForm({ ...form, speaker_name: e.target.value })
            }
            placeholder="Enter speaker name"
            className="border-gray-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Video URL */}
        <div className="space-y-2">
          <Label htmlFor="video_url">Video URL</Label>
          <Input
            id="video_url"
            value={form.video_url}
            onChange={(e) =>
              setForm({ ...form, video_url: e.target.value })
            }
            placeholder="https://youtube.com/..."
            className="border-gray-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Slide URL */}
        <div className="space-y-2">
          <Label htmlFor="slide_url">Slide URL</Label>
          <Input
            id="slide_url"
            value={form.slide_url}
            onChange={(e) =>
              setForm({ ...form, slide_url: e.target.value })
            }
            placeholder="https://example.com/slides.pdf"
            className="border-gray-300 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="training, project, design"
            className="border-gray-300 focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Footer Buttons pinned */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50">
        <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            try {
              await axios.patch(
                `${API_BASE_URL}/api/content/${id}`,
                {
                  ...form,
                  tags: form.tags
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter(Boolean),
                },
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                  },
                }
              );

              toast({
                title: "✅ Content updated",
                description: "Your changes have been saved successfully.",
              });

              setShowUpdateModal(false);
              window.location.reload();
            } catch (err) {
              console.error("Error updating content:", err);
              toast({
                title: "❌ Update failed",
                description: "There was a problem updating this content.",
                variant: "destructive",
              });
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  </div>
)}


      {/* Delete Confirmation Modal */}
{showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
      {!deleteMessage ? (
        <>
          <h2 className="text-xl font-semibold text-red-600">Confirm Delete</h2>
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-medium">{content.title}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Delete
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <h2 className="text-lg font-semibold">{deleteMessage}</h2>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      )}
    </div>
  </div>
)}


    </div>
  );
};

export default ContentPage;
