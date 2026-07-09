import { useSeo } from "@/hooks/useSeo";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Gallery() {
  useSeo({
    title: "Gallery",
    description:
      "Renders, CAD and the build log for the Lynx Racing electric superbike concept — published as the prototype develops into hardware.",
  });

  return (
    <ModulePlaceholder
      code="07 — GALLERY"
      title="Gallery"
      blurb="Renders, CAD and the build log will land here as the concept develops into hardware. Everything shown is a concept visualisation until the first parts exist."
      items={[
        "Concept renders",
        "CAD & exploded views",
        "Build-log photography",
        "Bench-test footage",
        "Track shakedown",
      ]}
    />
  );
}
