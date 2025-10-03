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
  content?: string; // assuming your API returns this
}

export default function FeaturedCarousel() {
  const [articles, setArticles] = React.useState<Article[]>([]);

  React.useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/articles/articles/featured/`
        );
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error("Error loading featured articles:", err);
      }
    }
    fetchFeatured();
  }, []);

  const truncateText = (text: string, length: number) => {
    if (!text) return "";
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  return (
    <div className="w-full py-4"> {/* removed max-w-6xl mx-auto */}
      <Carousel className="w-full">
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem key={article.id} className="basis-full">
              <Link href={`/articles/${article.slug}`} className="block relative">
                <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px]">
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    className="object-cover rounded-xl shadow-lg"
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
