import NewsCard from "./NewsCard";

const newsList = Array(6).fill({
  title: "IMO STATE DIGITIZES PUBLIC SERVICES, UNVEILS NEW E-GOVERNMENT PORTALS",
  date: "MAY 30, 2025",
  img: "/images/homeImage1.png",
  badge: "Top News",
  desc: "From tax payments to public records, the new digital system offers citizens faster, easier access to essential se..."
});

export default function NewsGrid() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {newsList.map((item, idx) => (
        <NewsCard news={item} key={idx} />
      ))}
    </div>
  );
} 