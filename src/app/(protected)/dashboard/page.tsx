import { MapComponent } from "@/components/map-component";
import { Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { auth } from "@/auth";
import { db } from "@/lib/db";
const DashboardPage = async () => {
  return (
    <>
      <MapComponent></MapComponent>
    </>
  );
};

export default DashboardPage;
