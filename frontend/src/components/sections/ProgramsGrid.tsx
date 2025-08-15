import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast"; // shadcn toast

export type Program = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const programs: Program[] = [
  {
    id: "p1",
    title: "Training & Development",
    description:
      "This course focuses on digital skills development for women, preparing them for the demands of the labour market and thus opening new job opportunities.",
    image: "/uploads/cat1.png",
  },
  {
    id: "p2",
    title: "Employees Capacity Building",
    description:
      "In this course, you'll learn how to recognize and fight online gender-based violence (OGBV). It has been designed for those affected by online gender-based violence and those who want to learn how to become an ally and safely intervene.",
    image: "/uploads/cat2.png",
  },
  {
    id: "p3",
    title: "NESPAK Projects",
    description:
      "This short course explores the concept of digital accessibility and engages with the question why it is important to create accessible digital products and services.",
    image: "/uploads/cat3.png",
  },
];

const ProgramsGrid = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Program | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const onOpen = (p: Program) => {
    setSelected(p);
    setOpen(true);
  };

  const handleRequestInfo = async () => {
    if (!firstName || !lastName || !email) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/api/requests`, {
        first_name: firstName,
        last_name: lastName,
        email,
        category: selected?.title || "",
      });

      toast({
        title: "Request Submitted",
        description: "Your request was sent successfully!",
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setOpen(false);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="training-categories" className="py-16">
      <div className="bg-gradient-brand w-full py-8 mb-8">
        <div className="container mx-auto">
          <h2 className="font-brand text-3xl md:text-4xl text-white">
            Training Categories
          </h2>
          <p className="text-white/90 mt-2">
            Stay ahead with industry-relevant learning tracks.
          </p>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <button key={p.id} onClick={() => onOpen(p)} className="text-left">
              <Card className="hover:shadow-brand transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={p.image}
                    alt={`${p.title} program`}
                    className="rounded-md aspect-[16/9] object-cover w-full"
                    loading="lazy"
                  />
                  <p className="text-sm text-muted-foreground mt-3 overflow-hidden max-h-20">
                    {p.description}
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img
                src={selected?.image}
                alt={selected?.title || "Program image"}
                className="rounded-md aspect-[16/10] object-cover w-full"
              />
              <DialogHeader>
                <DialogTitle className="font-brand text-2xl mt-4">
                  {selected?.title}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground mt-2">
                {selected?.description}
              </p>
            </div>
            <div>
              <DialogHeader>
                <DialogTitle>Want to know more?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your information to learn more about this program at NESPAK.
              </p>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRequestInfo();
                }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="First Name"
                    aria-label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    placeholder="Last Name"
                    aria-label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="hero" className="w-full">
                  Request More Info
                </Button>
                <div className="text-center mt-4">
                  <div className="flex items-center justify-center text-sm text-muted-foreground mb-2">
                    <div className="flex-1 h-px bg-border"></div>
                    <span className="px-4">or</span>
                    <div className="flex-1 h-px bg-border"></div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/signup")}
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProgramsGrid;
