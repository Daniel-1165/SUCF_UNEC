import { getGalleryImages } from "@/lib/sanity/queries";
import GalleryView from "./GalleryView";

export const metadata = {
  title: "Gallery",
  description:
    "Explore our visual journey of worship, fellowship, and outreach at the University of Nigeria, Enugu Campus.",
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return <GalleryView images={images || []} />;
}
