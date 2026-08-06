import HomeView from "@/components/home/HomeView";
import {
  getUpcomingFellowshipEvent,
  getWeeklyPosts,
  getArticles,
  getNews,
  getBooks,
  getGalleryImages,
  getReflections,
} from "@/lib/sanity/queries";

export const metadata = {
  title: "The Unique Fellowship",
  description:
    "Experience a community where spiritual growth meets academic excellence at the University of Nigeria, Enugu Campus.",
};

export default async function HomePage() {
  const [event, weeklyPosts, articles, news, books, galleryImages, reflections] = await Promise.all([
    getUpcomingFellowshipEvent(),
    getWeeklyPosts(),
    getArticles(),
    getNews(),
    getBooks(),
    getGalleryImages(),
    getReflections(),
  ]);

  return (
    <HomeView
      event={event}
      weeklyPosts={weeklyPosts}
      reflections={reflections}
      articles={(articles || []).slice(0, 4)}
      news={(news || []).slice(0, 3)}
      books={(books || []).slice(0, 6)}
      galleryImages={(galleryImages || []).slice(0, 6)}
    />
  );
}
