import Image from "next/image";
import ReadySection from "../../news/ReadySection";
import Footer from "../../components/Footer";
import getEvents from "../eventsList";
import { Events } from "../../../../lib/types";
import React from "react";
import { Countdown } from "./countDown";
import CTASection from "@/app/components/CTASection";



export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const events = await getEvents();
  const event = events?.find((e: Events) => e.fields.eventName === decodeURIComponent(slug));
  if (!event) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-gray-600">Sorry, the event you are looking for does not exist.</p>
      </div>
    );
  }

  const eventDateTime = event.fields.eventDate;

  return (
    <div className="bg-white">
      {/* Hero Title */}
      <section
        className="relative w-full h-[350px] md:h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: 'url(/images/gradient.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold text-center z-10 drop-shadow-lg px-2">
          {event.fields.eventName}
        </h1>
      </section>
      {/* Event Image & Countdown */}
      <section className="relative w-full flex flex-col items-center pt-6 md:pt-12 pb-4 md:pb-6 px-4 md:px-20">
        <div className="w-full relative">
          <Image
            src={`https:${event.fields.bannerImage?.fields.file.url}`}
            alt={event.fields.eventName}
            width={1920}
            height={600}
            className="object-cover w-full h-[180px] md:h-[480px] rounded-none"
            priority
          />
          <div className="static md:absolute md:bottom-6 md:right-10 z-10 mt-4 md:mt-0 flex justify-center w-full">
            <Countdown eventDateTime={eventDateTime} />
          </div>
        </div>
        <p className="text-gray-700 mt-6 mb-6 md:left text-sm md:text-base">
          {event.fields.briefDescription}
        </p>
      </section>
      {/* Event Details */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-8 md:mb-12">
        <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Event details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-sm md:text-base">
          <div className="flex-row justify-between w-full items-center"><span className="font-semibold">DATE:</span> <span className="ml-2">{event.fields.eventDate}</span></div>
          <div className="flex-row justify-between w-full items-center"><span className="font-semibold">ORGANIZER:</span> <span className="ml-2">{event.fields.ministry?.fields.ministryName}</span></div>
          <div className="flex-row justify-between w-full items-center"><span className="font-semibold">ADDRESS:</span> <span className="ml-2">{event.fields.location}</span></div>
          <div className="flex-row justify-between w-full items-center"><span className="font-semibold">TIME:</span> <span className="ml-2">{event.fields.eventDate}</span></div>
          <div className="flex-row justify-between w-full items-center"><span className="font-semibold">PHONE:</span> <span className="ml-2">{event.fields.contactPhoneNumber}</span></div>
        </div>
      </section>
      {/* Speakers */}
      <section className="w-full max-w-6xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Speakers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {event.fields.firstSpeaker ? (
            <div className="flex flex-col items-start bg-white rounded-xl shadow border border-gray-200 p-3 md:p-4">
              {event.fields.firstSpeakerPicture?.fields.file.url && (
                <div className="w-full h-40 md:w-full md:h-48 relative mb-2 md:mb-3 rounded-lg overflow-hidden">
                  <Image 
                    src={`https:${event.fields.firstSpeakerPicture.fields.file.url}`} 
                    alt={event.fields.firstSpeaker} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}
              <span className="text-green-700 font-semibold text-xs md:text-sm mb-1">Speaker</span>
              <span className="font-bold text-base md:text-lg text-left">{event.fields.firstSpeaker}</span>
            </div>
          ) : null}
          
          {event.fields.secondSpeaker ? (
            <div className="flex flex-col items-start bg-white rounded-xl shadow border border-gray-200 p-3 md:p-4">
              {event.fields.secondSpeakerPicture?.fields.file.url && (
                <div className="w-full h-40 md:w-full md:h-48 relative mb-2 md:mb-3 rounded-lg overflow-hidden">
                  <Image 
                    src={`https:${event.fields.secondSpeakerPicture.fields.file.url}`} 
                    alt={event.fields.secondSpeaker} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}
              <span className="text-green-700 font-semibold text-xs md:text-sm mb-1">Speaker</span>
              <span className="font-bold text-base md:text-lg text-left">{event.fields.secondSpeaker}</span>
            </div>
          ) : null}
          
          {!event.fields.firstSpeaker && !event.fields.secondSpeaker && (
            <div className="text-gray-500 col-span-full">No speakers announced yet.</div>
          )}
        </div>
      </section>
      <CTASection 
        heading="Ready to Experience the New Imo?"
        subtext="Discover our vision for an inclusive, empowered, and connected state."
        buttonLabel="Contact Us"
        buttonHref="/contact-us"
      />
      <Footer />
    </div>
  );
}