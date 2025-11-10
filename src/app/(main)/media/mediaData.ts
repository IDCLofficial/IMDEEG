export interface MediaItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  img: string;
  type: string; // e.g. 'photo', 'video', 'press release'
  slug?: string;
}

export const mediaData: MediaItem[] = [
  {
    id: "1",
    title: "SkillUp Imo Graduation Photo Gallery",
    desc: "Photos from the SkillUp Imo Cohort 5 graduation ceremony, featuring students, instructors, and special guests.",
    date: "MAY 28, 2025",
    img: "/images/skillUp.png",
    type: "photo",
    slug: "skillup-imo-graduation-gallery"
  },
  {
    id: "2",
    title: "Broadband Expansion Project Launch Video",
    desc: "Watch the highlights from the Imo State broadband expansion project launch event.",
    date: "MAY 25, 2025",
    img: "/images/projectsHero.png",
    type: "video",
    slug: "broadband-expansion-launch-video"
  },
  {
    id: "3",
    title: "Press Release: E-Government Portal Launch",
    desc: "Official press release announcing the launch of the new e-government portal for business registration.",
    date: "MAY 20, 2025",
    img: "/images/initiatives.png",
    type: "press release",
    slug: "press-release-e-gov-portal"
  },
  {
    id: "4",
    title: "Digital Literacy Training Photos",
    desc: "A collection of photos from digital literacy training sessions held across Imo State.",
    date: "MAY 22, 2025",
    img: "/images/aboutUs1.png",
    type: "photo",
    slug: "digital-literacy-training-photos"
  },
  {
    id: "5",
    title: "Cybersecurity Awareness Campaign Video",
    desc: "Video coverage of the state-wide cybersecurity awareness campaign kickoff.",
    date: "MAY 18, 2025",
    img: "/images/advert_flier.png",
    type: "video",
    slug: "cybersecurity-awareness-campaign-video"
  }
]; 