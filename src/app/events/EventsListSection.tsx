import Image from "next/image";
import Link from "next/link";
import { Events } from "../../../lib/types";

function isUpcomingEvent(eventDateStr: string) {
  // Try to parse date (optionally with time)
  const parsed = Date.parse(eventDateStr);
  if (!isNaN(parsed)) {
    // Compare only the date part (ignore time for 'today')
    const now = new Date();
    const eventDate = new Date(parsed);
    // Set both to midnight for date-only comparison
    now.setHours(0,0,0,0);
    eventDate.setHours(0,0,0,0);
    return eventDate >= now;
  }
  return false;
}

export default function EventsListSection({events}: {events: Events[]}) {
  // Filter only upcoming events (today or later)
  const upcomingEvents = events?.filter(event => {
    let dateStr = event.fields.eventDate;
    if (event.fields.eventDate) dateStr = `${event.fields.eventDate}`;
    return isUpcomingEvent(dateStr);
  });

  return (
    <section className="w-full mx-auto py-16 px-4 md:px-8">
      <h2 className="text-2xl md:text-2xl font-medium mb-8">Upcoming Events</h2>
      {upcomingEvents?.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">No upcoming events at this time. Please check back later.</div>
      ) : (
        <div className="flex flex-col gap-8">
          {upcomingEvents?.map((event, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 items-center border-b border-b-[#C8C8C8] pb-8 last:border-b-0">
              <div className="w-full md:w-64 h-40 relative rounded overflow-hidden flex-shrink-0">
                <Image src={`https:${event.fields.bannerImage?.fields.file.url}`} alt={event.fields.eventName} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <div className="flex flex-row items-center gap-4 md:gap-10 text-gray-500 text-xs mb-1">
                    <span>{event.fields.eventDate}</span>
                    <span>{event.fields.location}</span>
                  </div>
                  <h3 className="text-xl font-medium mb-1">{event.fields.eventName}</h3>
                  <p className="text-dark-primary-body text-base mb-2">{event.fields.briefDescription}</p>
                </div>
                <div className="flex justify-end md:justify-center">
                  <Link href={`/events/${event.fields.eventName}`} className="border border-primary-green text-primary-green text-[14px] px-4 py-2 rounded font-semibold hover:bg-green-50 transition">More Information</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
} 