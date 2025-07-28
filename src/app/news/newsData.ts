export interface NewsItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  img: string;
  badge: string;
  slug?: string;
}

export const newsData: NewsItem[] = [
  {
    id: "1",
    title: "IMO STATE DIGITIZES PUBLIC SERVICES, UNVEILS NEW E-GOVERNMENT PORTALS",
    date: "MAY 30, 2025",
    img: "/images/homeImage1.png",
    badge: "Top News",
    desc: "From tax payments to public records, the new digital system offers citizens faster, easier access to essential services. The comprehensive e-government platform includes online tax filing, business registration, and public records access.",
    slug: "imo-state-digitizes-public-services"
  },
  {
    id: "2",
    title: "SKILLUP IMO COHORT 5 GRADUATION CEREMONY COMPLETED",
    date: "MAY 28, 2025",
    img: "/images/homeImage2.png",
    badge: "Featured",
    desc: "Over 5,000 trained in cybersecurity, UI/UX, AI — May 2025. The successful completion of Cohort 5 marks another milestone in Imo State's digital skills development initiative.",
    slug: "skillup-imo-cohort-5-graduation"
  },
  {
    id: "3",
    title: "IMO STATE LAUNCHES MAJOR BROADBAND EXPANSION PROJECT",
    date: "MAY 25, 2025",
    img: "/images/heroImage.png",
    badge: "Breaking",
    desc: "The state government announces a comprehensive broadband infrastructure project aimed at connecting rural communities and improving digital access across Imo State.",
    slug: "imo-state-broadband-expansion"
  },
  {
    id: "4",
    title: "DIGITAL LITERACY PROGRAM REACHES 10,000 CITIZENS",
    date: "MAY 22, 2025",
    img: "/images/homeImage1.png",
    badge: "Update",
    desc: "The ministry's digital literacy initiative has successfully trained over 10,000 citizens in basic computer skills, internet usage, and digital safety practices.",
    slug: "digital-literacy-program-success"
  },
  {
    id: "5",
    title: "NEW E-GOVERNMENT PORTAL LAUNCHED FOR BUSINESS REGISTRATION",
    date: "MAY 20, 2025",
    img: "/images/homeImage2.png",
    badge: "Innovation",
    desc: "Streamlined business registration process now available online, reducing processing time from weeks to days and improving ease of doing business in Imo State.",
    slug: "new-e-government-business-portal"
  },
  {
    id: "6",
    title: "CYBERSECURITY AWARENESS CAMPAIGN KICKS OFF",
    date: "MAY 18, 2025",
    img: "/images/heroImage.png",
    badge: "Security",
    desc: "State-wide cybersecurity awareness campaign launched to educate citizens on online safety, data protection, and preventing cyber threats in the digital age.",
    slug: "cybersecurity-awareness-campaign"
  }
]; 