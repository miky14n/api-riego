import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");
    let orderBy = "";
    if (filter === "asc") {
      orderBy = "ORDER BY creation_ts ASC";
    } else if (filter === "dsc") {
      orderBy = "ORDER BY creation_ts DESC";
    }
    const query = `SELECT * FROM farm ${orderBy}`;
    const farms = await neon_sql(query);

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
    const temperature = parseInt(data.temperature);
    const ambientHumidity = data.ambientHumidity
      ? parseInt(data.ambientHumidity)
      : null;
    const humity = parseInt(data.humity);
    const creation_ts = new Date()
      .toLocaleString("sv-SE", { timeZone: "America/La_Paz" })
      .replace(" ", "T");
    if (isNaN(temperature) || isNaN(humity)) {
      return NextResponse.json(
        { error: "Datos inválidos, deben ser enteros" },
        { status: 400 }
      );
    }
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
