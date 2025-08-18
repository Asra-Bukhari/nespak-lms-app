import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Upload, UserPlus, FileText, Eye, Mail, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";  // ✅ Import toast hook

interface DemoRequest {
  request_id: number;
  first_name: string;
  last_name: string;
  email: string;
  category: string;
  status: string;
  requested_at: string;
}

const sectionMap: Record<string, number> = {
  "training-development": 1,
  "nespak-representation": 2,
  "nespak-preferences": 3,
  "project-documents": 4,
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();  // ✅ Use toast

  const [stats, setStats] = useState({
    totalContent: 0,
    activeUsers: 0,
    pendingRequests: 0,
    thisMonthUploads: 0,
  });

  const [uploadForm, setUploadForm] = useState({
    title: "",
    section: "",
    description: "",
    speaker: "",
    videoUrl: "",
    slidesUrl: "",
    tags: "",
  });

  const [adminEmail, setAdminEmail] = useState("");
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/adminOnly-stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/requests`);
      setDemoRequests(res.data);
    } catch (err) {
      console.error("Error fetching demo requests:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRequests();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: uploadForm.title,
        section_id: sectionMap[uploadForm.section],
        description: uploadForm.description,
        speaker_name: uploadForm.speaker,
        video_url: uploadForm.videoUrl,
        slide_url: uploadForm.slidesUrl,
        level: "beginner",
        tags: uploadForm.tags?.split(",").map((t) => t.trim()) || [],
        uploaded_by: Number(localStorage.getItem("user_id")),
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/content`, payload);

      setUploadForm({
        title: "",
        section: "",
        description: "",
        speaker: "",
        videoUrl: "",
        slidesUrl: "",
        tags: "",
      });

      toast({ title: "✅ Content uploaded successfully!", variant: "default" });
      fetchStats();
    } catch (err) {
      console.error("Upload error:", err);
      toast({ title: "❌ Error uploading content.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAppointAdmin = async () => {
    if (!adminEmail) return;
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/users/appoint-admin`, {
        email: adminEmail,
      });
      toast({ title: `✅ ${adminEmail} appointed as admin!`, variant: "default" });
      setAdminEmail("");
    } catch (err) {
      console.error("Error appointing admin:", err);
      toast({ title: "❌ Failed to appoint admin.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoRequestAction = async (id: number, action: "approve" | "reject") => {
    const newStatus = action === "approve" ? "granted" : "rejected";
    try {
      await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/requests/${id}`, {
        status: newStatus,
      });
      setDemoRequests((prev) => prev.filter((r) => r.request_id !== id));
      fetchStats();
      toast({ title: `Request ${action === "approve" ? "approved" : "rejected"} successfully`, variant: "default" });
    } catch (err: any) {
      console.error("Error updating request status:", err.response?.data || err);
      toast({ title: "❌ Failed to update request status.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Admin Panel">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-500 p-3 rounded-lg text-white">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-gray-600">Manage content, users, and demo requests</p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Demo Requests */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Eye className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">View Demo Requests</CardTitle>
                        <CardDescription>Review and manage demo requests</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{demoRequests.filter((r) => r.status === "pending").length} Pending</Badge>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Demo Requests</DialogTitle>
                  <DialogDescription>Review and manage all demo requests</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {demoRequests.map((request) => (
                    <div key={request.request_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{request.first_name[0]}{request.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{request.first_name} {request.last_name}</h4>
                          <p className="text-sm text-gray-600">{request.email}</p>
                          <p className="text-xs text-gray-500">
                            Requested on {new Date(request.requested_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">Category: {request.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={request.status === "pending" ? "default" : "secondary"}>{request.status}</Badge>
                        {request.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => handleDemoRequestAction(request.request_id, "approve")}>Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDemoRequestAction(request.request_id, "reject")}>Reject</Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Appoint Admin */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <UserPlus className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Appoint Admin</CardTitle>
                        <CardDescription>Grant admin access to users</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Appoint New Admin</DialogTitle>
                  <DialogDescription>Search for a user by email and grant them admin privileges</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Enter user email..."
                        className="pl-10"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleAppointAdmin} disabled={!adminEmail || loading}>
                    {loading ? "Appointing..." : "Appoint as Admin"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Upload Content */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Upload className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Upload Content</CardTitle>
                        <CardDescription>Add new training content</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload New Content</DialogTitle>
                  <DialogDescription>Add new training content to the platform</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Content title..."
                        value={uploadForm.title}
                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Section</label>
                      <Select value={uploadForm.section} onValueChange={(value) => setUploadForm({ ...uploadForm, section: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="training-development">Training & Development</SelectItem>
                          <SelectItem value="nespak-representation">NESPAK Representation</SelectItem>
                          <SelectItem value="nespak-preferences">NESPAK Preferences</SelectItem>
                          <SelectItem value="project-documents">Project Documents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Content description..."
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Speaker Name</label>
                    <Input
                      placeholder="Speaker/instructor name..."
                      value={uploadForm.speaker}
                      onChange={(e) => setUploadForm({ ...uploadForm, speaker: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Video URL</label>
                    <Input
                      placeholder="YouTube video URL..."
                      value={uploadForm.videoUrl}
                      onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slides URL</label>
                    <Input
                      placeholder="Slides/presentation URL..."
                      value={uploadForm.slidesUrl}
                      onChange={(e) => setUploadForm({ ...uploadForm, slidesUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                      placeholder="e.g. Python, Beginner"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Content"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        
       {/* Stats Overview */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-2xl font-bold">{stats.totalContent}</p>
          <p className="text-sm text-gray-600">Total Content</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-lg">
          <UserPlus className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-2xl font-bold">{stats.activeUsers}</p>
          <p className="text-sm text-gray-600">Active Users</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="bg-yellow-100 p-3 rounded-lg">
          <Eye className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <p className="text-2xl font-bold">{stats.pendingRequests}</p>
          <p className="text-sm text-gray-600">Pending Requests</p>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="bg-purple-100 p-3 rounded-lg">
          <Calendar className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <p className="text-2xl font-bold">{stats.thisMonthUploads}</p>
          <p className="text-sm text-gray-600">Uploads This Month</p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;


