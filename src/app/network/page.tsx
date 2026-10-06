import type { Metadata } from "next";
import RouteMap from "@/components/RouteMap";

export const metadata: Metadata = {
  title: "Network map",
  description: "TAS Group's trade network from Penang: WINWIN Lines agency ports across the Indian Subcontinent, the Middle East and Africa, plus five TAS offices.",
};

export default function NetworkPage() {
  return (
    <>
      <h1 className="sr-only">TAS Group trade network map</h1>
      <RouteMap standalone />
    </>
  );
}
