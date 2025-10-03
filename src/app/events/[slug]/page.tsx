"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Event {
  id: number;
  title: string;
  slug: string;
  image?: string;
  description?: string;
  date?: string;
  location?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/events/${slug}/`
        );
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchEvent();
    }
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{event.title}</h1>

      {event.image && (
        <div className="relative w-full h-96 mb-6">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover rounded-lg shadow"
          />
        </div>
      )}

      {event.description && (
        <p className="text-gray-700 mb-4">{event.description}</p>
      )}

      <div className="text-sm text-gray-600 space-y-2">
        {event.date && (
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
        )}
        {event.location && <p>📍 {event.location}</p>}
      </div>
    </div>
  );
}
