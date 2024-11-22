import mqtt from "mqtt";

const client = mqtt.connect("mqtt://broker.hivemq.com"); // Cambia la URL si usas otro broker

client.on("connect", () => {
  console.log("Conectado al broker MQTT");
  client.subscribe("esp32/timestamps", (err) => {
    if (err) {
      console.error("Error al suscribirse al tópico:", err);
    } else {
      console.log("Suscrito al tópico esp32/timestamps");
    }
  });
});

client.on("message", (topic, message) => {
  if (topic === "esp32/timestamps") {
    try {
      const data = JSON.parse(message.toString());
      const arduinoDate = new Date(data.arduinoTimestamp);
      const esp32Date = new Date(data.esp32Timestamp);

      console.log("Datos recibidos:", {
        arduinoDate,
        esp32Date,
      });
    } catch (error) {
      console.error("Error al procesar el mensaje:", error);
    }
  }
});

export default client;
