import FeaturedCarousel from "@/components/FeaturedCarousel";
import ArticleCards from "@/components/ui/ArticleCards";
import CategoryArticles from "@/components/CategoryArticles";

export default function HomePage() {
  return (
    <div className="w-full px-2 sm:px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-6">

      <div className="md:col-span-2">
        <FeaturedCarousel />
        <CategoryArticles />
      </div>






      <div className="md:col-span-1">
      
        <ArticleCards />
      </div>
    </div>
  );
}