import { Button } from "@/components/ui/button";
import { GraduationCap, Laptop, MessageCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-brand text-primary-foreground">
      <div className="container mx-auto py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <h1 className="font-brand text-4xl md:text-6xl leading-tight mb-4 text-balance">
              NESPAK Digital Learning Platform
            </h1>
            <p className="text-lg md:text-xl/8 opacity-95 mb-8">
              Advance your career with industry-grade programs designed with NESPAK's excellence and engineering heritage.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => {
                  const element = document.getElementById('training-categories');
                  element?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }} 
                className="bg-white text-black hover:bg-gray-200 transition-colors font-medium"
              >
                Explore Categories
              </Button>
            </div>
          </div>
          
          <div className="relative flex justify-center items-center">
  <div className="relative flex items-end gap-4"> 
    {/* Left icon - Laptop */}
    <div className="mt-2 animate-[fade-in_1s_ease-out_0.2s_both,_drop-in_0.8s_ease-out_0.2s_both] transform -rotate-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
        <Laptop className="w-7 h-7 text-white" /> {/* slightly smaller */}
      </div>
    </div>

    {/* Center icon - Graduation Cap */}
    <div className="animate-[fade-in_1s_ease-out_0.4s_both,_drop-in_0.8s_ease-out_0.4s_both]">
      <div className="bg-white/15 backdrop-blur-sm rounded-full p-6 border border-white/30 shadow-lg">
        <GraduationCap className="w-14 h-14 text-white" /> {/* larger */}
      </div>
    </div>

    {/* Right icon - Message Circle */}
    <div className="mt-2 animate-[fade-in_1s_ease-out_0.6s_both,_drop-in_0.8s_ease-out_0.6s_both] transform rotate-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
        <MessageCircle className="w-7 h-7 text-white" /> {/* slightly smaller */}
      </div>
    </div>
  </div>
</div>


        </div>
      </div>
    </section>
  );
};

export default Hero;