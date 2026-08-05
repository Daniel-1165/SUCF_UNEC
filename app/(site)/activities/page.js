import { getActivitiesPage } from "@/lib/sanity/queries";
import ActivitiesView from "./ActivitiesView";

export const metadata = {
  title: "Activities",
  description:
    "Join our weekly fellowships, Bible studies, and special programs. Stay updated with SUCF UNEC activities.",
};

export default async function ActivitiesPage() {
  const activitiesPage = await getActivitiesPage();

  return (
    <ActivitiesView
      weeklySchedule={activitiesPage?.weeklySchedule || []}
      units={activitiesPage?.units || []}
    />
  );
}
