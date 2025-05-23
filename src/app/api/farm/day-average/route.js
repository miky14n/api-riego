import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function GET() {
  try {
    const query = `
      SELECT 
        EXTRACT(HOUR FROM creation_ts AT TIME ZONE 'UTC') AS hour,
        AVG(temperature) AS avg_temperature,
        AVG(ambienthumidity) AS avg_ambienthumidity,
        AVG(humity) AS avg_humidity
      FROM farm
      WHERE creation_ts >= DATE_TRUNC('day', NOW() AT TIME ZONE 'UTC')
        AND creation_ts <= NOW() AT TIME ZONE 'UTC'
      GROUP BY hour
      ORDER BY hour
    `;

    const result = await neon_sql(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json(
      { error: "Error al obtener los promedios" },
      { status: 500 }
    );
  }
}
