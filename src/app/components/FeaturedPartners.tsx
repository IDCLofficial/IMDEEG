"use client"
import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
    { src: "/images/huawei.png", alt: "Huawei" },
    { src: "/images/cisco.png", alt: "Cisco" },
    { src: "/images/zinox.png", alt: "Zinox" },
    { src: "/images/ncc.png", alt: "NCC" },
    { src: "/images/konga.png", alt: "Konga" },
    { src: "/images/microsoft.png", alt: "Microsoft" },
    { src: "/images/nabteb.png", alt: "Imo State" },
    { src: "/images/uspf.png", alt: "Partner 2" },
    { src: "/images/nitda.png", alt: "NITDA" }
];

export default function FeaturedPartners() {
  return (
    <section className="w-full py-10 md:py-20 bg-[#f7f9fa]">
      <motion.h2 
        key="featured-partners"
        id="featured-partners"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
        className="text-2xl md:text-3xl lg:text-[43px] font-medium text-center mb-8 md:mb-10"
      >
        Featured Partners
      </motion.h2> 
      <motion.div 
        key="featured-partners-images"
        id="featured-partners-images"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false }}
        className="flex flex-col items-center gap-4 md:gap-6 overflow-hidden"
      >
        <div className="overflow-hidden inline-flex animate-scroll">
          {partners.concat(partners).map((partner, idx) => (
            <div key={idx} className="inline-block lg:mx-8 mx-4">
              <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center w-[150px] h-[80px]">
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={60}
                  height={60}
                  className="object-contain inline-block align-middle h-full w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <style jsx>{`
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
} 