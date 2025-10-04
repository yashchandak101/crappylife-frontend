"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  slug: string;
  cover_image?: string;
  content?: string;
  category?: { name: string; slug: string };
  author?: { username: string };
  published_at?: string;
}

function getImageUrl(path: string | undefined): string {
  if (!path) return "/default.jpg";

  // Already a full URL (Cloudinary or others)
  if (path.startsWith("http")) return path;

  // Handle Cloudinary paths like "image/upload/articles/30gold.webp"
  if (path.startsWith("image/")) {
    return `https://res.cloudinary.com/dvksqgurb/${path}`;
  }

  // Handle backend-served paths like "/media/articles/..."
  return `${process.env.NEXT_PUBLIC_API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}





export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/articles/${slug}/`
        );
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchArticle();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!article) return <p className="text-center mt-10">Article not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {article.category && (
        <p className="text-sm text-gray-500 mb-2">
          Category:{" "}
          <span className="font-medium">{article.category.name}</span>
        </p>
      )}

      {article.author && (
        <p className="text-sm text-gray-500 mb-2">
          Author: <span className="font-medium">{article.author.username}</span>
        </p>
      )}

      {article.published_at && (
        <p className="text-sm text-gray-500 mb-4">
          Published on:{" "}
          {new Date(article.published_at).toLocaleDateString()}
        </p>
      )}

      {article.cover_image && (
        <div className="relative w-full h-96 mb-6">
          <Image
            src={getImageUrl(article.cover_image)}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
            unoptimized
          />
        </div>
      )}

      <div className="prose max-w-full">
        <p>{article.content}</p>
      </div>
    </div>
  );
}
