import MapsClient from "./maps-client";

export const metadata = {
  title: "Maps | DaD Codex",
  description: "Interactive dungeon maps for Dark and Darker — extracts, portals, shrines, bosses and more.",
};

export default function MapsPage() {
  return <MapsClient />;
}
