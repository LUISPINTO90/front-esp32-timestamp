import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { arduinoTimestamp, esp32Timestamp, timeDiff } = body;

    const newMessage = await prisma.timestampMessage.create({
      data: {
        arduinoTimestamp: new Date(arduinoTimestamp),
        esp32Timestamp: new Date(esp32Timestamp),
        timeDiff,
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("❌ Error al guardar mensaje:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
