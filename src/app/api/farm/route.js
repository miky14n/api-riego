import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon"; // Assuming you have your Neon connection setup here

export async function GET() {
  try {
    const farms = await neon_sql`SELECT * FROM farm`;
    return NextResponse.json(farms, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log(data);
    const { temperature, ambientHumidity, humity } = data;

    // Insert data using neon_sql
    const newFarm = await neon_sql`
      INSERT INTO farm (temperature, ambientHumidity, humity, creation_ts)
      VALUES (${temperature}, ${ambientHumidity || null}, ${humity}, NOW())
      RETURNING *;
    `;

    return NextResponse.json(newFarm[0], { status: 201 }); // Return the inserted row
  } catch (error) {
    console.error("Error al insertar los datos del sensor:", error);
    return NextResponse.json(
      { error: "Error al insertar los datos del sensor" },
      { status: 500 }
    );
  }
}
