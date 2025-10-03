"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { apiFetch } from "@/lib/api";


interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Navbar() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/articles/categories/`;
        const data = await apiFetch(url);
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    }
    loadCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            CrappyLife
          </Link>

          {/* Menu + Search */}
          <div className="flex items-center space-x-6">
            {/* Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                {/* Articles Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Articles</NavigationMenuTrigger>
                  <NavigationMenuContent className="p-4 min-w-[300px] max-w-[600px]">
                    <div className="grid gap-4">
                      {categories.map((category) => (
                        <NavigationMenuLink asChild key={category.id}>
                          <Link
                            href={`/articles/category/${category.slug}`}
                            className="block p-2 text-sm font-medium hover:bg-gray-100 transition whitespace-nowrap"
                          >
                            {category.name}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Other Links */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/events"
                      className="block p-2 text-sm font-medium hover:bg-gray-100 transition"
                    >
                      Events
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/newsletter"
                      className="block p-2 text-sm font-medium hover:bg-gray-100 transition"
                    >
                      Newsletter
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/login"
                      className="block p-2 text-sm font-medium hover:bg-gray-100 transition"
                    >
                      Login
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuIndicator />
              <NavigationMenuViewport />
            </NavigationMenu>



            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1.5 text-gray-500 hover:text-blue-600"
              >
                🔍
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
