"use client";

import React, { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TimestampMessage {
  arduinoTimestamp: string;
  esp32Timestamp: string;
  timeDiff: number;
  receivedAt: string;
  id: number;
}

const MQTTDashboard = () => {
  const [messages, setMessages] = useState<TimestampMessage[]>([]);
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Iniciando...");

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();

    const mqttClient = mqtt.connect("wss://broker.emqx.io:8084/mqtt", {
      clientId: `nextjs_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      protocol: "wss",
    });

    mqttClient.on("connect", () => {
      setConnected(true);
      setConnectionStatus("Conectado");
      mqttClient.subscribe("esp32/timestamps");
    });

    mqttClient.on("message", async (topic, message) => {
      if (topic === "esp32/timestamps") {
        try {
          const payload = JSON.parse(message.toString());
          const arduinoDate = new Date(payload.arduinoTimestamp);
          const esp32Date = new Date(payload.esp32Timestamp);

          const timeDiff = (esp32Date.getTime() - arduinoDate.getTime()) / 1000;

          const newMessage: TimestampMessage = {
            arduinoTimestamp: payload.arduinoTimestamp,
            esp32Timestamp: payload.esp32Timestamp,
            timeDiff,
            receivedAt: new Date().toISOString(),
            id: Date.now(),
          };

          // Enviar al servidor
          await fetch("/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMessage),
          });

          setMessages((prev) => [...prev, newMessage]);
        } catch (error) {
          console.error("❌ Error al procesar el mensaje:", error);
        }
      }
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              ESP32 Timestamp Monitor
            </CardTitle>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-500">{connectionStatus}</span>
              <Badge
                variant="default"
                className={
                  connected ? "bg-green-500 rounded" : "bg-red-500 rounded"
                }
              >
                {connected ? "Conectado" : "Desconectado"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arduino Timestamp</TableHead>
                <TableHead>ESP32 Timestamp</TableHead>
                <TableHead>Diferencia (s)</TableHead>
                <TableHead>Recibido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>
                    {new Date(msg.arduinoTimestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(msg.esp32Timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={msg.timeDiff > 5 ? "destructive" : "default"}
                    >
                      {msg.timeDiff.toFixed(2)}s
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(msg.receivedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MQTTDashboard;
