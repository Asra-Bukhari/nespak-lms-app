import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Play, Clock, User, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "@/assets/nespak-logo.jpg";

const ContentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Mock content data - in real app this would come from API
  const content = {
    id: parseInt(id || "1"),
    title: "Advanced Project Management",
    description: "Master the fundamentals of project management with industry best practices and real-world case studies. This comprehensive course covers all aspects of modern project management including planning, execution, monitoring, and closure.",
    speaker: "Dr. Ahmed Hassan",
    duration: "4 weeks",
    uploadDate: "2024-01-15",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    slides: [
      { name: "Introduction to Project Management", url: "/slides/intro.pdf" },
      { name: "Project Planning Techniques", url: "/slides/planning.pdf" },
      { name: "Risk Management", url: "/slides/risk.pdf" },
      { name: "Team Leadership", url: "/slides/leadership.pdf" }
    ],
    relatedMaterials: [
      { name: "Project Charter Template", url: "/materials/charter.docx" },
      { name: "Risk Assessment Matrix", url: "/materials/risk-matrix.xlsx" },
      { name: "Communication Plan Template", url: "/materials/communication.docx" }
    ],
    category: "Training & Development"
  };

  const handleDownload = (url: string, filename: string) => {
    // TODO: Implement actual download functionality
    console.log(`Downloading ${filename} from ${url}`);
  };

  const handleBack = () => {
    // Navigate back to appropriate module page based on content category
    switch (content.category) {
      case "Training & Development":
        navigate('/training-development');
        break;
      case "NESPAK Representation":
        navigate('/nespak-representation');
        break;
      case "NESPAK Preferences":
        navigate('/nespak-preferences');
        break;
      case "Project Documents":
        navigate('/project-documents');
        break;
      default:
        navigate('/dashboard');
    }
  };

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
            {/* Video and Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-black rounded-t-lg relative overflow-hidden">
                    {isVideoPlaying ? (
                      <iframe
                        src={content.videoUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div 
                        className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center cursor-pointer"
                        onClick={() => setIsVideoPlaying(true)}
                      >
                        <div className="text-center">
                          <Play className="w-20 h-20 text-white mb-4 mx-auto opacity-80" />
                          <p className="text-white text-lg">Click to play video</p>
                        </div>
                      </div>
                    )}
                  </div>
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
                          <span className="text-sm text-gray-600">{content.speaker}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{content.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(content.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">{content.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {content.description}
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Speaker Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Speaker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {content.speaker.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{content.speaker}</h3>
                      <p className="text-gray-600">Senior Project Management Consultant</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Over 15 years of experience in engineering project management
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Downloads and Materials */}
            <div className="space-y-6">
              {/* Slides Download */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Presentation Slides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.slides.map((slide, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">{slide.name}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(slide.url, slide.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Related Materials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.relatedMaterials.map((material, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">{material.name}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(material.url, material.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
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
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <Button className="w-full">Mark as Complete</Button>
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