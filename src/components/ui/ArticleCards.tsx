"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  content?: string;
}

export default function ArticleCards() {
  const [articles, setArticles] = React.useState<Article[]>([]);

  React.useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/articles`
        );
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error loading articles:", err);
      }
    }
    fetchArticles();
  }, []);

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
      <div className="flex flex-col gap-6">
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
                <p className="text-sm text-gray-600 mt-2">
                  {truncateText(article.content, 50)}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
