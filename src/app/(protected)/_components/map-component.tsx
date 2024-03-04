"use client";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Input } from "../../../components/ui/input";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
} from "../../../components/ui/form";
import { LocationSchema } from "@/schemas";
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
  GoogleMap,
  Libraries,
  Marker,
  useLoadScript,
  useJsApiLoader,
} from "@react-google-maps/api";
import { FormSuccess } from "../../../components/form-success";
import { FormError } from "../../../components/form-error";
import { Button } from "../../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const libraries: Libraries = ["places", "geocoding"];

export const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
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
      <div className=" place-container flex flex-col items-center">
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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    const capitalizeWords = (str: string) =>
      str.replace(/\b\w/g, (c) => c.toUpperCase());

    // Attempt to capitalize the address except for the state abbreviation
    let parts = address.split(",").map((part: string) => part.trim());
    const lastPart =
      parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
    parts = parts.slice(0, -1).map((part: string) => capitalizeWords(part));
    if (lastPart) parts.push(lastPart); // Add the fully capitalized last part back
    const formattedAddress = parts.join(", ");

    setValue(formattedAddress, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);

    form.setValue("location", formattedAddress);
    form.setValue("coordinates", { lat, lng });

    setSelected({ lat, lng });
    setCenter({ lat, lng });
  };
  const form = useForm<z.infer<typeof LocationSchema>>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      location: "",
      coordinates: { lat: 0, lng: 0 },
    },
  });

  async function onSubmit(values: z.infer<typeof LocationSchema>) {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch("/api/auth/set-location", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status === 200) {
        setSuccessMessage(data.success);

        // console.log(data);
        form.reset();
      }
      setErrorMessage(data.error);
    } catch (error) {
      console.log("Error from the server: ", error);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col space-y-4 items-center w-full">
              <FormItem>
                <FormLabel>
                  <FormControl>
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
                        <Command className="">
                          <Input
                            id="locationInput"
                            placeholder="Search place..."
                            onChange={(e) => {
                              setValue(e.target.value);
                            }}
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
                                    setValue(
                                      currentValue === value ? "" : currentValue
                                    );
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
                  </FormControl>
                </FormLabel>
              </FormItem>
            </div>
          </div>
          <FormError message={errorMessage}></FormError>
          <FormSuccess message={successMessage}></FormSuccess>
          <Button type="submit" className="w-full">
            Add
          </Button>
        </form>
      </Form>
    </>
  );
};
