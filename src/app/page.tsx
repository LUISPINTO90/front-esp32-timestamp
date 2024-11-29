'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TimestampMessage {
  arduinoTimestamp: string;
  esp32Timestamp: string;
  serverTimestamp: string;
  _id: number;
}

const MQTTDashboard = () => {
  const [messages, setMessages] = useState<TimestampMessage[]>([]);

  console.log('render');
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/messages`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const deleteMessages = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/messages`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        setMessages([]);
      } else {
        const error = await res.text();
        console.error('Failed to delete messages:', error);
      }
    } catch (err) {
      console.error('Error deleting messages:', err);
    }
  };

  const publishMessage = async (messageType: 'New' | 'Toggle') => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/messages/publish`, // Removed extra slash
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageType }),
        }
      );

      if (!res.ok) {
        throw new Error('Failed to publish message');
      }
    } catch (err) {
      console.error(err);
    }
  };

  //   const mqttClient = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URL || '', {
  //     clientId: `nextjs_${Math.random().toString(16).slice(2, 8)}`,
  //     clean: true,
  //     connectTimeout: 4000,
  //     reconnectPeriod: 1000,
  //     protocol: 'mqtt',
  //   });

  //   mqttClient.on('connect', () => {
  //     setConnected(true);
  //     setConnectionStatus('Conectado');
  //     mqttClient.subscribe('esp32/timestamps');
  //   });

  //   mqttClient.on('message', async (topic, message) => {
  //     if (topic === 'esp32/timestamps') {
  //       try {
  //         const payload = JSON.parse(message.toString());
  //         const arduinoDate = new Date(payload.arduinoTimestamp);
  //         const esp32Date = new Date(payload.esp32Timestamp);

  //         const timeDiff = (esp32Date.getTime() - arduinoDate.getTime()) / 1000;

  //         const newMessage: TimestampMessage = {
  //           arduinoTimestamp: payload.arduinoTimestamp,
  //           esp32Timestamp: payload.esp32Timestamp,
  //           timeDiff,
  //           receivedAt: new Date().toISOString(),
  //           id: Date.now(),
  //         };

  //         // Enviar al servidor
  //         await fetch('/api/messages', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(newMessage),
  //         });

  //         setMessages(prev => [...prev, newMessage]);
  //       } catch (error) {
  //         console.error('❌ Error al procesar el mensaje:', error);
  //       }
  //     }
  //   });

  //   setClient(mqttClient);

  //   return () => {
  //     if (mqttClient) {
  //       mqttClient.end();
  //     }
  //   };
  // }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              ESP32-Arduino Timestamp Monitor
            </CardTitle>
            <div className="flex gap-3">
              <button
                className="py-2 px-4 text-sm font-medium border border-orange-500 bg-orange-100 rounded-[8px] hover:opacity-90 transition-opacity"
                onClick={deleteMessages}
              >
                Borrar registros
              </button>
              <button
                className="py-2 px-4 text-sm font-medium border border-green-500 bg-green-100 rounded-[8px] hover:opacity-90 transition-opacity"
                onClick={() => publishMessage('New')}
              >
                Publicar mensaje
              </button>
              <button
                className="py-2 px-4 text-sm font-medium border border-cyan-500 bg-cyan-100 rounded-[8px] hover:opacity-90 transition-opacity"
                onClick={() => publishMessage('Toggle')}
              >
                Alternar modo
              </button>
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
              {messages.map(msg => {
                const arduinoDate = new Date(msg.arduinoTimestamp);
                const esp32Date = new Date(msg.esp32Timestamp);
                const timeDiff =
                  (esp32Date.getTime() - arduinoDate.getTime()) / 1000;

                return (
                  <TableRow key={msg._id}>
                    <TableCell>{arduinoDate.toLocaleString()}</TableCell>
                    <TableCell>{esp32Date.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={timeDiff > 5 ? 'destructive' : 'default'}>
                        {timeDiff.toFixed(2)}s
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(msg.serverTimestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MQTTDashboard;
