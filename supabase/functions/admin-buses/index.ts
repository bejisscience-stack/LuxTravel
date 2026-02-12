import { createClient } from "@supabase/supabase-js";
import { getCorsHeaders } from "../_shared/cors.ts";

const corsHeaders = getCorsHeaders("DELETE, OPTIONS");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "DELETE") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // --- Auth: verify the JWT from the Authorization header ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Missing authorization token" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Create a client scoped to the caller's JWT to verify identity
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  // --- Parse and validate bus ID ---
  const url = new URL(req.url);
  const busId = url.searchParams.get("id");

  if (!busId) {
    return jsonResponse({ error: "Bus ID is required" }, 400);
  }

  if (!UUID_REGEX.test(busId)) {
    return jsonResponse({ error: "Invalid bus ID format" }, 400);
  }

  // --- Use service role client for the actual operations ---
  const adminClient = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch the bus to get its photos
    const { data: bus, error: fetchError } = await adminClient
      .from("buses")
      .select("photos")
      .eq("id", busId)
      .single();

    if (fetchError || !bus) {
      return jsonResponse({ error: "Bus not found" }, 404);
    }

    // Delete photos from storage (don't swallow errors)
    if (bus.photos && bus.photos.length > 0) {
      const filePaths = bus.photos
        .map((photoUrl: string) => {
          const parts = photoUrl.split(
            "/storage/v1/object/public/bus-images/"
          );
          return parts.length > 1 ? parts[1] : null;
        })
        .filter((p: string | null): p is string => p !== null);

      if (filePaths.length > 0) {
        const { error: storageError } = await adminClient.storage
          .from("bus-images")
          .remove(filePaths);

        if (storageError) {
          console.error("Storage deletion error:", storageError);
          return jsonResponse(
            {
              error: "Failed to delete bus images from storage",
              details: storageError.message,
            },
            500
          );
        }
      }
    }

    // Delete the bus record
    const { error: deleteError } = await adminClient
      .from("buses")
      .delete()
      .eq("id", busId);

    if (deleteError) {
      console.error("Bus deletion error:", deleteError);
      return jsonResponse(
        { error: "Failed to delete bus", details: deleteError.message },
        500
      );
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
