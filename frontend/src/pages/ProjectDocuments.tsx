import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const programs = [
  {
    id: 10,
    title: "AutoCAD Fundamentals",
    description: "Master the basics of AutoCAD for engineering drawings and technical documentation.",
    speaker: "Eng. Ahmad Khan",
    image: "/placeholder-autocad.jpg",
    duration: "6 hours",
    project: "Highway Design"
  },
  {
    id: 11,
    title: "Technical Drawing Standards",
    description: "Learn industry standards for technical drawings and documentation practices.",
    speaker: "Dr. Sana Mirza",
    image: "/placeholder-drawing.jpg",
    duration: "4 hours",
    project: "Building Design"
  },
  {
    id: 12,
    title: "Project Documentation Best Practices",
    description: "Comprehensive guide to maintaining and organizing project documentation.",
    speaker: "Project Manager",
    image: "/placeholder-documentation.jpg",
    duration: "3 hours",
    project: "Infrastructure"
  }
];

const ProjectDocuments = () => {
  const [filteredPrograms, setFilteredPrograms] = useState(programs);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    const filtered = programs.filter(program =>
      program.title.toLowerCase().includes(query.toLowerCase()) ||
      program.description.toLowerCase().includes(query.toLowerCase()) ||
      program.speaker.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPrograms(filtered);
  };

  const handleProgramClick = (programId: number) => {
    navigate(`/content/${programId}`);
  };

  return (
    <DashboardLayout 
      title="Project-Related Documents" 
      searchPlaceholder="Search project documents..."
      onSearch={handleSearch}
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-500 p-3 rounded-lg text-white">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Project-Related Documents</h2>
              <p className="text-gray-600">Technical drawings, presentations, and project documentation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{filteredPrograms.length} resources available</span>
            <Badge variant="secondary">Technical Resources</Badge>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card 
              key={program.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProgramClick(program.id)}
            >
              <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-80" />
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{program.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">
                      {program.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {program.speaker.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{program.speaker}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{program.duration}</Badge>
                    <Badge variant="secondary">{program.project}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No documents found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDocuments;