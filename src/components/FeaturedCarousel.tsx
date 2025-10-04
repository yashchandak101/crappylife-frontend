"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Article {
  id: number;
  title: string;
  slug: string;
  cover_image: string;
  content?: string;
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




export default function FeaturedCarousel() {
  const [articles, setArticles] = React.useState<Article[]>([]);

  React.useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/articles/featured/`
        );

        // ✅ Check for bad responses
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Featured Articles:", data);
        setArticles(data);
      } catch (err) {
        console.error("❌ Error loading featured articles:", err);
      }
    }

    fetchFeatured();
  }, []);

  const truncateText = (text: string, length: number) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="w-full py-4">
      <Carousel className="w-full">
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem key={article.id} className="basis-full">
              <Link href={`/articles/${article.slug}`} className="block relative">
              
                  <div className="relative w-full h-96 mb-6">
                    <Image
  src="https://res.cloudinary.com/dvksqgurb/image/upload/v1759583581/ciijb4ukfewcen5zttxm.webp"
  alt="test"
  width={800}
  height={600}
/>
                  </div>
               
                <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 rounded-b-xl">
                  <h2 className="text-lg sm:text-2xl font-bold">{article.title}</h2>
                  <p className="text-sm opacity-90">
                    {truncateText(article.content || "", 500)}
                  </p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
