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

const SKU_LISTS = {
  ["love"]: [
    "BAC7NHXNJ",
    "UKPGMHZ9K",
    "GUNCXMRMJ",
    "V2BJNTFXD",
    "MN6KJXVQ6",
    "SAESJQ6WG",
    "LMEGGJQXL",
    "46UQFXLE5"
  ],
  ["professional"]: [
    "JTNWEMXLP",
    "6L8RKNC9F",
    "ZC9HKPGA5",
    "G4KWNV8X6"
  ],
  ["personal"]: [
    "C3HWK68SD",
    "GMRPQ24K2",
    "P5G5AJFK3",
    "C7TQPZ2P7",
    "Q6NZNLZUU",
    "QPAJSXWKG"
  ]
} as { [key: string]: string[] };

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

          const maps = new Array<string>();

          console.log(`Searching products... ${resource.items.data.length}`);
          console.log(resource.items.data);

          const querySkuLists = `
            SELECT * FROM karmic_maps
          `
          const { rows: skuLists } = await connection.queryObject<{
              created_at: string;
              id: number;
              selected_map: string;
              skus: string[];
          }>(querySkuLists);

          let lists = {} as typeof SKU_LISTS;

          if (skuLists.length !== 0) {
            for (const map of skuLists) {
              lists[map.selected_map] = map.skus;
            }
          } else {
            lists = SKU_LISTS;
          }

          for (const item of resource.items.data) {
            const sku = item.item_sku as string;

            for (const map in lists) {
              const list = lists[map];

              if (list.includes(sku)) {
                console.log(`SKU FOUND: ${sku} on ${map}`);
                maps.push(map);
                break;
              }
            }
          }

          const map_choosen = maps[0] ?? null;
          const maps_available_json = JSON.stringify(maps).replace("[", "{").replace("]", "}");

          const sql = `
            INSERT INTO clients (email, map_choosen, maps_available)
            VALUES ('${email}', '${map_choosen}', '${maps_available_json}')
            ON CONFLICT (email)
            DO UPDATE SET
              map_choosen = '${map_choosen}',
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