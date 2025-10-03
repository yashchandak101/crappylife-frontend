"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  slug: string;
  cover_image?: string;
  content?: string;
}

interface Event {
  id: number;
  title: string;
  slug: string;
  image?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<{ articles: Article[]; events: Event[] }>({
    articles: [],
    events: [],
  });
  const [loading, setLoading] = useState(false);

  const getImageUrl = (img?: string) => {
    if (!img) return "/default-placeholder.png"; // fallback
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_API_URL}${img}`;
  };

  const truncateText = (text: string = "", length: number) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search/?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults({
          articles: data.articles || [],
          events: data.events || [],
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for: <span className="text-blue-600">{query}</span>
      </h1>

      {loading && <p className="text-gray-500">Searching...</p>}

      {!loading && (
        <>
          {/* Articles Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Articles</h2>
            {results.articles.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition block"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={getImageUrl(article.cover_image)}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{article.title}</h3>
                      {article.content && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {truncateText(article.content, 50)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No articles found.</p>
            )}
          </div>

          {/* Events Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Events</h2>
            {results.events.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition block"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={getImageUrl(event.image)}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {truncateText(event.description, 50)}
                        </p>
                      )}
                      {event.start_date && event.end_date && (
                        <p className="mt-2 text-sm text-gray-500">
                          📅 {new Date(event.start_date).toLocaleDateString()} -{" "}
                          {new Date(event.end_date).toLocaleDateString()}
                        </p>
                      )}
                      {event.location && (
                        <p className="mt-1 text-sm text-gray-500">📍 {event.location}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
