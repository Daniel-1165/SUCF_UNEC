import { getBooks } from "@/lib/sanity/queries";
import LibraryView from "./LibraryView";

export const metadata = {
  title: "Library",
  description:
    "Browse our collection of semester books, spiritual growth resources, and academic archives.",
};

export default async function LibraryPage() {
  const books = await getBooks();

  return <LibraryView books={books || []} />;
}
