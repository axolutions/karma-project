// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import * as postgres from 'https://deno.land/x/postgres@v0.17.0/mod.ts'

const DATABASE_URL = Deno.env.get("SUPABASE_DB_URL")!

const pool = new postgres.Pool(DATABASE_URL, 10, true);

// const YAMPI_ALIAS = "test-karma-project";
// const YAMPI_TOKEN = "226DJTE8k1HUc7wBedRTn9r8whtexjeZNKZAR98j";
// const YAMPI_SECRET_KEY = "sk_jMtaOiD4jTMeiAXb6OzRBvK4K866GR0ToZblN"
// const YAMPI_WEBHOOK_SECRET = "wh_O5KNlzi9rWxwEUoHRWeXYcFHPOI4k7ZngkwND"


console.log("Starting yampi-webhook");

Deno.serve(async (req) => {
  try {
    const connection = await pool.connect();

     try {
      const data = await req.json();
    
      const signature = req.headers.get("X-Yampi-Hmac-SHA256");
      
      if (!signature) {
        return new Response(
          JSON.stringify({ message: "Missing signature" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
      
      // todo: verify signature
      
      console.log("RECEIVED YAMPI WEBHOOK");
      console.log(data.event)
      
      switch (data.event) {
        case "order.paid": {
          const resource = data.resource;
          const customer = resource.customer.data;
          const email = customer.email;
          console.log("Order paid", email);

          // Primeiro, verificar se o cliente já existe e quais mapas ele já possui
          const checkClientSql = `
            SELECT maps_available, map_choosen FROM clients WHERE email = '${email}'
          `;
          
          const clientResult = await connection.queryObject(checkClientSql);
          const existingClient = clientResult.rows[0];
          
          // Array para armazenar todos os mapas que o cliente terá
          let allMaps = new Array<string>();
          
          // Se o cliente já existir, usar seus mapas existentes como base
          if (existingClient) {
            try {
              const existingMaps = existingClient.maps_available;
              if (existingMaps && Array.isArray(existingMaps)) {
                allMaps = [...existingMaps];
              }
            } catch (e) {
              console.error("Erro ao recuperar mapas existentes:", e);
            }
          }
          
          // Mapas da nova compra
          const newPurchasedMaps = new Array<string>();

          for (const item of resource.items.data) {
            const sku = item.item_sku as string;

            if (sku === "BAC7NHXNJ") { // love
              newPurchasedMaps.push("love");
            } else if (sku === "JTNWEMXLP") { // professional
              newPurchasedMaps.push("professional");
            } else if (sku === "C3HWK68SD") { // matrix
              newPurchasedMaps.push("personal");
            }
          }
          
          // Adicionar novos mapas sem duplicar
          for (const map of newPurchasedMaps) {
            if (!allMaps.includes(map)) {
              allMaps.push(map);
            }
          }
          
          // Definir o mapa escolhido como o primeiro da nova compra,
          // apenas se não existir um mapa já escolhido
          let map_choosen = existingClient?.map_choosen;
          if (!map_choosen && newPurchasedMaps.length > 0) {
            map_choosen = newPurchasedMaps[0];
          }
          
          const maps_available_json = JSON.stringify(allMaps).replace("[", "{").replace("]", "}");

          const sql = `
            INSERT INTO clients (email, map_choosen, maps_available) 
            VALUES ('${email}', '${map_choosen}', '${maps_available_json}')
            ON CONFLICT (email)
            DO UPDATE SET
              map_choosen = COALESCE(clients.map_choosen, '${map_choosen}'),
              maps_available = '${maps_available_json}'
          `

          const result = await connection.queryObject(sql)
          console.log(result);
          console.log("Data", data);

          return new Response(
            null,
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        }
        default:
          console.error("Unknown event", data.event);
          break;
      }
      
      return new Response(
        null,
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
     } finally {
        connection.release();
     }
    
    } catch (error) {
      console.log(error);
    }

    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  });
  });