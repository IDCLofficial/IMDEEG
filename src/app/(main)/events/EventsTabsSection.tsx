"use client";
import { useState } from "react";
import Image from "next/image";

const events = [
  {
    name: "Digital Skills Workshop",
    image: "/images/aboutUs1.png",
    description:
      "A hands-on workshop focused on equipping youths with digital skills in coding, cybersecurity, and cloud computing. Participants will engage in practical sessions and group projects.",
  },
  {
    name: "Tech Innovation Summit",
    image: "/images/aboutUs1.png",
    description: "A summit bringing together tech leaders, startups, and government officials to discuss the future of digital innovation in Imo State.",
  },
  {
    name: "E-Government Launch",
    image: "/images/aboutUs1.png",
    description: "Official launch event for the new e-government portal, featuring live demos and Q&A sessions.",
  },
  {
    name: "Cybersecurity Awareness Day",
    image: "/images/aboutUs1.png",
    description: "A day dedicated to raising awareness about cybersecurity best practices for individuals and organizations.",
  },
  {
    name: "Women in Tech Forum",
    image: "/images/aboutUs1.png",
    description: "A forum celebrating and empowering women in technology, with keynote speakers and networking opportunities.",
  },
];

export default function EventsTabsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = events[activeIdx];

  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 py-16 px-4">
      {/* Tabs */}
      <div className="w-full md:w-1/4 border-r pr-4">
        <ul className="space-y-2">
          {events.map((event, idx) => (
            <li key={event.name}>
              <button
                className={`w-full text-left px-4 py-2 rounded font-semibold border ${activeIdx === idx ? 'bg-green-600 text-white' : 'bg-white text-black border-transparent'} transition`}
                onClick={() => setActiveIdx(idx)}
              >
                {event.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Content */}
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{active.name}</h2>
        <div className="w-full max-w-xl mb-4">
          <Image src={active.image} alt={active.name} width={600} height={300} className="rounded-xl object-cover" />
        </div>
        <p className="text-gray-700 text-sm md:text-base">{active.description}</p>
      </div>
    </section>
  );
} 