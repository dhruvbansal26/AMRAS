export const calculateDistanceAndDuration = async (
  patientCoordinates: any,
  ecmoCoordinates: any,
  apiKey: string
) => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geocoding`;
      document.head.append(script);

      script.onload = () => {
        resolveDistanceAndDuration(
          patientCoordinates,
          ecmoCoordinates,
          resolve,
          reject
        );
      };

      script.onerror = (e) => {
        reject(new Error("Google Maps script failed to load"));
      };
    } else {
      resolveDistanceAndDuration(
        patientCoordinates,
        ecmoCoordinates,
        resolve,
        reject
      );
    }
  });
};

const resolveDistanceAndDuration = (
  patientCoordinates: any,
  ecmoCoordinates: any,
  resolve: any,
  reject: any
) => {
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
        resolve({ distance: distanceResult, duration: durationResult });
      } else {
        reject(new Error("Failed to calculate distance and duration"));
      }
    }
  );
};

// Usage example:
/*
  calculateDistanceAndDuration(patientCoordinates, ecmoCoordinates, "YOUR_GOOGLE_MAPS_API_KEY")
    .then(({ distance, duration }) => {
      console.log(distance, duration);
    })
    .catch(error => {
      console.error(error);
    });
  */
