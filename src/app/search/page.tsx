import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading search results...</p>}>
      <SearchClient />
    </Suspense>
  );
}
