"use client";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Input } from "./ui/input";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  useJsApiLoader,
  GoogleMap,
  Libraries,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { Button } from "./ui/button";

const libraries: Libraries = ["places", "geocoding"];

export const MapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  if (!isLoaded)
    return (
      <>
        <BeatLoader></BeatLoader>
      </>
    );
  return <Map />;
};

function Map() {
  const containerStyle = {
    width: "800px",
    height: "400px",
  };
  const [selected, setSelected] = useState({
    lat: -3.745,
    lng: -38.523,
  });
  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523,
  });
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="place-container">
        <PlacesAutocomplete
          setSelected={setSelected}
          setCenter={setCenter}
        ></PlacesAutocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected}></Marker>}
      </GoogleMap>
    </div>
  );
}

const PlacesAutocomplete = ({ setSelected, setCenter }: any) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Your Location");

  const handleSelect = async (address: any) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);

    setSelected({ lat, lng });
    setCenter({ lat, lng });
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[400px] justify-between overflow-hidden"
          >
            {title}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <Input
              placeholder="Search place..."
              onChange={(e) => setValue(e.target.value)}
            />

            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <CommandItem
                    key={place_id}
                    value={description}
                    className="w-[400px] h-[50px]"
                    onSelect={(currentValue) => {
                      setTitle(description);
                      handleSelect(currentValue);
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {description}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
