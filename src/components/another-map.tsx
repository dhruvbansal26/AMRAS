import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// Assuming MapSchema is defined correctly elsewhere
const MapSchema = z.object({
  location: z.string(),
});

export const AnotherMap = () => {
  const { register, setValue, handleSubmit } = useForm({
    resolver: zodResolver(MapSchema),
  });
  const [center, setCenter] = useState({ lat: -3.745, lng: -38.523 });
  const [isLoaded, setIsLoaded] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (window.google && inputRef.current) {
      const autoComplete = new window.google.maps.places.Autocomplete(
        inputRef.current
      );
      autoComplete.addListener("place_changed", () => {
        const place = autoComplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          alert("No details available for input: '" + place.name + "'");
          return;
        }
        const location = place.geometry.location;
        const latLng = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setCenter(latLng);
        setValue("location", place.formatted_address);
      });
      setIsLoaded(true);
    }
  }, [setValue]);

  const containerStyle = {
    width: "800px",
    height: "400px",
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      This is the map component
      <input
        placeholder="Type your location"
        ref={inputRef}
        {...register("location")}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Button type="submit">Search</Button>
      </form>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} />
    </>
  );
};
