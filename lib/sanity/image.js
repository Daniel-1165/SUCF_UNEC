import createImageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "./client";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source) {
  return builder.image(source);
}
