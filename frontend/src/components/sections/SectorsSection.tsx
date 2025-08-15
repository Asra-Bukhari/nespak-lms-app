const sectors = [
  "ARCHITECTURE & PLANNING",
  "AGRICULTURE", 
  "BUILDING SERVICES",
  "COMMUNICATION",
  "DISASTER MANAGEMENT AND RECONSTRUCTION",
  "ENERGY",
  "ENVIRONMENT",
  "GEOGRAPHICAL INFORMATION SYSTEM",
  "INDUSTRIAL",
  "INFORMATION TECHNOLOGY",
  "OIL, GAS & PETROCHEMICAL",
  "PUBLIC HEALTH ENGINEERING",
  "WATER RESOURCES DEVELOPMENT AND DAM ENGINEERING"
];

const SectorsSection = () => {
  return (
    <section 
      className="py-16 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1600&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto">
        <header className="mb-12 text-center">
          <h2 className="font-brand text-3xl md:text-4xl text-white mb-2">NESPAK SECTORS</h2>
        </header>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {sectors.map((sector) => (
            <div
              key={sector}
              className="bg-white px-6 py-3 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {sector}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectorsSection;
