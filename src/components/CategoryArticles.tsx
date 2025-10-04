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
}

interface Category {
  id: number;
  name: string;
  slug: string;
  articles: Article[];
}

function getImageUrl(path: string) {
  if (!path) return "/default.jpg";

  // already full Cloudinary or external URL
  if (path.startsWith("http")) return path;

  // Cloudinary relative paths (like "image/upload/articles/...")
  if (path.startsWith("image/")) {
    return `https://res.cloudinary.com/dvksqgurb/${path}`;
  }

  // If served by your Django backend (like "/media/articles/...")
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

        // ✅ Fetch articles per category concurrently
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {categories.map((category) => (
        <div key={category.id}>
          {/* ✅ Category Heading with link */}
          <h2 className="text-2xl font-bold mb-6">
            <Link
              href={`/articles/category/${category.slug}`}
              className="hover:text-blue-600 transition"
            >
              {category.name}
            </Link>
          </h2>

          {/* ✅ Articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.articles.length > 0 ? (
              category.articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition block"
                >
                  {article.cover_image && (
                    <div className="relative w-full h-60">
                      <Image
                        src={getImageUrl(article.cover_image)}
                        alt={article.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{article.title}</h3>
                    {article.content && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {truncateText(article.content, 80)}
                      </p>
                    )}
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
