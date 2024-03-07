// Next.js API route at /api/auth/get-ecmo-address

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lat, lng } = body;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data.results[0].formatted_address);
    if (data.status === "OK") {
      return new NextResponse(
        JSON.stringify(data.results[0].formatted_address),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ message: "Error fetching address" }),
        { status: 400 }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error fetching address" }),
      { status: 400 }
    );
  }
}
