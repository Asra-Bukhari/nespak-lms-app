import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Upload, 
  UserPlus, 
  FileText,
  Eye,
  Mail,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Upload Content Form State
  const [uploadForm, setUploadForm] = useState({
    title: "",
    section: "",
    description: "",
    speaker: "",
    videoUrl: "",
    slidesUrl: ""
  });

  // Appoint Admin State
  const [adminEmail, setAdminEmail] = useState("");
  
  // Mock data
  const demoRequests = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      requestDate: "2024-01-15",
      status: "Pending"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@engineering.com",
      requestDate: "2024-01-14",
      status: "Pending"
    },
    {
      id: 3,
      name: "Ahmad Ali",
      email: "ahmad.ali@consultant.com",
      requestDate: "2024-01-13",
      status: "Approved"
    }
  ];


  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call upload content API here
    console.log("Uploading content:", uploadForm);
    // Reset form
    setUploadForm({
      title: "",
      section: "",
      description: "",
      speaker: "",
      videoUrl: "",
      slidesUrl: ""
    });
  };

  const handleAppointAdmin = () => {
    // TODO: Call appoint admin API here
    console.log("Appointing admin:", adminEmail);
    setAdminEmail("");
  };

  const handleDemoRequestAction = (id: number, action: string) => {
    // TODO: Call demo request action API here
    console.log(`${action} demo request ${id}`);
  };

  return (
    <DashboardLayout title="Admin Panel">
      <div className="p-6">
          {/* Header Section */}
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

            {/* Admin Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* View Demo Requests */}
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
                      <Badge variant="secondary">{demoRequests.filter(r => r.status === "Pending").length} Pending</Badge>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Demo Requests</DialogTitle>
                    <DialogDescription>
                      Review and manage all demo requests
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {demoRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {request.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{request.name}</h4>
                            <p className="text-sm text-gray-600">{request.email}</p>
                            <p className="text-xs text-gray-500">
                              Requested on {new Date(request.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={request.status === "Pending" ? "default" : "secondary"}>
                            {request.status}
                          </Badge>
                          {request.status === "Pending" && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleDemoRequestAction(request.id, "approve")}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDemoRequestAction(request.id, "reject")}
                              >
                                Reject
                              </Button>
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
                    <DialogDescription>
                      Search for a user by email and grant them admin privileges
                    </DialogDescription>
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
                    <Button 
                      className="w-full"
                      onClick={handleAppointAdmin}
                      disabled={!adminEmail}
                    >
                      Appoint as Admin
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
                    <DialogDescription>
                      Add new training content to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          placeholder="Content title..."
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Section</label>
                        <Select value={uploadForm.section} onValueChange={(value) => setUploadForm({...uploadForm, section: value})}>
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
                        onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Speaker Name</label>
                      <Input
                        placeholder="Speaker/instructor name..."
                        value={uploadForm.speaker}
                        onChange={(e) => setUploadForm({...uploadForm, speaker: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Video URL</label>
                      <Input
                        placeholder="YouTube video URL..."
                        value={uploadForm.videoUrl}
                        onChange={(e) => setUploadForm({...uploadForm, videoUrl: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Slides URL</label>
                      <Input
                        placeholder="Slides/presentation URL..."
                        value={uploadForm.slidesUrl}
                        onChange={(e) => setUploadForm({...uploadForm, slidesUrl: e.target.value})}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Upload Content
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
                    <p className="text-2xl font-bold">156</p>
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
                    <p className="text-2xl font-bold">1,234</p>
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
                    <p className="text-2xl font-bold">{demoRequests.filter(r => r.status === "Pending").length}</p>
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
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-sm text-gray-600">This Month Uploads</p>
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