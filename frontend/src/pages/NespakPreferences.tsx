import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const programs = [
  {
    id: 7,
    title: "NESPAK Quality Standards",
    description: "Comprehensive guide to NESPAK's quality standards and implementation procedures.",
    speaker: "Eng. Usman Malik",
    image: "/placeholder-standards.jpg",
    duration: "1 hour",
    category: "Standards"
  },
  {
    id: 8,
    title: "Internal Policy Guidelines",
    description: "Understanding NESPAK's internal policies, procedures, and compliance requirements.",
    speaker: "HR Team",
    image: "/placeholder-policy.jpg",
    duration: "45 mins",
    category: "Policy"
  },
  {
    id: 9,
    title: "Safety Protocols & Procedures",
    description: "Essential safety guidelines and protocols for all NESPAK projects and operations.",
    speaker: "Safety Officer",
    image: "/placeholder-safety.jpg",
    duration: "2 hours",
    category: "Safety"
  }
];

const NespakPreferences = () => {
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
      title="NESPAK Preferences" 
      searchPlaceholder="Search policies and standards..."
      onSearch={handleSearch}
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 p-3 rounded-lg text-white">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">NESPAK Preferences</h2>
              <p className="text-gray-600">Internal policies, standards, and guidelines</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{filteredPrograms.length} documents available</span>
            <Badge variant="secondary">Policies & Standards</Badge>
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
                    <Badge variant="secondary">{program.category}</Badge>
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

export default NespakPreferences;