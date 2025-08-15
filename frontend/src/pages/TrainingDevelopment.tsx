import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

const programs = [
    {
      id: 1,
      title: "Advanced Project Management",
      description: "Master the fundamentals of project management with industry best practices and real-world case studies.",
      speaker: "Dr. Ahmed Hassan",
      image: "/placeholder-training.jpg",
      duration: "4 weeks",
      level: "Intermediate"
    },
    {
      id: 2,
      title: "Engineering Leadership Skills",
      description: "Develop leadership capabilities essential for engineering professionals in today's dynamic environment.",
      speaker: "Eng. Sarah Khan",
      image: "/placeholder-training.jpg",
      duration: "6 weeks", 
      level: "Advanced"
    },
    {
      id: 3,
      title: "Digital Transformation in Engineering",
      description: "Learn how to implement digital solutions and emerging technologies in engineering projects.",
      speaker: "Dr. Muhammad Ali",
      image: "/placeholder-training.jpg",
      duration: "8 weeks",
      level: "Beginner"
    }
  ];

const TrainingDevelopment = () => {
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
      title="Training & Development" 
      searchPlaceholder="Search training programs..."
      onSearch={handleSearch}
    >
      <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 p-3 rounded-lg text-white">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Training & Development Programs</h2>
                <p className="text-gray-600">Enhance your skills with our comprehensive training programs</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{filteredPrograms.length} programs available</span>
              <Badge variant="secondary">Professional Development</Badge>
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
                      <Badge variant="secondary">{program.level}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No programs found matching your search.</p>
            </div>
          )}
        </div>
    </DashboardLayout>
  );
};

export default TrainingDevelopment;