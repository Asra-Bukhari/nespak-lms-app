const clientLogos = [
  "/uploads/client1.png",
  "/uploads/client2.png",
  "/uploads/client3.png",
  "/uploads/client4.png",
  "/uploads/client5.png",
  "/uploads/client6.png",
  "/uploads/client7.png",
  "/uploads/client8.png",
  "/uploads/client9.png",
  "/uploads/client10.png",
  "/uploads/client11.png",
];

const ClientsMarquee = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h2 className="font-brand text-3xl md:text-4xl">Major Clients</h2>
        </header>
        <div className="overflow-hidden">
          <div className="flex gap-12 animate-marquee w-[200%]">
            {[...clientLogos, ...clientLogos].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Client logo ${i + 1}`}
                className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsMarquee;
