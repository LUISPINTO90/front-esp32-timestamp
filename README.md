
# Front ESP32 Timestamp

## Pasos para ejecutar el proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/LUISPINTO90/front-esp32-timestamp.git
   ```

2. Entrar al directorio del proyecto:

   ```bash
   cd .\front-esp32-timestamp\
   ```

3. Abrir el proyecto en Visual Studio Code:

   ```bash
   code .
   ```

4. Instalar las dependencias:

   ```bash
   npm i --force
   ```

5. Levantar los servicios con Docker Compose:

   ```bash
   docker-compose up -d
   ```

6. Crear un archivo `.env` con el siguiente contenido:

   ```env
   DATABASE_URL=postgresql://admin:admin@localhost:5432/mqtt_database
   ```

7. Generar el cliente de Prisma:

   ```bash
   npx prisma generate
   ```

8. Aplicar las migraciones de la base de datos:

   ```bash
   npx prisma migrate dev --name init
   ```

## Visualizar la base de datos con PgAdmin

1. Abrir PgAdmin y realizar lo siguiente:

   - Crear un grupo de servidores:
     - **Name**: `Mqtt`

2. Dentro de este grupo, registrar un nuevo servidor:
   - **Name**: `mqtt_postgres`

3. En la pestaña **Connection**, configurar los siguientes campos:
   - **Host name/address**: `localhost`
   - **Maintenance database**: `mqtt_database`
   - **Username**: `admin`
   - **Password**: `admin`

4. Navegar en la estructura:
   ```
   Mqtt > Databases > mqtt_database > Schemas > Tables > TimestampMessage
   ```

5. Dar clic derecho en `TimestampMessage` y seleccionar:
   - `View/Edit Data > All Rows`

6. Para verificar cambios al enviar un tópico (`esp32/timestamps`) desde **MQTTX**:
   - Presionar `fn + F5` o el ícono de **Execute Script**.

## Ejecutar el Frontend

1. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

El frontend debería estar funcionando. Al enviar un tópico (`esp32/timestamps`) desde **MQTTX**, los datos se guardarán en la base de datos y se mostrarán en el frontend.