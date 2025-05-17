import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET() {
  try {
    const query = `
      SELECT
        id,
        temperature,
        ambienthumidity,
        humity,
        creation_ts AT TIME ZONE 'UTC' AS creation_ts
        FROM farm
        WHERE creation_ts >= CURRENT_DATE - INTERVAL '1 day'
        AND creation_ts < CURRENT_DATE
    `;

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
