"use client";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

const libraries: Libraries = ["places", "geocoding"];

const DistanceComponent = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  const calculateDistance = () => {
    const origin = new window.google.maps.LatLng(40.712776, -74.005974); // New York
    const destination = new window.google.maps.LatLng(34.052235, -118.243683); // Los Angeles

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING, // Using TravelMode enum
      },
      (response, status) => {
        if (status === "OK" && response) {
          const distanceResult = response.rows[0].elements[0].distance.text;
          const durationResult = response.rows[0].elements[0].duration.text;
          setDistance(distanceResult);
          setDuration(durationResult);
        } else {
          console.error("Error was", status);
        }
      }
    );
  };

  return (
    <div>
      <button onClick={calculateDistance}>Calculate Distance</button>
      <div>Distance: {distance}</div>
      <div>Duration: {duration}</div>
    </div>
  );
};

export default DistanceComponent;
