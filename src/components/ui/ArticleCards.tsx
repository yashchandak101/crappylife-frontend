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

// ✅ Moved outside the component
function getImageUrl(path: string) {
  if (!path) return "/default.jpg"; // fallback image
  if (path.startsWith("http")) return path; // already full URL

  // prepend your Cloudinary base URL
  return `https://res.cloudinary.com/dvksqgurb/${path}`;
}

export default function ArticleCards() {
  const [articles, setArticles] = React.useState<Article[]>([]);

  React.useEffect(() => {
    async function fetchArticles() {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/articles/articles`;
        console.log("🛰 Fetching from:", apiUrl);

        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Articles:", data);
        setArticles(data);
      } catch (err) {
        console.error("❌ Error loading articles:", err);
      }
    }

    fetchArticles();
  }, []);

  const truncateText = (text: string, length: number) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition block"
            >
              {article.cover_image && (
                <div className="relative w-full h-96 mb-6">
                  <Image
                    src={getImageUrl(article.cover_image)}
                    alt={article.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

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
      )}
    </div>
  );
}
