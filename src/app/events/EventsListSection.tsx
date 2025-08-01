import Image from "next/image";
import Link from "next/link";

const events = Array(5).fill({
  date: "JUNE 15, 2025",
  location: "OWERRI TECH INNOVATION HUB",
  title: "IMO DIGITAL YOUTH SUMMIT 2025",
  description: "Empowering the next generation of digital leaders with workshops, speakers, and networking.",
  img: "/images/aboutUs1.png",
});

export default function EventsListSection() {
  return (
    <section className="w-full max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-2xl md:text-2xl font-medium mb-8">Upcoming Events</h2>
      <div className="flex flex-col gap-8">
        {events.map((event, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-6 items-center border-b border-b-[#C8C8C8] pb-8 last:border-b-0">
            <div className="w-full md:w-64 h-40 relative rounded overflow-hidden flex-shrink-0">
              <Image src={event.img} alt={event.title} fill className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-10 text-gray-500 text-xs mb-1">
                  <span>{event.date}</span>
                  <span>{event.location}</span>
                </div>
                <h3 className="text-xl font-medium mb-1">{event.title}</h3>
                <p className="text-dark-primary-body text-sm mb-2">{event.description}</p>
              </div>
              <div className="flex justify-end md:justify-center">
                <Link href={'/events/323'} className="border border-primary-green text-primary-green text-[14px] px-4 py-2 rounded font-semibold hover:bg-green-50 transition">More Information</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 