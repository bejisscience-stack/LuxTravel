export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export function getCorsHeaders(methods = "POST, OPTIONS") {
  return {
    ...corsHeaders,
    "Access-Control-Allow-Methods": methods,
  };
}
