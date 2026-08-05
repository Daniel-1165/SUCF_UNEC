import { getArticles } from "@/lib/sanity/queries";
import ArticlesView from "./ArticlesView";

export const metadata = {
  title: "Articles",
  description:
    "Read inspiring articles, testimonies, and faith-based content from the SUCF UNEC community.",
};

export default async function ArticlesPage() {
  const articles = await getArticles();

  return <ArticlesView articles={articles} />;
}
