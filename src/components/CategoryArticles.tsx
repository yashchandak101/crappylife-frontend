"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  cover_image?: string;
  content?: string;
  author?: string;
  published_at?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  articles: Article[];
}

function getImageUrl(path: string | undefined): string {
  if (!path) return "/default.jpg";
  if (path.startsWith("http")) return path;
  if (path.startsWith("image/")) {
    return `https://res.cloudinary.com/dvksqgurb/${path}`;
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function CategoriesWithArticles() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/categories/`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();

        // ✅ Fetch articles for each category concurrently
        const categoriesWithArticles = await Promise.all(
          data.map(async (cat: any) => {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/articles/articles/by-category/${cat.slug}/`
            );
            if (!res.ok) return { ...cat, articles: [] };
            const articles = await res.json();
            return { ...cat, articles };
          })
        );

        setCategories(categoriesWithArticles);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const truncateText = (text: string = "", length: number) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  if (loading) return <p className="text-center py-10">Loading categories...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {categories.map((category) => (
        <div key={category.id}>
          {/* ✅ Category Heading */}
          <h2 className="text-2xl font-bold mb-6">
            <Link
              href={`/articles/category/${category.slug}`}
              className="hover:text-blue-600 transition"
            >
              {category.name}
            </Link>
          </h2>

          {/* ✅ Articles List */}
          <div className="flex flex-col gap-6">
            {category.articles.length > 0 ? (
              category.articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="flex flex-col md:flex-row border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
                >
                  {/* Image Left */}
                  {article.cover_image && (
                    <div className="relative w-full md:w-1/3 h-56 md:h-auto">
                      <Image
                        src={getImageUrl(article.cover_image)}
                        alt={article.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Content Right */}
                  <div className="p-5 flex flex-col justify-between w-full md:w-2/3">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {article.title}
                      </h3>
                      {article.content && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                          {truncateText(article.content, 120)}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {article.author && <p>✍️ By {article.author}</p>}
                      {article.published_at && (
                        <p>
                          🕓 Published on{" "}
                          {new Date(article.published_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No articles in this category.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
