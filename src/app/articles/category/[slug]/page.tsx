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
}

export default function CategoryArticlesPage() {
  const params = useParams();
  const slug = params.slug as string; // ✅ get category slug
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticles();
    }
  }, [slug]);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!articles.length) {
    return <p className="text-center mt-10">No articles found for "{slug}".</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Articles in "{slug}"</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition block"
          >
            <div className="relative w-full h-48">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{article.title}</h3>
              {article.content && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {article.content.slice(0, 50)}...
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
