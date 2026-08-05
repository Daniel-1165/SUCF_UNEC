import { getNews } from "@/lib/sanity/queries";
import NewsView from "./NewsView";

export const metadata = {
  title: "News",
  description: "Stay updated with the latest news and announcements from SUCF UNEC.",
};

export default async function NewsPage() {
  const news = await getNews();

  return <NewsView news={news} />;
}
