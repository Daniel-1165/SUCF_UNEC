import { getExecutives } from "@/lib/sanity/queries";
import ExecutivesView from "./ExecutivesView";

export const metadata = {
  title: "Executives",
  description:
    "Meet the dedicated team of servants leading SUCF UNEC for the current academic session.",
};

export default async function ExecutivesPage() {
  const executives = await getExecutives();

  return <ExecutivesView executives={executives || []} />;
}
