"use client"

import { useState } from "react";
import Image from "next/image";

const itStrategyPartnership = () => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500"><strong>Policy Framework:</strong> Provide technical leadership to develop policies, frameworks, plans and indicators to capture performance results and provide effective, accurate and timely monitoring, evaluation and reporting of all project activities.</p>
      <p className="text-gray-500"><strong>Partnership Management:</strong> identify, recruit and manage relationships with potential partners who will bring value to the vision and goal of the Ministry State.</p>
      <p className="text-gray-500"><strong>IT Management Plan:</strong> Prepare strategic plans and translate them into short, medium, and long term plans.</p>
      <p className="text-gray-500"><strong>Training & Capacity Development:</strong> plan, organize and execute several training and interventions both internal (for the Ministry’s staff) and external. Plan both reskilling and upskilling training. Identify and recruit participants/beneficiaries of the external programs organized by the Ministry.</p>
    </div>
  )
}

const knowledgeManagement = () => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500"><strong>Research & Development:</strong> Conducts and facilitates research to enable better understanding of emerging technologies and trends in the tech industry, and also to provide information/data to support the development of strategies, principles, standards and guidelines that ensures the continued effectiveness of the Ministry as an Enabler by carrying out research into emerging technologies and championing tech-based innovations from academia.</p>
      <p className="text-gray-500"><strong>Media & Publicity:</strong> coordinate and manage all internal and external communications with staff, partners and the public. Manage the image and reputation of the Ministry by producing publications, activities, develop responses to press etc</p>
    </div>
  )
}

const eGovernment = () => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500"><strong>E-commerce, E-school, E-business, Digital Governance:</strong> develop cutting-edge customized digital solutions that enhance commerce, education, businesses and governance. Develop policies for managing and monitoring full scale adaptation.</p>
    </div>
  )
}

const itInfrastructureDataCenters = () => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500"><strong>Hardware, Software, Database:</strong> Responsible for sourcing, recommending, deploying, administering and monitoring all technical tools and infrastructure including but not limited to hardware and software systems, databases, custom-built software, payment systems/gateways, email systems, websites, storage systems amongst others. Provide technical support for all staff.</p>
    </div>
  )
}

const cyberSecurityDataProtection = () => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-500"><strong>Cybersecurity & Data Protection:</strong> To provide data and information security; to anticipate and preempt breaches and potential sources of incursions and to forestall and prevent such. Threat assessments, network monitoring, penetration testing and firewall deployment and management.</p>
    </div>
  )
}

const departments = [
  {
    name: "IT Strategy & Partnership",
    image: "/images/IT-Strat-2.png",
    description: itStrategyPartnership(),
  },
  {
    name: "Knowledge Management",
    image: "/images/knowledge-management.png",
    description: knowledgeManagement(),
  },
  {
    name: "E-Government",
    image: "/images/e-gov.jpg",
    description: eGovernment(),
  },
  {
    name: "IT Infrastructure & Data Centers",
    image: "/images/datacenters.jpg",
    description: itInfrastructureDataCenters(),
  },
  {
    name: "Cyber Security & Data Protection",
    image: "/images/cyberSecurity.jpg",
    description: cyberSecurityDataProtection(),
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
        <div className="w-full mb-4">
          <Image src={active.image} alt={active.name} width={400} height={300} className="rounded-xl object-cover" />
        </div>
        {active.description}
      </div>
    </section>
  );
} 