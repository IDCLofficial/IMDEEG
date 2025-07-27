"use client"

import { useState } from "react";
import Image from "next/image";

const departments = [
  {
    name: "IT Strategy & Partnership",
    image: "/images/aboutUs1.png",
    description:
      "Hardware, Software, Database: Responsible for sourcing, recommending, deploying, administering and monitoring all technical tools and infrastructure including but not limited to hardware and software systems, databases, custom-built software, payment systems/gateways, email systems, websites, storage systems amongst others. Provide technical support for all staff.",
  },
  {
    name: "Knowledge Management",
    image: "/images/aboutUs1.png",
    description: "Knowledge Management department description goes here.",
  },
  {
    name: "E-Government",
    image: "/images/aboutUs1.png",
    description: "E-Government department description goes here.",
  },
  {
    name: "IT Infrastructure & Data Centers",
    image: "/images/aboutUs1.png",
    description: "IT Infrastructure & Data Centers department description goes here.",
  },
  {
    name: "Cyber Security & Data Protection",
    image: "/images/aboutUs1.png",
    description: "Cyber Security & Data Protection department description goes here.",
  },
];

export default function UnitsTabsSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = departments[activeIdx];

  return (
    <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 py-16 px-4">
      {/* Tabs */}
      <div className="w-full md:w-1/4 border-r pr-4">
        <ul className="space-y-2 flex md:flex-col gap-2 overflow-x-auto">
          {departments.map((dept, idx) => (
            <li key={dept.name}>
              <button
                className={`w-full text-left px-4 py-2 rounded border text-nowrap ${activeIdx === idx ? 'bg-green-600 text-white' : 'bg-white text-black border-transparent'} transition`}
                onClick={() => setActiveIdx(idx)}
              >
                {dept.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Content */}
      <div className="flex-1">
        <h2 className="text-2xl md:text-[43px] font-medium mb-4">{active.name}</h2>
        <div className="w-full max-w-xl mb-4">
          <Image src={active.image} alt={active.name} width={600} height={300} className="rounded-xl object-cover" />
        </div>
        <p className="text-[1rem] text-dark-primary-body">{active.description}</p>
      </div>
    </section>
  );
} 