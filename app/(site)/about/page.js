import { getAboutPage, getExecutives } from "@/lib/sanity/queries";
import AboutView from "./AboutView";

export const metadata = {
  title: "About",
  description:
    "Learn about the history, vision, and mission of SUCF UNEC - raising balanced Christian students at the University of Nigeria, Enugu Campus.",
};

export default async function AboutPage() {
  const [aboutPage, allExecutives] = await Promise.all([
    getAboutPage(),
    getExecutives(),
  ]);

  const executives = (allExecutives || []).slice(0, 4);

  return <AboutView aboutPage={aboutPage} executives={executives} />;
}
