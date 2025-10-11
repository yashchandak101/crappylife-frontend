"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  content?: string;
  author?: string;
  published_at?: string;
}

// ✅ Helper for images
function getImageUrl(path: string | undefined): string {
  if (!path) return "/default.jpg";

  if (path.startsWith("http")) return path;

  if (path.startsWith("image/")) {
    return `https://res.cloudinary.com/dvksqgurb/${path}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export default function CategoryArticlesPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/articles/by-category/${slug}/`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchArticles();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!articles.length)
    return <p className="text-center mt-10">No articles found for "{slug}".</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Articles in "{slug}"
      </h1>

      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.slug}`}
          className="flex flex-col md:flex-row border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition bg-white"
        >
          {/* Left image section */}
          {article.cover_image && (
            <div className="relative w-full md:w-1/3 h-60 md:h-auto">
              <Image
                src={getImageUrl(article.cover_image)}
                alt={article.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Right content section */}
          <div className="p-6 flex flex-col justify-center md:w-2/3">
            <h3 className="text-2xl font-semibold mb-2">{article.title}</h3>

            {article.content && (
              <p className="text-gray-600 text-base leading-relaxed line-clamp-3 mb-3">
                {article.content.slice(0, 150)}...
              </p>
            )}

            {/* Author and Date */}
            <div className="text-sm text-gray-500 mt-auto">
              {article.author && (
                <span className="font-medium text-gray-700">
                  {article.author}
                </span>
              )}
              {article.published_at && (
                <span>
                  {" "}
                  •{" "}
                  {new Date(article.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
