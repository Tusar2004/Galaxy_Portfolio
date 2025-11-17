import GalaxyScene from "./GalaxyScene";
import InteriorScene from "./InteriorScene";

type SceneManagerProps = {
  mode: "space" | "interior";
  currentPlanet: string | null;
};

export default function SceneManager({ mode, currentPlanet }: SceneManagerProps) {
  if (mode === "interior") {
    return <InteriorScene planet={currentPlanet ?? "about-me"} />;
  }
  return <GalaxyScene />;
}
