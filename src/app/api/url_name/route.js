import { NextResponse } from "next/server";
import { neon_sql } from "@/app/lib/neon";

export async function PUT(request) {
  try {
    const data = await request.json();
    console.log("Datos recibidos:", data);

    const id = parseInt(data.id);
    const new_url = data.url;

    const updatedFarm = await neon_sql`
      UPDATE api_url
      SET url = ${new_url}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (updatedFarm.length === 0) {
      return NextResponse.json(
        { error: "No se encontró ninguna entrada con ese ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedFarm[0], { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la URL:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get("id") || "");

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido o no proporcionado" },
        { status: 400 }
      );
    }

    const response = await neon_sql`
      SELECT url FROM api_url WHERE id = ${id};
    `;

    if (response.length === 0) {
      return NextResponse.json(
        { error: "No se encontró ninguna entrada con ese ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(response[0], { status: 200 });

  } catch (error) {
    console.error("Error al obtener la URL:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}