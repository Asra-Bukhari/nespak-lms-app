import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Program {
  content_id: number;
  title: string;
  short_description: string;
  speaker_name: string;
  thumbnail: string | null;
  level: string;
  uploaded_at: string;
  tags: string[];
}

const TrainingDevelopment = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const navigate = useNavigate();

  // Fetch content for sectionId=1 (Trainings & Development)
useEffect(() => {
  const fetchPrograms = async () => {
    try {
     
      const res = await axios.get(`${API_BASE_URL}/api/content/section/1`);
      console.log("API raw response:", res.data);

      const data: Program[] = Array.isArray(res.data.content) ? res.data.content : [];
      console.log("Parsed programs:", data);

      setPrograms(data);
      setFilteredPrograms(data);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setPrograms([]);
      setFilteredPrograms([]);
    }
  };
  fetchPrograms();
}, []);




  const handleSearch = (query: string) => {
    const filtered = programs.filter(program =>
      program.title.toLowerCase().includes(query.toLowerCase()) ||
      program.short_description.toLowerCase().includes(query.toLowerCase()) ||
      program.speaker_name.toLowerCase().includes(query.toLowerCase())
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
              key={program.content_id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProgramClick(program.content_id)}
            >
              <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                {program.thumbnail ? (
                  <img 
                    src={program.thumbnail} 
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Play className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-80" />
                </div>
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{program.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-3">
                      {program.short_description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {program.speaker_name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{program.speaker_name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {program.tags?.length > 0 && (
                      <Badge variant="outline">{program.tags[0]}</Badge>
                    )}
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
