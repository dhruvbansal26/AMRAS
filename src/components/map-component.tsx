"use client";
import React, { useEffect, useRef, useState } from "react";
import { MapSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
// import Autocomplete from "react-google-autocomplete";
import { Input } from "./ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useJsApiLoader,
  GoogleMap,
  Libraries,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
const libraries: Libraries = ["places", "geocoding"];

export const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });
  const form = useForm<z.infer<typeof MapSchema>>({
    resolver: zodResolver(MapSchema),
    defaultValues: {
      location: "",
    },
  });
  const containerStyle = {
    width: "800px",
    height: "400px",
  };
  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523,
  });

  if (!isLoaded) {
    return (
      <>
        <BeatLoader />
      </>
    );
  }

  async function onSubmit(values: z.infer<typeof MapSchema>) {
    console.log({ location: values.location });
  }

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    // Assuming the place has a formatted address, update the form field

    if (place.formatted_address) {
      form.setValue("location", place.formatted_address, {
        shouldValidate: true,
      });
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      setCenter({ lat: lat || 0, lng: lng || 0 });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="m-2">Your Location</FormLabel>
                <FormControl>
                  {/* <Autocomplete
                    libraries={libraries}
                    apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                    onPlaceSelected={handlePlaceSelect}
                    className="w-[400px] h-[40px] shadow-md border font-normal rounded-sm pl-2"
                  /> */}
                  <Autocomplete>
                    <Input
                      type="text"
                      placeholder="Enter"
                      className="w-[400px] h-[40px] shadow-md rounded-sm"
                    ></Input>
                  </Autocomplete>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full items-center justify-center">
            Search
          </Button>
        </form>
      </Form>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <Marker position={center}></Marker>
      </GoogleMap>
    </>
  );
};
