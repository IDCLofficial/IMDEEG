import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  sponsors?: {
    name: string;
    logo: string;
  }[];
}

export default function ProjectCard({ title, description, image, sponsors }: ProjectCardProps ) {
  return (  
    <section className="w-full py-10 md:py-16 bg-white flex flex-col md:flex-row md:items-center gap-8 md:gap-22 px-4 md:px-20">
      <div className="w-full relative rounded-lg overflow-hidden md:hidden"> 
        <Image src={image} alt={title} width={500} height={500} className="object-cover w-full h-[180px] md:h-[400px]" />
      </div>
      <div className="md:w-[60%] md:flex-1 flex flex-col gap-4 md:gap-6">
        <h2 className="text-xl md:text-3xl lg:text-[43px] font-medium">{title}</h2>
        <p className="text-dark-primary-body text-base md:text-[1rem] leading-relaxed">
          {description}
        </p>
        {/* <AppLink href="/projects/skillup" variant="primary" label="Meet Our Talents" className="w-max md:w-max" /> */}
        {/* <div className="w-full flex flex-row gap-4 md:gap-10 justify-between mt-4 divide-x md:divide-y-0 divide-gray-500">
          <div className="flex-1 flex flex-col items-center justify-center py-2 md:py-0">
            <span className="text-base md:text-[18px] font-bold">100,000</span>
            <span className="text-gray-500 text-xs md:text-sm">youths targeted</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-2 md:py-0">
            <span className="text-base md:text-[18px] font-bold">50+</span>
            <span className="text-gray-500 text-xs md:text-sm">training centers nationwide</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-2 md:py-0">
            <span className="text-base md:text-[18px] font-bold">200+</span>
            <span className="text-gray-500 text-xs md:text-sm">certified instructors</span>
          </div>
        </div> */}
        <div className="flex flex-wrap gap-4 md:gap-6 mt-6 items-center justify-start">
          {sponsors && sponsors.map((sponsor)=>(
            <Image key={sponsor.name} src={sponsor.logo} alt={sponsor.name} width={70} height={30} />
          ))}
        </div>
      </div>
      <div className="w-full md:w-[40%] flex justify-center mt-6 md:mt-0">
        <div className="w-full relative rounded-lg overflow-hidden max-md:hidden">
          <Image src={image} alt="road construction" width={500} height={500} className="object-cover w-full h-[180px] md:h-[400px]" />
        </div>
      </div>
    </section>
  );
} 