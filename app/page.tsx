
import MapComponent from "@/components/map";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-24 py-5">
      <MapComponent />
    </main>
  );
}
