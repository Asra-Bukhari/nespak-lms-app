import logo from "@/assets/nespak-logo.jpg";
import { Facebook, Linkedin, Globe } from "lucide-react";

const ContactFooter = () => {
  return (
    <footer className="mt-16 bg-primary text-primary-foreground">
      <div className="container mx-auto py-12">
        <div className="grid gap-8 md:grid-cols-3 items-start">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="NESPAK logo" className="h-12 w-auto" />
          </div>

          {/* Contact info */}
          <div>
            <div className="font-medium">Contact</div>
            <p className="opacity-90 mt-2 text-sm">
              Nespak House, 1-C, Block-N Model Town Extension, Lahore, Pakistan 54700
            </p>
            <p className="opacity-90 text-sm">Phone: (042) 99090000</p>
            <p className="opacity-90 text-sm">Email: info@nespak.com.pk</p>
          </div>

          {/* Follow section */}
          <div>
            <div className="font-medium">Follow</div>
            <div className="flex gap-3 mt-3">
              <a
                href="https://www.facebook.com/share/1ELqQSAsVT/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/nespak--disaster-management-&-reconstruction-division-islamabad/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.nespak.com.pk/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-8 text-xs opacity-80">
          © {new Date().getFullYear()} NESPAK Digital Learning Platform
        </div>
      </div>
    </footer>
  );
};

export default ContactFooter;
