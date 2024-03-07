"use client";
import React, { useEffect, useState } from "react";
import { Libraries, useJsApiLoader } from "@react-google-maps/api";

const libraries: Libraries = ["places", "geocoding"];

const DistanceComponent = ({ patientCoordinates, ecmoCoordinates }: any) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (isLoaded) {
      calculateDistance();
    }
  }, [isLoaded, patientCoordinates, ecmoCoordinates]);

  const calculateDistance = () => {
    const origin = new window.google.maps.LatLng(
      patientCoordinates.lat,
      patientCoordinates.lng
    );
    const destination = new window.google.maps.LatLng(
      ecmoCoordinates.lat,
      ecmoCoordinates.lng
    );

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
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

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div>
      {ecmoCoordinates.lat}, {ecmoCoordinates.lng} {distance} {duration}
    </div>
  );
};

export default DistanceComponent;
