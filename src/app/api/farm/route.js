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
    console.log("Datos recibidos:", data);

    // Asegurar que los valores sean enteros
    const temperature = parseInt(data.temperature);
    const ambientHumidity = data.ambientHumidity
      ? parseInt(data.ambientHumidity)
      : null;
    const humity = parseInt(data.humity);
    /**const creation_ts = new Date().toLocaleString("es-BO", {
      timeZone: "America/La_Paz",
    }); */
    const creation_ts = new Date()
      .toLocaleString("sv-SE", { timeZone: "America/La_Paz" })
      .replace(" ", "T");
    if (isNaN(temperature) || isNaN(humity)) {
      return NextResponse.json(
        { error: "Datos inválidos, deben ser enteros" },
        { status: 400 }
      );
    }

    // Insertar en la base de datos
    const newFarm = await neon_sql`
      INSERT INTO farm (temperature, ambientHumidity, humity, creation_ts)
      VALUES (${temperature}, ${ambientHumidity}, ${humity}, ${creation_ts})
      RETURNING *;
    `;

    return NextResponse.json(newFarm[0], { status: 201 });
  } catch (error) {
    console.error("Error al insertar los datos del sensor:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
