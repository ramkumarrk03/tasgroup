import HarbourHero from "@/components/HarbourHero";
import CredentialsStrip from "@/components/CredentialsStrip";
import RouteMap from "@/components/RouteMap";
import CapabilityExplorer from "@/components/CapabilityExplorer";
import PortOps from "@/components/PortOps";
import Timeline from "@/components/Timeline";
import GroupStack from "@/components/GroupStack";
import QuoteCta from "@/components/QuoteCta";
import PlimsollProgress from "@/components/PlimsollProgress";

export default function Home() {
  return (
    <>
      <PlimsollProgress />
      <HarbourHero />
      <CredentialsStrip />
      <RouteMap />
      <CapabilityExplorer />
      <PortOps />
      <Timeline />
      <GroupStack />
      <QuoteCta />
    </>
  );
}
