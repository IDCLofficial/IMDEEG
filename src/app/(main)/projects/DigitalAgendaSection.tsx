import Image from "next/image";

export default function DigitalAgendaSection() {
  return (
    <section className="w-full py-10 md:py-16 bg-white flex flex-col md:flex-row items-center justify-between gap-8 md:gap-22 px-4 md:px-20 border-t">
      <div className="w-full md:flex-1 flex flex-col gap-4 md:gap-6">
        <h2 className="text-xl md:text-[3xl] lg:text-[43px] font-medium">Digital Imo Agenda: Building a Connected State</h2>
        <p className="text-dark-primary-body text-sm md:text-[1rem] leading-relaxed">A comprehensive plan focused on upgrading Imo State&apos;s digital 
          infrastructure, expanding broadband access, and improving e-government 
          services to ensure seamless connectivity and digital inclusion.
        </p>
        <div className="mb-4">
          <span className="font-semibold">Initiatives:</span>
          <ul className="list-disc ml-6 mt-2 text-dark-primary-body text-xs md:text-[1rem]">
            <li>Digital Infrastructure Improvement: Expansion of fiber-optic networks and 4G/5G rollout.</li>
            <li>Enhanced E-Government Services: Digitization of public service portals for easier citizen access.</li>
            <li>Community Wi-Fi Projects: Establishing free Wi-Fi zones in public spaces.</li>
          </ul>
        </div>
        <div className="flex flex-row max-md:divide-x gap-4 md:gap-10 mt-6">
          <div className="flex flex-col items-start md:text-center">
            <span className="font-medium text-base md:text-[18px]">Lorem ipsum</span>
            <span className="text-xs text-gray-500">Lorem ipsum dolor sit amet</span>
            <span className="font-medium mt-2">Sponsor</span>
          </div>
          <div className="flex flex-col items-start md:text-center">
            <span className="font-medium text-base md:text-[18px]">Lorem ipsum</span>
            <span className="text-xs text-gray-500">Lorem ipsum dolor sit amet</span>
            <span className="font-medium mt-2">Sponsor</span>
          </div>
          <div className="flex flex-col items-start md:text-center">
            <span className="font-medium text-base md:text-[18px]">Lorem ipsum</span>
            <span className="text-xs text-gray-500">Lorem ipsum dolor sit amet</span>
            <span className="font-medium mt-2">Sponsor</span>
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto flex justify-center mt-6 md:mt-0">
        <div className="w-full relative rounded-lg overflow-hidden">
          <Image src="/images/digitalAgenda.png" alt="Digital Agenda" width={500} height={500} className="object-cover w-full h-[180px] md:h-[400px]" />
        </div>
      </div>
    </section>
  );
} 