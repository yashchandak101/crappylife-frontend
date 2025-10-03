"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/events/`);
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading events...</p>;

  if (!events.length) return <p className="text-center mt-10">No events found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            <div className="relative w-full h-60">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-bold">{event.title}</h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{event.description}</p>
              <p className="mt-2 text-sm font-medium text-gray-800">
                📅 {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
              </p>
              <p className="mt-1 text-sm text-gray-500">📍 {event.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
