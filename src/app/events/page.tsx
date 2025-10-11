"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  image: string;
  author?: string;
  published_at?: string;
}

// ✅ Safely build full Cloudinary or backend image URLs
function getImageUrl(path: string | undefined): string {
  if (!path) return "/fallback-image.png"; // fallback
  if (path.startsWith("http")) return path;
  if (path.startsWith("image/")) {
    return `https://res.cloudinary.com/dvksqgurb/${path}`;
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/events/`
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("❌ Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;
  if (!events.length)
    return <p className="text-center mt-10">No events found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="flex flex-col gap-6">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="flex flex-col md:flex-row border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
          >
            {/* Image Left */}
            <div className="relative w-full md:w-1/3 h-56 md:h-auto">
              <Image
                src={getImageUrl(event.image)}
                alt={event.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Details Right */}
            <div className="p-5 flex flex-col justify-between w-full md:w-2/3">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                  {event.description}
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                <p>📍 {event.location}</p>
                {event.author && <p>✍️ By {event.author}</p>}
                {event.published_at && (
                  <p>🕓 Published on {new Date(event.published_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
