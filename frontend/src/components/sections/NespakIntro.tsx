import logo from "@/assets/nespak-logo.jpg";

const NespakIntro = () => {
  return (
    <section className="container mx-auto py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <img 
            src="/uploads/nespakBuilding.png" 
            alt="NESPAK building exterior" 
            className="max-w-lg w-full h-auto rounded-lg shadow-lg"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="font-brand text-3xl md:text-4xl mb-6">
            NESPAK (Pvt.) Limited is Pakistan's premier consultancy organization
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            NESPAK was established in 1973 as a private limited company by the Government of Pakistan. 
            The objective of its creation was to create a pool of talented engineers, attain self-reliance 
            in engineering consultancy and replace foreign consultants. Currently NESPAK has total strength 
            of over 2300 employees. The total estimated turnover for the year 2023-2024 was Rs. 12.34 billion 
            whereas the total cumulative cost of the projects undertaken by NESPAK is US $ 351 billion.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NespakIntro;